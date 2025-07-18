import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { updateDriverLocationPostGIS } from './postgisService';
import { updateRideTracking } from './postgisService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_TASK_NAME = 'background-location-task';
const DRIVER_TRACKING_KEY = '@driver_tracking_active';
const ACTIVE_RIDE_KEY = '@active_ride_id';

export interface LocationTrackingConfig {
  accuracy: Location.Accuracy;
  timeInterval: number; // in milliseconds
  distanceInterval: number; // in meters
}

// Default configuration for different scenarios
export const trackingConfigs = {
  // When driver is available but no active ride
  available: {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 30000, // 30 seconds
    distanceInterval: 100, // 100 meters
  },
  // When driver has an active ride
  activeRide: {
    accuracy: Location.Accuracy.High,
    timeInterval: 10000, // 10 seconds
    distanceInterval: 50, // 50 meters
  },
  // When driver is offline
  offline: {
    accuracy: Location.Accuracy.Low,
    timeInterval: 300000, // 5 minutes
    distanceInterval: 500, // 500 meters
  },
};

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];
    
    if (location) {
      await handleLocationUpdate(location);
    }
  }
});

// Handle location updates in background
const handleLocationUpdate = async (location: Location.LocationObject) => {
  try {
    // Get driver ID from storage
    const driverId = await AsyncStorage.getItem('@user_id');
    const activeRideId = await AsyncStorage.getItem(ACTIVE_RIDE_KEY);
    
    if (!driverId) return;

    // Update driver location in database
    await updateDriverLocationPostGIS(
      driverId,
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      location.coords.accuracy || undefined,
      location.coords.speed || undefined,
      location.coords.heading || undefined
    );

    // If there's an active ride, update ride tracking
    if (activeRideId) {
      await updateRideTracking(
        activeRideId,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      );
    }

    console.log('Background location updated:', {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      timestamp: new Date(location.timestamp).toISOString(),
    });
  } catch (error) {
    console.error('Error handling background location update:', error);
  }
};

// Start background location tracking
export const startBackgroundLocationTracking = async (
  config: LocationTrackingConfig = trackingConfigs.available
) => {
  try {
    // Request permissions
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      throw new Error('Foreground location permission not granted');
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      throw new Error('Background location permission not granted');
    }

    // Check if task is already defined
    const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      throw new Error('Background location task is not defined');
    }

    // Start location updates
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: config.accuracy,
      timeInterval: config.timeInterval,
      distanceInterval: config.distanceInterval,
      deferredUpdatesInterval: config.timeInterval,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'RideApp is tracking your location',
        notificationBody: 'This helps riders see your location while you\'re driving.',
        notificationColor: '#FF6B6B',
      },
    });

    // Mark tracking as active
    await AsyncStorage.setItem(DRIVER_TRACKING_KEY, 'true');
    
    console.log('Background location tracking started');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error starting background location tracking:', error);
    return { success: false, error: error.message };
  }
};

// Stop background location tracking
export const stopBackgroundLocationTracking = async () => {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }

    // Mark tracking as inactive
    await AsyncStorage.removeItem(DRIVER_TRACKING_KEY);
    
    console.log('Background location tracking stopped');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error stopping background location tracking:', error);
    return { success: false, error: error.message };
  }
};

// Update tracking configuration
export const updateTrackingConfig = async (config: LocationTrackingConfig) => {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    
    if (hasStarted) {
      // Stop and restart with new config
      await stopBackgroundLocationTracking();
      await startBackgroundLocationTracking(config);
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Set active ride (for enhanced tracking)
export const setActiveRide = async (rideId: string | null) => {
  try {
    if (rideId) {
      await AsyncStorage.setItem(ACTIVE_RIDE_KEY, rideId);
      // Switch to active ride tracking config
      await updateTrackingConfig(trackingConfigs.activeRide);
    } else {
      await AsyncStorage.removeItem(ACTIVE_RIDE_KEY);
      // Switch back to available tracking config
      await updateTrackingConfig(trackingConfigs.available);
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Check if location tracking is active
export const isLocationTrackingActive = async (): Promise<boolean> => {
  try {
    const isActive = await AsyncStorage.getItem(DRIVER_TRACKING_KEY);
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    return isActive === 'true' && hasStarted;
  } catch (error) {
    console.error('Error checking location tracking status:', error);
    return false;
  }
};

// Get current location permissions
export const getLocationPermissions = async () => {
  try {
    const foreground = await Location.getForegroundPermissionsAsync();
    const background = await Location.getBackgroundPermissionsAsync();
    
    return {
      foreground: foreground.status,
      background: background.status,
      canAskAgain: foreground.canAskAgain && background.canAskAgain,
    };
  } catch (error) {
    console.error('Error getting location permissions:', error);
    return {
      foreground: 'undetermined',
      background: 'undetermined',
      canAskAgain: true,
    };
  }
};

// Get last known location
export const getLastKnownLocation = async () => {
  try {
    const location = await Location.getLastKnownPositionAsync({
      requiredAccuracy: 100,
      maxAge: 60000, // 1 minute
    });
    
    return location ? {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    } : null;
  } catch (error) {
    console.error('Error getting last known location:', error);
    return null;
  }
};

// Start foreground location tracking (for when app is active)
export const startForegroundLocationTracking = async (
  callback: (location: Location.LocationObject) => void,
  config: LocationTrackingConfig = trackingConfigs.activeRide
) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Foreground location permission not granted');
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: config.accuracy,
        timeInterval: config.timeInterval,
        distanceInterval: config.distanceInterval,
      },
      callback
    );

    return { subscription, error: null };
  } catch (error: any) {
    console.error('Error starting foreground location tracking:', error);
    return { subscription: null, error: error.message };
  }
};

// Initialize location service for driver
export const initializeDriverLocationService = async (driverId: string) => {
  try {
    // Store driver ID for background tasks
    await AsyncStorage.setItem('@user_id', driverId);
    
    // Check and request permissions
    const permissions = await getLocationPermissions();
    
    if (permissions.foreground !== 'granted' || permissions.background !== 'granted') {
      if (permissions.canAskAgain) {
        const foreground = await Location.requestForegroundPermissionsAsync();
        const background = await Location.requestBackgroundPermissionsAsync();
        
        if (foreground.status !== 'granted' || background.status !== 'granted') {
          throw new Error('Location permissions are required for driver functionality');
        }
      } else {
        throw new Error('Location permissions were previously denied. Please enable them in settings.');
      }
    }

    // Get initial location
    const initialLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    if (initialLocation) {
      await updateDriverLocationPostGIS(
        driverId,
        {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        },
        initialLocation.coords.accuracy,
        initialLocation.coords.speed || undefined,
        initialLocation.coords.heading || undefined
      );
    }

    return {
      success: true,
      initialLocation: initialLocation ? {
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
      } : null,
      error: null,
    };
  } catch (error: any) {
    console.error('Error initializing driver location service:', error);
    return {
      success: false,
      initialLocation: null,
      error: error.message,
    };
  }
};

// Configure background fetch for location updates
export const configureBacfroundFetch = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(LOCATION_TASK_NAME, {
      minimumInterval: 15000, // 15 seconds minimum interval
      stopOnTerminate: false, // Continue after app is terminated
      startOnBoot: true, // Start when device boots
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error configuring background fetch:', error);
    return { success: false, error: error.message };
  }
};