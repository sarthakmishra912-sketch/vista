import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { useRealTimeRides, useActiveRide } from '../../hooks/useRealTimeRides';
import { 
  acceptRide, 
  updateDriverAvailability, 
  updateDriverLocation,
  getAvailableRides 
} from '../../services/driverService';
import { Location as LocationType, Ride } from '../../types';
import ActiveRideScreen from '../../components/driver/ActiveRideScreen';

const DriverHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { activeRide } = useActiveRide();

  useEffect(() => {
    getCurrentLocation();
    loadAvailableRides();
  }, [isAvailable]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for drivers');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentPos: LocationType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(currentPos);
      
      // Update driver location in database
      if (user?.id) {
        await updateDriverLocation(user.id, currentPos);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const loadAvailableRides = async () => {
    if (!currentLocation || !isAvailable) {
      setAvailableRides([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await getAvailableRides(currentLocation, 15); // 15km radius
      if (error) {
        Alert.alert('Error', error);
      } else {
        setAvailableRides(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load available rides');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (available: boolean) => {
    if (!user?.id) return;

    try {
      const { error } = await updateDriverAvailability(user.id, available);
      if (error) {
        Alert.alert('Error', error);
        return;
      }
      
      setIsAvailable(available);
      
      if (available) {
        await getCurrentLocation();
      } else {
        setAvailableRides([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await acceptRide(rideId, user.id);
      
      if (error) {
        Alert.alert('Error', error);
        return;
      }

      if (data) {
        Alert.alert('Success', 'Ride accepted! Navigate to pickup location.');
        // Remove the accepted ride from available rides
        setAvailableRides(prev => prev.filter(ride => ride.id !== rideId));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to accept ride');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getCurrentLocation();
    await loadAvailableRides();
    setRefreshing(false);
  };

  const formatDistance = (pickup: LocationType) => {
    if (!currentLocation) return '';
    
    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      pickup.latitude,
      pickup.longitude
    );
    
    return `${distance.toFixed(1)} km away`;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number): number => deg * (Math.PI / 180);

  // If driver has an active ride, show the active ride screen
  if (activeRide) {
    return (
      <ActiveRideScreen ride={activeRide} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hello Driver</Text>
          <Text style={styles.userName}>{user?.user_metadata?.name || 'Driver'}</Text>
        </View>
        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
          <Ionicons name="location" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Availability Toggle */}
      <View style={styles.availabilitySection}>
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityHeader}>
            <View style={styles.availabilityInfo}>
              <Text style={styles.availabilityTitle}>Driver Status</Text>
              <Text style={[
                styles.availabilityStatus,
                { color: isAvailable ? '#4CAF50' : '#FF5722' }
              ]}>
                {isAvailable ? 'Available for rides' : 'Offline'}
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={handleToggleAvailability}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {isAvailable && (
            <View style={styles.statusInfo}>
              <View style={styles.statusItem}>
                <Ionicons name="location-outline" size={16} color="#666666" />
                <Text style={styles.statusText}>
                  {currentLocation ? 'Location updated' : 'Getting location...'}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Ionicons name="car-outline" size={16} color="#666666" />
                <Text style={styles.statusText}>Ready to accept rides</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Available Rides */}
      {isAvailable && (
        <ScrollView 
          style={styles.ridesSection}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Rides</Text>
            <Text style={styles.sectionSubtitle}>
              {availableRides.length} rides near you
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading rides...</Text>
            </View>
          ) : availableRides.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={48} color="#E0E0E0" />
              <Text style={styles.emptyStateTitle}>No rides available</Text>
              <Text style={styles.emptyStateSubtitle}>
                New ride requests will appear here
              </Text>
            </View>
          ) : (
            <View style={styles.ridesList}>
              {availableRides.map((ride) => (
                <RideRequestCard
                  key={ride.id}
                  ride={ride}
                  distance={formatDistance(ride.pickup_location as LocationType)}
                  onAccept={() => handleAcceptRide(ride.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {!isAvailable && (
        <View style={styles.offlineState}>
          <Ionicons name="moon-outline" size={64} color="#E0E0E0" />
          <Text style={styles.offlineTitle}>You're offline</Text>
          <Text style={styles.offlineSubtitle}>
            Toggle availability to start receiving ride requests
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const RideRequestCard: React.FC<{
  ride: Ride;
  distance: string;
  onAccept: () => void;
}> = ({ ride, distance, onAccept }) => {
  const pickup = ride.pickup_location as LocationType;
  const destination = ride.destination_location as LocationType;

  return (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.fareContainer}>
          <Text style={styles.fareAmount}>${ride.fare.toFixed(2)}</Text>
          <Text style={styles.rideType}>{ride.ride_type}</Text>
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>{distance}</Text>
        </View>
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routeItem}>
          <View style={styles.pickupDot} />
          <Text style={styles.locationText} numberOfLines={1}>
            {pickup.address || 'Pickup location'}
          </Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeItem}>
          <View style={styles.destinationDot} />
          <Text style={styles.locationText} numberOfLines={1}>
            {destination.address || 'Destination'}
          </Text>
        </View>
      </View>

      <View style={styles.rideDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#666666" />
          <Text style={styles.detailText}>{ride.estimated_duration} min</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="map-outline" size={16} color="#666666" />
          <Text style={styles.detailText}>{ride.distance} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={16} color="#666666" />
          <Text style={styles.detailText}>
            {(ride as any).rider?.name || 'Rider'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
        <Text style={styles.acceptButtonText}>Accept Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  locationButton: {
    padding: 8,
  },
  availabilitySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  availabilityInfo: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  availabilityStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusInfo: {
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  ridesSection: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  ridesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fareContainer: {
    alignItems: 'flex-start',
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  rideType: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'capitalize',
  },
  distanceContainer: {},
  distanceText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  routeInfo: {
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pickupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  destinationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5722',
    marginRight: 12,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginLeft: 3,
    marginVertical: 2,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666666',
  },
  acceptButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  offlineState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  offlineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  offlineSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default DriverHomeScreen;