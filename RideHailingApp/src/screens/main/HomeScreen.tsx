import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomMapView from '../../components/MapView';
import RideBookingCard from '../../components/RideBookingCard';
import { googleMapsService, LocationCoordinate, FareEstimate } from '../../services/mapsService';
import { useAuth } from '../../context/AuthContext';
import * as Location from 'expo-location';

interface Driver {
  id: string;
  name: string;
  lat: number;
  lng: number;
  heading?: number;
  vehicle?: {
    type: string;
    color: string;
    plateNumber: string;
  };
  rating?: number;
  eta?: number;
}

const HomeScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  
  // State for locations
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinate | null>(null);
  const [pickupLocation, setPickupLocation] = useState<LocationCoordinate | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<LocationCoordinate | null>(null);
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');

  // State for drivers and ride
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]);
  const [showBookingCard, setShowBookingCard] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Mock drivers data (in production, this would come from your driver service)
  const mockDrivers: Driver[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      lat: 12.9716 + (Math.random() - 0.5) * 0.01,
      lng: 77.5946 + (Math.random() - 0.5) * 0.01,
      heading: Math.random() * 360,
      vehicle: { type: 'Sedan', color: 'White', plateNumber: 'KA01AB1234' },
      rating: 4.8,
      eta: Math.floor(Math.random() * 10) + 2,
    },
    {
      id: '2',
      name: 'Priya Sharma',
      lat: 12.9716 + (Math.random() - 0.5) * 0.01,
      lng: 77.5946 + (Math.random() - 0.5) * 0.01,
      heading: Math.random() * 360,
      vehicle: { type: 'Hatchback', color: 'Blue', plateNumber: 'KA02CD5678' },
      rating: 4.9,
      eta: Math.floor(Math.random() * 10) + 2,
    },
    {
      id: '3',
      name: 'Amit Patel',
      lat: 12.9716 + (Math.random() - 0.5) * 0.01,
      lng: 77.5946 + (Math.random() - 0.5) * 0.01,
      heading: Math.random() * 360,
      vehicle: { type: 'SUV', color: 'Black', plateNumber: 'KA03EF9012' },
      rating: 4.7,
      eta: Math.floor(Math.random() * 10) + 2,
    },
  ];

  useEffect(() => {
    getCurrentLocation();
    setNearbyDrivers(mockDrivers);
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable location permissions to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() },
          ]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      setCurrentLocation(newLocation);
      
      // Get address for current location
      const address = await googleMapsService.reverseGeocode(
        newLocation.lat, 
        newLocation.lng
      );
      
      if (address) {
        setPickupLocation(newLocation);
        setPickupAddress(address.formattedAddress);
      }
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Error',
        'Unable to get your current location. Please check your location settings.',
        [
          { text: 'OK' },
          { text: 'Retry', onPress: getCurrentLocation },
        ]
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleShowBookingCard = () => {
    setShowBookingCard(true);
  };

  const handleCloseBookingCard = () => {
    setShowBookingCard(false);
  };

  const handlePickupSelect = async (location: LocationCoordinate, address: string) => {
    setPickupLocation(location);
    
    // Get formatted address
    try {
      const addressData = await googleMapsService.reverseGeocode(location.lat, location.lng);
      setPickupAddress(addressData?.formattedAddress || address);
    } catch (error) {
      setPickupAddress(address);
    }
  };

  const handleDestinationSelect = async (location: LocationCoordinate, address: string) => {
    setDestinationLocation(location);
    
    // Get formatted address
    try {
      const addressData = await googleMapsService.reverseGeocode(location.lat, location.lng);
      setDestinationAddress(addressData?.formattedAddress || address);
    } catch (error) {
      setDestinationAddress(address);
    }
  };

  const handleRideBooking = (rideType: string, fareEstimate: FareEstimate) => {
    Alert.alert(
      'Confirm Booking',
      `Book ${rideType} for ${Math.round(fareEstimate.total)}?\n\nFrom: ${pickupAddress}\nTo: ${destinationAddress}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book Ride',
          onPress: () => {
            // Close booking card
            setShowBookingCard(false);
            
            // Navigate to ride tracking screen
            navigation.navigate('RideTracking', {
              rideType,
              fareEstimate,
              pickupLocation,
              destinationLocation,
              pickupAddress,
              destinationAddress,
            });
          },
        },
      ]
    );
  };

  const handleDriverPress = (driver: Driver) => {
    Alert.alert(
      driver.name,
      `${driver.vehicle?.type} • ${driver.vehicle?.color}\n${driver.vehicle?.plateNumber}\nRating: ${driver.rating}⭐\nETA: ${driver.eta} minutes`,
      [
        { text: 'OK' },
        { text: 'Select Driver', onPress: () => console.log('Driver selected:', driver.id) },
      ]
    );
  };

  const handleMapPress = (coordinate: any) => {
    // Option to set pickup/destination by tapping on map
    if (!pickupLocation) {
      handlePickupSelect(coordinate, 'Selected location');
    } else if (!destinationLocation) {
      handleDestinationSelect(coordinate, 'Selected location');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Map View */}
      <CustomMapView
        drivers={nearbyDrivers}
        pickupLocation={pickupLocation || undefined}
        dropoffLocation={destinationLocation || undefined}
        currentUserLocation={currentLocation || undefined}
        userType="rider"
        showUserLocation={true}
        followUserLocation={false}
        showTraffic={true}
        searchRadius={5000}
        onDriverPress={handleDriverPress}
        onLocationPress={handleMapPress}
      />

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Search Button */}
      {!showBookingCard && (
        <View style={styles.searchButtonContainer}>
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleShowBookingCard}
            disabled={isLoadingLocation}
          >
            <Ionicons name="search" size={20} color="#666" />
            <Text style={styles.searchButtonText}>
              {isLoadingLocation ? 'Getting location...' : 'Where to?'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Location Button */}
      <View style={styles.locationButtonContainer}>
        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Ride Booking Card */}
      <RideBookingCard
        isVisible={showBookingCard}
        onClose={handleCloseBookingCard}
        onPickupSelect={handlePickupSelect}
        onDestinationSelect={handleDestinationSelect}
        onRideBooking={handleRideBooking}
        pickupLocation={pickupLocation || undefined}
        destinationLocation={destinationLocation || undefined}
        pickupAddress={pickupAddress}
        destinationAddress={destinationAddress}
        currentLocation={currentLocation || undefined}
        availableDrivers={nearbyDrivers.length}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  locationButtonContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 100,
  },
  locationButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default HomeScreen;