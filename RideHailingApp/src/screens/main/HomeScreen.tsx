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
import { driverService, Driver } from '../../services/driverService';
import { useAuth } from '../../context/AuthContext';
import * as Location from 'expo-location';

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
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    initializeDriverService();
  }, []);

  // Load nearby drivers when location changes
  useEffect(() => {
    if (currentLocation) {
      loadNearbyDrivers(currentLocation);
    }
  }, [currentLocation]);

  // Set up periodic driver refresh every 30 seconds
  useEffect(() => {
    if (!currentLocation) return;

    const refreshInterval = setInterval(() => {
      if (currentLocation && !isLoadingDrivers) {
        console.log('🔄 Refreshing drivers automatically...');
        loadNearbyDrivers(currentLocation);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, [currentLocation, isLoadingDrivers]);

  /**
   * Initialize driver service and database tables
   */
  const initializeDriverService = async () => {
    try {
      await driverService.initializeTables();
      console.log('✅ Driver service initialized');
    } catch (error) {
      console.error('❌ Error initializing driver service:', error);
    }
  };

  /**
   * Load nearby drivers from the real driver service
   */
  const loadNearbyDrivers = async (location: LocationCoordinate) => {
    try {
      setIsLoadingDrivers(true);
      console.log('🔍 Loading nearby drivers...');

      const drivers = await driverService.findNearbyDrivers(location, 10000); // 10km radius
      setNearbyDrivers(drivers);
      
      console.log(`✅ Loaded ${drivers.length} nearby drivers`);
    } catch (error) {
      console.error('❌ Error loading nearby drivers:', error);
      Alert.alert(
        'Driver Loading Error',
        'Unable to load nearby drivers. Using demo data.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  /**
   * Refresh drivers periodically
   */
  const refreshDrivers = async () => {
    if (currentLocation) {
      await loadNearbyDrivers(currentLocation);
    }
  };

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
      
      // Also refresh drivers when location updates
      if (newLocation) {
        await loadNearbyDrivers(newLocation);
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
    const vehicleInfo = driver.vehicle 
      ? `${driver.vehicle.type} • ${driver.vehicle.color}\n${driver.vehicle.plateNumber}`
      : 'Vehicle info not available';
    
    const additionalInfo = [
      `Rating: ${driver.rating?.toFixed(1) || 'N/A'}⭐`,
      `Total Rides: ${driver.totalRides || 0}`,
      `ETA: ${driver.eta || 'N/A'} minutes`,
      driver.isVerified ? '✅ Verified Driver' : '⚠️ Unverified',
      `Status: ${driver.status}`,
    ].join('\n');

    Alert.alert(
      `${driver.name}${driver.isVerified ? ' ✅' : ''}`,
      `${vehicleInfo}\n\n${additionalInfo}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'View Profile', 
          onPress: () => console.log('View driver profile:', driver.id) 
        },
        { 
          text: 'Select Driver', 
          style: 'default',
          onPress: () => handleSelectDriver(driver)
        },
      ]
    );
  };

  const handleSelectDriver = async (driver: Driver) => {
    try {
      console.log('🚗 Driver selected:', driver.name, driver.id);
      
      // You could navigate to a driver details screen or start booking process
      Alert.alert(
        'Driver Selected',
        `You selected ${driver.name}. This would typically start the booking process.`,
        [{ text: 'OK' }]
      );
      
      // Example: Update driver status to busy (in a real app)
      // await driverService.updateDriverStatus(driver.id, 'busy');
      
    } catch (error) {
      console.error('Error selecting driver:', error);
      Alert.alert('Error', 'Unable to select driver. Please try again.');
    }
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
              {isLoadingLocation 
                ? 'Getting location...' 
                : isLoadingDrivers 
                ? 'Loading drivers...' 
                : 'Where to?'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Location & Refresh Buttons */}
      <View style={styles.locationButtonContainer}>
        <TouchableOpacity 
          style={[styles.locationButton, styles.refreshButton]} 
          onPress={refreshDrivers}
          disabled={isLoadingDrivers}
        >
          <Ionicons 
            name={isLoadingDrivers ? "refresh" : "car"} 
            size={20} 
            color={isLoadingDrivers ? "#999" : "#007AFF"} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.locationButton} 
          onPress={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          <Ionicons 
            name="locate" 
            size={24} 
            color={isLoadingLocation ? "#999" : "#007AFF"} 
          />
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
    flexDirection: 'column',
    gap: 12,
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
  refreshButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});

export default HomeScreen;