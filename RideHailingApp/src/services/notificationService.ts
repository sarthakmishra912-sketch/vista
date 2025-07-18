import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface PushNotificationData {
  type: 'ride_request' | 'ride_accepted' | 'driver_arriving' | 'trip_started' | 'trip_completed' | 'ride_cancelled';
  rideId?: string;
  driverId?: string;
  riderId?: string;
  title: string;
  body: string;
  data?: any;
}

// Register for push notifications
export const registerForPushNotifications = async (): Promise<string | null> => {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      
      if (!projectId) {
        console.log('Project ID not found');
        return null;
      }

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Push token:', token);
    } catch (error) {
      console.log('Error getting push token:', error);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
};

// Store push token in database
export const storePushToken = async (userId: string, token: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ push_token: token })
      .eq('id', userId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    console.log('Error storing push token:', error);
    return { success: false, error: error.message };
  }
};

// Send push notification via Expo
export const sendPushNotification = async (
  expoPushToken: string,
  notification: PushNotificationData
) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: notification.title,
    body: notification.body,
    data: {
      type: notification.type,
      rideId: notification.rideId,
      driverId: notification.driverId,
      riderId: notification.riderId,
      ...notification.data,
    },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('Push notification sent:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error };
  }
};

// Get user's push token from database
export const getUserPushToken = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('push_token')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.push_token || null;
  } catch (error) {
    console.log('Error getting user push token:', error);
    return null;
  }
};

// Notification types for different ride events
export const createRideNotifications = {
  rideRequested: (riderName: string, pickupAddress: string): PushNotificationData => ({
    type: 'ride_request',
    title: 'New Ride Request!',
    body: `${riderName} needs a ride from ${pickupAddress}`,
  }),

  rideAccepted: (driverName: string, vehicleInfo: string): PushNotificationData => ({
    type: 'ride_accepted',
    title: 'Ride Accepted!',
    body: `${driverName} is coming to pick you up in a ${vehicleInfo}`,
  }),

  driverArriving: (driverName: string, eta: number): PushNotificationData => ({
    type: 'driver_arriving',
    title: 'Driver Arriving',
    body: `${driverName} will arrive in ${eta} minutes`,
  }),

  tripStarted: (destination: string): PushNotificationData => ({
    type: 'trip_started',
    title: 'Trip Started',
    body: `Your trip to ${destination} has begun`,
  }),

  tripCompleted: (fare: number): PushNotificationData => ({
    type: 'trip_completed',
    title: 'Trip Completed',
    body: `Your trip is complete. Total fare: $${fare.toFixed(2)}`,
  }),

  rideCancelled: (reason?: string): PushNotificationData => ({
    type: 'ride_cancelled',
    title: 'Ride Cancelled',
    body: reason || 'Your ride has been cancelled',
  }),
};

// Send notification to rider
export const notifyRider = async (
  riderId: string,
  notification: PushNotificationData
) => {
  const pushToken = await getUserPushToken(riderId);
  if (pushToken) {
    return await sendPushNotification(pushToken, notification);
  }
  return { success: false, error: 'No push token found' };
};

// Send notification to driver
export const notifyDriver = async (
  driverId: string,
  notification: PushNotificationData
) => {
  const pushToken = await getUserPushToken(driverId);
  if (pushToken) {
    return await sendPushNotification(pushToken, notification);
  }
  return { success: false, error: 'No push token found' };
};

// Send notification to nearby drivers about a new ride request
export const notifyNearbyDrivers = async (
  pickupLocation: { latitude: number; longitude: number },
  notification: PushNotificationData,
  radiusKm: number = 15
) => {
  try {
    // Get nearby available drivers
    const { data: nearbyDrivers, error } = await supabase.rpc('find_nearby_drivers', {
      pickup_lat: pickupLocation.latitude,
      pickup_lng: pickupLocation.longitude,
      radius_km: radiusKm,
    });

    if (error) throw error;

    // Send notifications to all nearby drivers
    const notifications = nearbyDrivers?.map(async (driver: any) => {
      const pushToken = await getUserPushToken(driver.driver_id);
      if (pushToken) {
        return sendPushNotification(pushToken, {
          ...notification,
          driverId: driver.driver_id,
        });
      }
      return null;
    });

    const results = await Promise.allSettled(notifications || []);
    return { success: true, results };
  } catch (error) {
    console.error('Error notifying nearby drivers:', error);
    return { success: false, error };
  }
};

// Handle incoming notification when app is in foreground
export const handleForegroundNotification = (
  notification: Notifications.Notification,
  onRideRequest?: (rideId: string) => void,
  onRideUpdate?: (rideId: string, status: string) => void
) => {
  const { type, rideId } = notification.request.content.data;

  switch (type) {
    case 'ride_request':
      if (onRideRequest && rideId) {
        onRideRequest(rideId);
      }
      break;
    case 'ride_accepted':
    case 'driver_arriving':
    case 'trip_started':
    case 'trip_completed':
    case 'ride_cancelled':
      if (onRideUpdate && rideId) {
        onRideUpdate(rideId, type);
      }
      break;
    default:
      console.log('Unknown notification type:', type);
  }
};

// Schedule local notification (for testing or offline scenarios)
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: any,
  delay: number = 0
) => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: delay > 0 ? { seconds: delay } : null,
    });
    return { success: true, id };
  } catch (error) {
    console.error('Error scheduling local notification:', error);
    return { success: false, error };
  }
};

// Initialize notification service
export const initializeNotificationService = async (userId: string) => {
  try {
    const token = await registerForPushNotifications();
    if (token) {
      await storePushToken(userId, token);
    }

    // Set up notification listeners
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received in foreground:', notification);
        // Handle foreground notifications here
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response received:', response);
        // Handle notification tap here
      }
    );

    return {
      token,
      unsubscribe: () => {
        foregroundSubscription.remove();
        responseSubscription.remove();
      },
    };
  } catch (error) {
    console.error('Error initializing notification service:', error);
    return { token: null, unsubscribe: () => {} };
  }
};