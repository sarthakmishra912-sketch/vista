import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { useActiveRide } from '../../hooks/useRealTimeRides';
import { createRide } from '../../services/rideService';
import { Location as LocationType } from '../../types';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { activeRide } = useActiveRide();
  const mapRef = useRef<MapView>(null);
  
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [destination, setDestination] = useState<LocationType | null>(null);
  const [pickupLocation, setPickupLocation] = useState<LocationType | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [selectedRideType, setSelectedRideType] = useState('economy');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const rideTypes = [
    { id: 'economy', name: 'Economy', icon: 'car', price: 1.0, time: '2-5 min' },
    { id: 'comfort', name: 'Comfort', icon: 'car-sport', price: 1.3, time: '3-8 min' },
    { id: 'premium', name: 'Premium', icon: 'car', price: 1.8, time: '5-12 min' },
    { id: 'xl', name: 'XL', icon: 'car', price: 1.5, time: '4-10 min' },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use this app');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentPos: LocationType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(currentPos);
      setPickupLocation(currentPos);

      // Get address for current location
      const reverseGeocode = await Location.reverseGeocodeAsync(currentPos);
      if (reverseGeocode[0]) {
        const address = `${reverseGeocode[0].street || ''} ${reverseGeocode[0].city || ''}`.trim();
        setPickupAddress(address);
      }

      // Center map on current location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...currentPos,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleMapPress = (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    if (!pickupLocation) {
      setPickupLocation(coordinate);
    } else if (!destination) {
      setDestination(coordinate);
      calculateFareAndTime(pickupLocation, coordinate);
    }
  };

  const calculateFareAndTime = (pickup: LocationType, dest: LocationType) => {
    // Simple distance calculation (in a real app, use routing APIs)
    const distance = getDistanceFromLatLonInKm(
      pickup.latitude,
      pickup.longitude,
      dest.latitude,
      dest.longitude
    );
    
    const baseFare = Math.max(5, distance * 2); // Minimum $5, $2 per km
    setEstimatedFare(baseFare);
    setEstimatedTime(Math.max(5, Math.round(distance * 3))); // Minimum 5 min, 3 min per km
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleBookRide = () => {
    if (!pickupLocation || !destination) {
      Alert.alert('Error', 'Please select pickup and destination locations');
      return;
    }
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!user?.id || !pickupLocation || !destination) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    try {
      const rideData = {
        rider_id: user.id,
        pickup_location: pickupLocation,
        destination_location: destination,
        ride_type: selectedRideType as 'economy' | 'comfort' | 'premium' | 'xl',
        payment_method: 'card' as 'cash' | 'card' | 'digital_wallet',
        fare: estimatedFare * (rideTypes.find(r => r.id === selectedRideType)?.price || 1),
        distance: getDistanceFromLatLonInKm(
          pickupLocation.latitude,
          pickupLocation.longitude,
          destination.latitude,
          destination.longitude
        ),
        estimated_duration: estimatedTime,
      };

      const { data, error } = await createRide(rideData);
      
      if (error) {
        Alert.alert('Error', error);
        return;
      }

      Alert.alert('Success', 'Ride booked successfully! Finding a driver...');
      setShowBookingModal(false);
      // Reset selections
      setDestination(null);
      setPickupLocation(currentLocation);
    } catch (error) {
      Alert.alert('Error', 'Failed to book ride. Please try again.');
    }
  };

  const resetSelection = () => {
    setDestination(null);
    setPickupLocation(currentLocation);
    setEstimatedFare(0);
    setEstimatedTime(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return '#FF9800';
      case 'accepted':
        return '#2196F3';
      case 'arriving':
        return '#2196F3';
      case 'in_progress':
        return '#4CAF50';
      default:
        return '#666666';
    }
  };

  const getRideStatusText = (status: string) => {
    switch (status) {
      case 'requested':
        return 'Finding a driver...';
      case 'accepted':
        return 'Driver is on the way';
      case 'arriving':
        return 'Driver is arriving';
      case 'in_progress':
        return 'Trip in progress';
      default:
        return 'Ride status';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.userName}>{user?.user_metadata?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Active Ride Status */}
      {activeRide && (
        <View style={styles.activeRideContainer}>
          <View style={styles.activeRideHeader}>
            <View style={styles.activeRideStatus}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(activeRide.status) }]} />
              <Text style={styles.activeRideStatusText}>
                {getRideStatusText(activeRide.status)}
              </Text>
            </View>
            <Text style={styles.activeRideFare}>${activeRide.fare.toFixed(2)}</Text>
          </View>
          
          {activeRide.driver_id && (
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>
                {(activeRide as any).driver?.name || 'Your driver'}
              </Text>
              <Text style={styles.driverVehicle}>
                {(activeRide as any).driver?.vehicle_info?.color} {(activeRide as any).driver?.vehicle_info?.make}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            value={destinationAddress}
            onChangeText={setDestinationAddress}
          />
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {pickupLocation && (
            <Marker
              coordinate={pickupLocation}
              title="Pickup Location"
              pinColor="#00FF00"
            />
          )}
          {destination && (
            <Marker
              coordinate={destination}
              title="Destination"
              pinColor="#FF0000"
            />
          )}
        </MapView>

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {destination ? (
          <View>
            <View style={styles.rideInfo}>
              <Text style={styles.rideInfoTitle}>Your Trip</Text>
              <View style={styles.rideDetails}>
                <Text style={styles.rideTime}>{estimatedTime} min</Text>
                <Text style={styles.rideFare}>${estimatedFare.toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.resetButton} onPress={resetSelection}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bookButton} onPress={handleBookRide}>
                <Text style={styles.bookButtonText}>Book Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsList}>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="home" size={24} color="#007AFF" />
                <Text style={styles.actionText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="briefcase" size={24} color="#007AFF" />
                <Text style={styles.actionText}>Work</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="location" size={24} color="#007AFF" />
                <Text style={styles.actionText}>Saved</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
              <Ionicons name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose Your Ride</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {rideTypes.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                style={[
                  styles.rideTypeCard,
                  selectedRideType === ride.id && styles.rideTypeCardSelected,
                ]}
                onPress={() => setSelectedRideType(ride.id)}
              >
                <View style={styles.rideTypeLeft}>
                  <Ionicons name={ride.icon as any} size={24} color="#1A1A1A" />
                  <View style={styles.rideTypeInfo}>
                    <Text style={styles.rideTypeName}>{ride.name}</Text>
                    <Text style={styles.rideTypeTime}>{ride.time}</Text>
                  </View>
                </View>
                <Text style={styles.rideTypePrice}>
                  ${(estimatedFare * ride.price).toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.paymentSection}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <TouchableOpacity style={styles.paymentCard}>
                <Ionicons name="card" size={24} color="#1A1A1A" />
                <Text style={styles.paymentText}>**** 1234</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking}>
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  menuButton: {
    padding: 8,
  },
  activeRideContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeRideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeRideStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  activeRideStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  activeRideFare: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  driverInfo: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  driverVehicle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  currentLocationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  rideInfo: {
    marginBottom: 20,
  },
  rideInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideTime: {
    fontSize: 16,
    color: '#666666',
  },
  rideFare: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  bookButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    marginBottom: 10,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  actionsList: {
    flexDirection: 'row',
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rideTypeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rideTypeCardSelected: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
  },
  rideTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rideTypeInfo: {
    marginLeft: 12,
  },
  rideTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  rideTypeTime: {
    fontSize: 14,
    color: '#666666',
  },
  rideTypePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  paymentSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  paymentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HomeScreen;