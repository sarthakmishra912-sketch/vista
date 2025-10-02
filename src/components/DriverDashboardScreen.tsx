import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { driverApi, DriverProfile } from '../services/driver/driverApi';
import { realTimeService } from '../services/realTimeService';
import DriverTrackingScreen from './DriverTrackingScreen';

interface DriverDashboardScreenProps {
  onBack: () => void;
  onToggleOnline: (isOnline: boolean) => void;
  userEmail?: string | null;
  isOnline?: boolean;
}

export default function DriverDashboardScreen({ 
  onBack, 
  onToggleOnline, 
  userEmail,
  isOnline = false 
}: DriverDashboardScreenProps) {
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(isOnline);
  const [newRideRequest, setNewRideRequest] = useState<any>(null);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'tracking'>('dashboard');
  const [acceptedRide, setAcceptedRide] = useState<any>(null);
  
  // Uber-like driver states
  const [driverState, setDriverState] = useState<'offline' | 'online' | 'looking_for_rides' | 'en_route_to_pickup' | 'arrived_at_pickup' | 'passenger_picked_up' | 'trip_started'>('offline');
  const [isLookingForRides, setIsLookingForRides] = useState(false);

  // Load driver data on component mount
  useEffect(() => {
    const loadDriverData = async () => {
      try {
        setLoading(true);
        console.log('🚗 Loading driver dashboard data...');
        
        // Load driver profile and earnings in parallel
        const [profileData, earningsData] = await Promise.all([
          driverApi.getDriverProfile(),
          driverApi.getDriverEarnings()
        ]);
        
        setDriverProfile(profileData);
        setEarnings(earningsData);
        setOnlineStatus(profileData.is_online || false);
        
        console.log('🚗 Driver dashboard data loaded successfully', {
          profile: profileData,
          earnings: earningsData
        });
      } catch (error) {
        console.error('🚗 Error loading driver dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDriverData();
  }, []);

  // WebSocket connection and ride request handling
  useEffect(() => {
    // Connect to WebSocket
    realTimeService.connect();

    // Join driver room when driver profile is loaded
    if (driverProfile?.driver_id) {
      realTimeService.joinDriverRoom(driverProfile.driver_id);
    }

    // Listen for new ride requests
    realTimeService.onNewRideRequest((rideRequest) => {
      console.log('🚨 NEW RIDE REQUEST:', rideRequest);
      setNewRideRequest(rideRequest);
      setShowRideRequest(true);
      
      // Auto-hide after 30 seconds if not responded
      setTimeout(() => {
        if (showRideRequest) {
          setShowRideRequest(false);
          setNewRideRequest(null);
        }
      }, 30000);
    });

    // Listen for ride taken notifications
    realTimeService.onRideTaken((data) => {
      if (data.rideId === newRideRequest?.rideId) {
        console.log('🚫 Ride taken by another driver');
        setShowRideRequest(false);
        setNewRideRequest(null);
      }
    });

    // Cleanup on unmount
    return () => {
      if (driverProfile?.driver_id) {
        realTimeService.leaveDriverRoom(driverProfile.driver_id);
      }
      realTimeService.removeAllListeners();
    };
  }, [driverProfile?.driver_id, showRideRequest, newRideRequest?.rideId]);

  // Handle GO button - start looking for rides (Uber-like workflow)
  const handleGoOnline = async () => {
    try {
      console.log('🚀 Driver going online and looking for rides...');
      
      const success = await driverApi.updateOnlineStatus(true);
      
      if (success) {
        setOnlineStatus(true);
        setDriverState('looking_for_rides');
        setIsLookingForRides(true);
        onToggleOnline(true);
        
        // Join driver room for ride requests
        if (driverProfile?.driver_id) {
          realTimeService.joinDriverRoom(driverProfile.driver_id);
        }
        
        console.log('✅ Driver is now online and looking for rides');
      } else {
        console.error('❌ Failed to go online:', 'API call failed');
      }
    } catch (error) {
      console.error('❌ Error going online:', error);
    }
  };

  // Handle going offline
  const handleGoOffline = async () => {
    try {
      console.log('🛑 Driver going offline...');
      
      const success = await driverApi.updateOnlineStatus(false);
      
      if (success) {
        setOnlineStatus(false);
        setDriverState('offline');
        setIsLookingForRides(false);
        onToggleOnline(false);
        
        // Leave driver room
        if (driverProfile?.driver_id) {
          realTimeService.leaveDriverRoom(driverProfile.driver_id);
        }
        
        console.log('✅ Driver is now offline');
      } else {
        console.error('❌ Failed to go offline:', 'API call failed');
      }
    } catch (error) {
      console.error('❌ Error going offline:', error);
    }
  };

  // Handle ride request acceptance (Uber-like workflow)
  const handleAcceptRide = () => {
    if (newRideRequest && driverProfile?.driver_id) {
      realTimeService.acceptRideRequest(newRideRequest.rideId, driverProfile.driver_id);
      setShowRideRequest(false);
      setNewRideRequest(null);
      setDriverState('en_route_to_pickup');
      setIsLookingForRides(false);
      console.log('✅ Ride accepted:', newRideRequest.rideId);
      
      // Navigate to tracking screen
      setCurrentScreen('tracking');
      setAcceptedRide(newRideRequest);
    }
  };

  // Handle ride request rejection
  const handleRejectRide = () => {
    if (newRideRequest && driverProfile?.driver_id) {
      realTimeService.rejectRideRequest(newRideRequest.rideId, driverProfile.driver_id);
      setShowRideRequest(false);
      setNewRideRequest(null);
      console.log('❌ Ride rejected:', newRideRequest.rideId);
      // Stay in looking_for_rides state
    }
  };

  // Handle arriving at pickup location
  const handleArrivedAtPickup = () => {
    setDriverState('arrived_at_pickup');
    console.log('🚗 Driver arrived at pickup location - notifying passenger');
    
    // Send notification to passenger via WebSocket
    if (acceptedRide?.rideId && driverProfile?.driver_id) {
      realTimeService.notifyPassengerArrival(acceptedRide.rideId, driverProfile.driver_id);
    }
  };

  // Handle picking up passenger
  const handlePickupPassenger = () => {
    setDriverState('passenger_picked_up');
    console.log('👤 Passenger picked up - ready to start ride');
  };

  // Handle starting trip (Uber-like workflow)
  const handleStartTrip = () => {
    setDriverState('trip_started');
    console.log('🚗 Trip started - navigating to destination');
  };

  // Handle trip completion (Uber-like workflow)
  const handleTripComplete = () => {
    setCurrentScreen('dashboard');
    setAcceptedRide(null);
    setDriverState('looking_for_rides');
    setIsLookingForRides(true);
    console.log('✅ Trip completed, back to looking for rides');
  };

  // Handle trip cancellation
  const handleTripCancel = () => {
    setCurrentScreen('dashboard');
    setAcceptedRide(null);
    setDriverState('looking_for_rides');
    setIsLookingForRides(true);
    console.log('❌ Trip cancelled, back to looking for rides');
  };

  // Show tracking screen if driver accepted a ride
  if (currentScreen === 'tracking' && acceptedRide) {
    return (
      <DriverTrackingScreen
        driver={{
          id: driverProfile?.driver_id || 'driver-id',
          name: driverProfile?.name || 'Driver',
          rating: driverProfile?.rating || 4.8,
          vehicle: driverProfile?.vehicle_info?.model || 'Honda City',
          phone: driverProfile?.phone || '+91 98765 43210',
          rideId: acceptedRide.rideId
        }}
        otp="2323"
        pickupLocation={acceptedRide.pickupLocation?.address || 'Pickup Location'}
        dropLocation={acceptedRide.dropLocation?.address || 'Drop Location'}
        onTripComplete={handleTripComplete}
        onCancel={handleTripCancel}
        isDriverView={true}
        tripState={driverState}
        onStartTrip={handleStartTrip}
        onArrivedAtPickup={handleArrivedAtPickup}
        onPickupPassenger={handlePickupPassenger}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6EFD8' }}>
      {/* Header */}
      <div className="p-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="p-2 rounded-full"
            style={{ color: '#11211e' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl" style={{ 
              fontFamily: 'Samarkan', 
              color: '#11211e',
              fontWeight: 'bold'
            }}>
              Raahi Driver
            </h1>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Driver Profile Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback style={{ backgroundColor: '#c3aa85', color: '#11211e' }}>
                  {loading ? '...' : (driverProfile?.name?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || 'D')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle style={{ color: '#11211e' }}>
                  {loading ? 'Loading...' : (driverProfile?.name || userEmail?.split('@')[0] || 'Driver')}
                </CardTitle>
                <CardDescription style={{ color: '#c3aa85' }}>
                  Professional Driver
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" style={{ backgroundColor: '#cf923d', color: 'white' }}>
                    ⭐ {loading ? '...' : (driverProfile?.rating?.toFixed(1) || '4.8')} Rating
                  </Badge>
                  <Badge variant="outline" style={{ borderColor: '#c3aa85', color: '#11211e' }}>
                    {loading ? '...' : (driverProfile?.total_trips || 127)} Trips
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Uber-like GO Button */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            {driverState === 'offline' && (
              <div>
                <h3 style={{ color: '#11211e', fontWeight: 'bold', marginBottom: '8px' }}>
                  Ready to drive?
                </h3>
                <p style={{ color: '#c3aa85', fontSize: '14px', marginBottom: '16px' }}>
                  Tap GO to start looking for ride requests
                </p>
                <Button 
                  onClick={handleGoOnline}
                  disabled={loading}
                  className="w-full py-4 text-lg font-semibold"
                  style={{ 
                    backgroundColor: '#00D4AA', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px'
                  }}
                >
                  GO
                </Button>
              </div>
            )}
            
            {driverState === 'looking_for_rides' && (
              <div>
                <h3 style={{ color: '#11211e', fontWeight: 'bold', marginBottom: '8px' }}>
                  Looking for rides...
                </h3>
                <p style={{ color: '#c3aa85', fontSize: '14px', marginBottom: '16px' }}>
                  We'll notify you when a ride request comes in
                </p>
                <Button 
                  onClick={handleGoOffline}
                  disabled={loading}
                  variant="outline"
                  className="w-full py-4 text-lg font-semibold"
                  style={{ 
                    borderColor: '#e0e0e0',
                    color: '#666',
                    borderRadius: '12px'
                  }}
                >
                  Go Offline
                </Button>
              </div>
            )}
            
            {driverState === 'en_route_to_pickup' && (
              <div>
                <h3 style={{ color: '#11211e', fontWeight: 'bold', marginBottom: '8px' }}>
                  En route to pickup
                </h3>
                <p style={{ color: '#c3aa85', fontSize: '14px' }}>
                  Navigate to your passenger
                </p>
              </div>
            )}
            
            {driverState === 'arrived_at_pickup' && (
              <div>
                <h3 style={{ color: '#11211e', fontWeight: 'bold', marginBottom: '8px' }}>
                  Arrived at pickup
                </h3>
                <p style={{ color: '#c3aa85', fontSize: '14px' }}>
                  Passenger has been notified
                </p>
              </div>
            )}
            
            {driverState === 'passenger_picked_up' && (
              <div>
                <h3 style={{ color: '#11211e', fontWeight: 'bold', marginBottom: '8px' }}>
                  Passenger picked up
                </h3>
                <p style={{ color: '#c3aa85', fontSize: '14px' }}>
                  Ready to start the ride
                </p>
              </div>
            )}
            
            {driverState === 'trip_started' && (
              <div>
                <h3 style={{ color: '#11211e', fontWeight: 'bold', marginBottom: '8px' }}>
                  Trip in progress
                </h3>
                <p style={{ color: '#c3aa85', fontSize: '14px' }}>
                  Navigate to destination
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div style={{ color: '#cf923d', fontSize: '24px', fontWeight: 'bold' }}>
                {loading ? '...' : `₹${earnings?.today?.amount?.toLocaleString() || '2,450'}`}
              </div>
              <div style={{ color: '#c3aa85', fontSize: '14px' }}>Today's Earnings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div style={{ color: '#cf923d', fontSize: '24px', fontWeight: 'bold' }}>
                {loading ? '...' : (earnings?.today?.trips || 8)}
              </div>
              <div style={{ color: '#c3aa85', fontSize: '14px' }}>Trips Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 style={{ color: '#11211e', fontWeight: 'bold', marginBottom: '16px' }}>
            Quick Actions
          </h3>
          
          <Button 
            className="w-full h-14 justify-start"
            variant="outline"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#c3aa85',
              color: '#11211e'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#cf923d' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 'bold' }}>Trip History</div>
                <div style={{ color: '#c3aa85', fontSize: '14px' }}>View your completed rides</div>
              </div>
            </div>
          </Button>

          <Button 
            className="w-full h-14 justify-start"
            variant="outline"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#c3aa85',
              color: '#11211e'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#cf923d' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 'bold' }}>Earnings Report</div>
                <div style={{ color: '#c3aa85', fontSize: '14px' }}>View detailed earnings</div>
              </div>
            </div>
          </Button>

          <Button 
            className="w-full h-14 justify-start"
            variant="outline"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#c3aa85',
              color: '#11211e'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#cf923d' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 'bold' }}>Profile Settings</div>
                <div style={{ color: '#c3aa85', fontSize: '14px' }}>Update your information</div>
              </div>
            </div>
          </Button>
        </div>

          {/* Current Status */}
          {onlineStatus && (
            <Card className="mt-6" style={{ backgroundColor: '#cf923d' }}>
              <CardContent className="p-4 text-center">
                <div className="animate-pulse">
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                    🚗 Looking for riders...
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>
                    You'll be notified when a ride request comes in
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ride Request Modal */}
          {showRideRequest && newRideRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md" style={{ backgroundColor: 'white' }}>
                <CardHeader className="text-center">
                  <CardTitle style={{ color: '#11211e', fontSize: '20px' }}>
                    🚨 New Ride Request!
                  </CardTitle>
                  <CardDescription style={{ color: '#c3aa85' }}>
                    A passenger needs a ride nearby
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ride Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span style={{ color: '#11211e', fontWeight: 'bold' }}>📍 Pickup:</span>
                      <span style={{ color: '#c3aa85' }}>{newRideRequest.pickupLocation.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span style={{ color: '#11211e', fontWeight: 'bold' }}>🎯 Drop:</span>
                      <span style={{ color: '#c3aa85' }}>{newRideRequest.dropLocation.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span style={{ color: '#11211e', fontWeight: 'bold' }}>📏 Distance:</span>
                      <span style={{ color: '#c3aa85' }}>{newRideRequest.distance} km</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span style={{ color: '#11211e', fontWeight: 'bold' }}>💰 Fare:</span>
                      <span style={{ color: '#cf923d', fontWeight: 'bold', fontSize: '18px' }}>
                        ₹{newRideRequest.estimatedFare}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span style={{ color: '#11211e', fontWeight: 'bold' }}>👤 Passenger:</span>
                      <span style={{ color: '#c3aa85' }}>{newRideRequest.passengerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span style={{ color: '#11211e', fontWeight: 'bold' }}>💳 Payment:</span>
                      <span style={{ color: '#c3aa85' }}>{newRideRequest.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleRejectRide}
                      variant="outline"
                      className="flex-1"
                      style={{ 
                        borderColor: '#c3aa85', 
                        color: '#11211e',
                        backgroundColor: 'transparent'
                      }}
                    >
                      ❌ Decline
                    </Button>
                    <Button
                      onClick={handleAcceptRide}
                      className="flex-1"
                      style={{ 
                        backgroundColor: '#cf923d', 
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      ✅ Accept
                    </Button>
                  </div>

                  {/* Auto-decline timer */}
                  <div className="text-center pt-2">
                    <div style={{ color: '#c3aa85', fontSize: '12px' }}>
                      This request will expire in 30 seconds
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }