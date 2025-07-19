import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanGestureHandler,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddressSearchInput from './AddressSearchInput';
import { googleMapsService, LocationCoordinate, FareEstimate } from '../services/mapsService';

const { height: screenHeight } = Dimensions.get('window');

interface RideType {
  id: string;
  name: string;
  icon: string;
  description: string;
  capacity: number;
  priceMultiplier: number;
  eta: number;
  available: boolean;
}

interface RideBookingCardProps {
  isVisible: boolean;
  onClose: () => void;
  onPickupSelect: (location: LocationCoordinate, address: string) => void;
  onDestinationSelect: (location: LocationCoordinate, address: string) => void;
  onRideBooking: (rideType: string, fareEstimate: FareEstimate) => void;
  pickupLocation?: LocationCoordinate;
  destinationLocation?: LocationCoordinate;
  pickupAddress?: string;
  destinationAddress?: string;
  currentLocation?: LocationCoordinate;
  availableDrivers?: number;
}

const RideBookingCard: React.FC<RideBookingCardProps> = ({
  isVisible,
  onClose,
  onPickupSelect,
  onDestinationSelect,
  onRideBooking,
  pickupLocation,
  destinationLocation,
  pickupAddress = '',
  destinationAddress = '',
  currentLocation,
  availableDrivers = 0,
}) => {
  const [cardHeight] = useState(new Animated.Value(0));
  const [dragY] = useState(new Animated.Value(0));
  const [fareEstimates, setFareEstimates] = useState<Record<string, FareEstimate>>({});
  const [selectedRideType, setSelectedRideType] = useState<string>('economy');
  const [loading, setLoading] = useState(false);
  const [searchStep, setSearchStep] = useState<'pickup' | 'destination' | 'booking'>('pickup');

  const rideTypes: RideType[] = [
    {
      id: 'economy',
      name: 'RideGo',
      icon: 'car',
      description: 'Affordable everyday rides',
      capacity: 4,
      priceMultiplier: 1.0,
      eta: 3,
      available: true,
    },
    {
      id: 'comfort',
      name: 'RideComfort',
      icon: 'car-sport',
      description: 'Newer cars with extra legroom',
      capacity: 4,
      priceMultiplier: 1.3,
      eta: 5,
      available: true,
    },
    {
      id: 'premium',
      name: 'RidePremium',
      icon: 'diamond',
      description: 'High-end cars and top drivers',
      capacity: 4,
      priceMultiplier: 1.8,
      eta: 8,
      available: availableDrivers > 0,
    },
    {
      id: 'xl',
      name: 'RideXL',
      icon: 'bus',
      description: 'Larger vehicles for groups',
      capacity: 6,
      priceMultiplier: 1.5,
      eta: 6,
      available: true,
    },
  ];

  useEffect(() => {
    if (isVisible) {
      showCard();
    } else {
      hideCard();
    }
  }, [isVisible]);

  useEffect(() => {
    if (pickupLocation && destinationLocation) {
      calculateFareEstimates();
      setSearchStep('booking');
    } else if (pickupLocation && !destinationLocation) {
      setSearchStep('destination');
    } else {
      setSearchStep('pickup');
    }
  }, [pickupLocation, destinationLocation]);

  const showCard = () => {
    Animated.spring(cardHeight, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const hideCard = () => {
    Animated.spring(cardHeight, {
      toValue: 0,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  const calculateFareEstimates = async () => {
    if (!pickupLocation || !destinationLocation) return;

    setLoading(true);
    try {
      const directions = await googleMapsService.getDirections(pickupLocation, destinationLocation);
      
      if (directions) {
        const estimates: Record<string, FareEstimate> = {};
        
        rideTypes.forEach(rideType => {
          const baseEstimate = googleMapsService.calculateFareEstimate(
            directions.distance.value,
            directions.duration.value,
            rideType.id
          );
          
          estimates[rideType.id] = {
            ...baseEstimate,
            total: baseEstimate.total * rideType.priceMultiplier,
            subtotal: baseEstimate.subtotal * rideType.priceMultiplier,
          };
        });
        
        setFareEstimates(estimates);
      }
    } catch (error) {
      console.error('Error calculating fare estimates:', error);
      Alert.alert('Error', 'Unable to calculate fare estimates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickupSelect = (location: LocationCoordinate, address: string) => {
    onPickupSelect(location, address);
  };

  const handleDestinationSelect = (location: LocationCoordinate, address: string) => {
    onDestinationSelect(location, address);
  };

  const handleRideTypeSelect = (rideTypeId: string) => {
    setSelectedRideType(rideTypeId);
  };

  const handleBookRide = () => {
    const selectedFare = fareEstimates[selectedRideType];
    if (selectedFare) {
      onRideBooking(selectedRideType, selectedFare);
    }
  };

  const formatPrice = (price: number): string => {
    return `₹${Math.round(price)}`;
  };

  const formatETA = (minutes: number): string => {
    return `${minutes} min`;
  };

  const cardTranslateY = cardHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const renderSearchStep = () => {
    switch (searchStep) {
      case 'pickup':
        return (
          <View style={styles.searchContainer}>
            <Text style={styles.stepTitle}>Where are you?</Text>
            <AddressSearchInput
              placeholder="Enter pickup location"
              onLocationSelect={(location) => {
                const address = 'Selected pickup location';
                handlePickupSelect(location, address);
              }}
              currentLocation={currentLocation}
              showCurrentLocationButton={true}
              autoFocus={true}
            />
          </View>
        );

      case 'destination':
        return (
          <View style={styles.searchContainer}>
            <View style={styles.locationRow}>
              <View style={styles.locationDot} />
              <Text style={styles.locationText} numberOfLines={1}>
                {pickupAddress || 'Pickup location'}
              </Text>
            </View>
            
            <View style={styles.locationConnector} />
            
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, styles.destinationDot]} />
              <View style={styles.destinationInput}>
                <AddressSearchInput
                  placeholder="Where to?"
                  onLocationSelect={(location) => {
                    const address = 'Selected destination';
                    handleDestinationSelect(location, address);
                  }}
                  currentLocation={pickupLocation}
                  autoFocus={true}
                />
              </View>
            </View>
          </View>
        );

      case 'booking':
        return (
          <View style={styles.bookingContainer}>
            {renderFareEstimates()}
          </View>
        );

      default:
        return null;
    }
  };

  const renderFareEstimates = () => (
    <ScrollView style={styles.fareContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Choose a ride</Text>
      
      {rideTypes.map((rideType) => {
        const fareEstimate = fareEstimates[rideType.id];
        const isSelected = selectedRideType === rideType.id;
        
        return (
          <TouchableOpacity
            key={rideType.id}
            style={[
              styles.rideTypeCard,
              isSelected && styles.rideTypeCardSelected,
              !rideType.available && styles.rideTypeCardDisabled,
            ]}
            onPress={() => rideType.available && handleRideTypeSelect(rideType.id)}
            disabled={!rideType.available}
          >
            <View style={styles.rideTypeIcon}>
              <Ionicons 
                name={rideType.icon as any} 
                size={28} 
                color={isSelected ? '#007AFF' : '#666'} 
              />
            </View>
            
            <View style={styles.rideTypeInfo}>
              <Text style={[styles.rideTypeName, isSelected && styles.selectedText]}>
                {rideType.name}
              </Text>
              <Text style={styles.rideTypeDescription}>
                {rideType.description}
              </Text>
              <Text style={styles.rideTypeCapacity}>
                {rideType.capacity} seats • {formatETA(rideType.eta)} away
              </Text>
            </View>
            
            <View style={styles.rideTypePrice}>
              {loading ? (
                <Text style={styles.priceLoading}>Calculating...</Text>
              ) : fareEstimate ? (
                <Text style={[styles.price, isSelected && styles.selectedText]}>
                  {formatPrice(fareEstimate.total)}
                </Text>
              ) : (
                <Text style={styles.priceUnavailable}>N/A</Text>
              )}
              {!rideType.available && (
                <Text style={styles.unavailableText}>Unavailable</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      
      {searchStep === 'booking' && fareEstimates[selectedRideType] && (
        <View style={styles.bookingActions}>
          <View style={styles.fareBreakdown}>
            <Text style={styles.fareBreakdownTitle}>Fare Breakdown</Text>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Base fare</Text>
              <Text style={styles.fareValue}>
                {formatPrice(fareEstimates[selectedRideType].baseFare)}
              </Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Distance</Text>
              <Text style={styles.fareValue}>
                {formatPrice(fareEstimates[selectedRideType].distanceFare)}
              </Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Time</Text>
              <Text style={styles.fareValue}>
                {formatPrice(fareEstimates[selectedRideType].timeFare)}
              </Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Taxes</Text>
              <Text style={styles.fareValue}>
                {formatPrice(fareEstimates[selectedRideType].taxes)}
              </Text>
            </View>
            <View style={[styles.fareRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatPrice(fareEstimates[selectedRideType].total)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.bookButton} onPress={handleBookRide}>
            <Text style={styles.bookButtonText}>
              Book {rideTypes.find(rt => rt.id === selectedRideType)?.name}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: cardTranslateY }],
        },
      ]}
    >
      <View style={styles.handle} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={hideCard}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        
        {searchStep === 'booking' && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setSearchStep('destination')}
          >
            <Ionicons name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
        )}
        
        <Text style={styles.headerTitle}>Book a Ride</Text>
      </View>
      
      {renderSearchStep()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: screenHeight * 0.8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 8,
    marginLeft: 'auto',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  searchContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 16,
  },
  destinationDot: {
    backgroundColor: '#F44336',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  locationConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#DDD',
    marginLeft: 5,
    marginBottom: 8,
  },
  destinationInput: {
    flex: 1,
  },
  bookingContainer: {
    flex: 1,
  },
  fareContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  rideTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  rideTypeCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  rideTypeCardDisabled: {
    opacity: 0.5,
  },
  rideTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rideTypeInfo: {
    flex: 1,
  },
  rideTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  rideTypeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rideTypeCapacity: {
    fontSize: 12,
    color: '#999',
  },
  rideTypePrice: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceLoading: {
    fontSize: 14,
    color: '#999',
  },
  priceUnavailable: {
    fontSize: 14,
    color: '#999',
  },
  unavailableText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 2,
  },
  selectedText: {
    color: '#007AFF',
  },
  bookingActions: {
    marginTop: 20,
  },
  fareBreakdown: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fareBreakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 14,
    color: '#666',
  },
  fareValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RideBookingCard;