import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { updateRideStatus, cancelRide, updateDriverLocation } from '../../services/driverService';
import { Ride, Location as LocationType } from '../../types';

interface ActiveRideScreenProps {
  ride: Ride;
}

const ActiveRideScreen: React.FC<ActiveRideScreenProps> = ({ ride }) => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(false);

  const pickup = ride.pickup_location as LocationType;
  const destination = ride.destination_location as LocationType;
  const rider = (ride as any).rider;

  useEffect(() => {
    getCurrentLocation();
    const locationInterval = setInterval(getCurrentLocation, 10000); // Update every 10 seconds

    return () => clearInterval(locationInterval);
  }, []);

  const getCurrentLocation = async () => {
    try {
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
      console.error('Error getting location:', error);
    }
  };

  const handleStatusUpdate = async (newStatus: 'arriving' | 'in_progress' | 'completed') => {
    try {
      setLoading(true);
      const { data, error } = await updateRideStatus(ride.id, newStatus);
      
      if (error) {
        Alert.alert('Error', error);
        return;
      }

      let message = '';
      switch (newStatus) {
        case 'arriving':
          message = 'Marked as arriving at pickup location';
          break;
        case 'in_progress':
          message = 'Trip started! Navigate to destination.';
          break;
        case 'completed':
          message = 'Trip completed successfully!';
          break;
      }
      
      Alert.alert('Success', message);
    } catch (error) {
      Alert.alert('Error', 'Failed to update ride status');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await cancelRide(ride.id, 'Cancelled by driver');
              
              if (error) {
                Alert.alert('Error', error);
              } else {
                Alert.alert('Success', 'Ride has been cancelled');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel ride');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const openNavigation = (lat: number, lng: number, label: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${label}`;
    Linking.openURL(url);
  };

  const callRider = () => {
    if (rider?.phone) {
      Linking.openURL(`tel:${rider.phone}`);
    } else {
      Alert.alert('Error', 'Rider phone number not available');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return '#FF9800';
      case 'arriving':
        return '#2196F3';
      case 'in_progress':
        return '#4CAF50';
      default:
        return '#666666';
    }
  };

  const getNextAction = () => {
    switch (ride.status) {
      case 'accepted':
        return {
          label: 'Arrived at Pickup',
          action: () => handleStatusUpdate('arriving'),
          color: '#2196F3',
        };
      case 'arriving':
        return {
          label: 'Start Trip',
          action: () => handleStatusUpdate('in_progress'),
          color: '#4CAF50',
        };
      case 'in_progress':
        return {
          label: 'Complete Trip',
          action: () => handleStatusUpdate('completed'),
          color: '#4CAF50',
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Header */}
      <View style={styles.statusHeader}>
        <View style={styles.statusInfo}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(ride.status) }]} />
          <View style={styles.statusText}>
            <Text style={styles.statusLabel}>
              {ride.status === 'accepted' && 'Navigate to Pickup'}
              {ride.status === 'arriving' && 'Arriving at Pickup'}
              {ride.status === 'in_progress' && 'Trip in Progress'}
            </Text>
            <Text style={styles.fareAmount}>${ride.fare.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: currentLocation?.latitude || pickup.latitude,
            longitude: currentLocation?.longitude || pickup.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Pickup Marker */}
          <Marker
            coordinate={pickup}
            title="Pickup Location"
            pinColor="#4CAF50"
          />
          
          {/* Destination Marker */}
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="#FF5722"
          />
          
          {/* Driver Current Location */}
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Your Location"
            >
              <View style={styles.driverMarker}>
                <Ionicons name="car" size={20} color="#FFFFFF" />
              </View>
            </Marker>
          )}
        </MapView>

        {/* Navigation Button */}
        <TouchableOpacity
          style={styles.navigationFab}
          onPress={() => {
            const target = ride.status === 'in_progress' ? destination : pickup;
            const label = ride.status === 'in_progress' ? 'Destination' : 'Pickup';
            openNavigation(target.latitude, target.longitude, label);
          }}
        >
          <Ionicons name="navigate" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Ride Details */}
      <ScrollView style={styles.detailsContainer}>
        {/* Rider Information */}
        <View style={styles.riderSection}>
          <View style={styles.riderInfo}>
            <View style={styles.riderAvatar}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.riderDetails}>
              <Text style={styles.riderName}>{rider?.name || 'Rider'}</Text>
              <Text style={styles.riderPhone}>{rider?.phone || 'No phone'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={callRider}>
            <Ionicons name="call" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Route Information */}
        <View style={styles.routeSection}>
          <Text style={styles.sectionTitle}>Route</Text>
          
          <View style={styles.routeItem}>
            <View style={styles.pickupDot} />
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeAddress}>
                {pickup.address || `${pickup.latitude.toFixed(4)}, ${pickup.longitude.toFixed(4)}`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => openNavigation(pickup.latitude, pickup.longitude, 'Pickup')}
            >
              <Ionicons name="navigate-outline" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routeItem}>
            <View style={styles.destinationDot} />
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeAddress}>
                {destination.address || `${destination.latitude.toFixed(4)}, ${destination.longitude.toFixed(4)}`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => openNavigation(destination.latitude, destination.longitude, 'Destination')}
            >
              <Ionicons name="navigate-outline" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.tripSection}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.tripDetails}>
            <View style={styles.tripDetailItem}>
              <Ionicons name="car-outline" size={20} color="#666666" />
              <Text style={styles.tripDetailLabel}>Type</Text>
              <Text style={styles.tripDetailValue}>{ride.ride_type}</Text>
            </View>
            <View style={styles.tripDetailItem}>
              <Ionicons name="map-outline" size={20} color="#666666" />
              <Text style={styles.tripDetailLabel}>Distance</Text>
              <Text style={styles.tripDetailValue}>{ride.distance} km</Text>
            </View>
            <View style={styles.tripDetailItem}>
              <Ionicons name="time-outline" size={20} color="#666666" />
              <Text style={styles.tripDetailLabel}>Duration</Text>
              <Text style={styles.tripDetailValue}>{ride.estimated_duration} min</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <View style={styles.actionButtons}>
          {ride.status !== 'in_progress' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelRide}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          
          {nextAction && (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: nextAction.color }]}
              onPress={nextAction.action}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Updating...' : nextAction.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  fareAmount: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 2,
  },
  helpButton: {
    padding: 8,
  },
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationFab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  riderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  riderDetails: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  riderPhone: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF5722',
    marginRight: 12,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  navigationButton: {
    padding: 8,
  },
  tripSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tripDetails: {
    gap: 12,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  tripDetailLabel: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
    flex: 1,
  },
  tripDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  primaryButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ActiveRideScreen;