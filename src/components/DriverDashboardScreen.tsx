import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { driverApi, DriverProfile } from '../services/driver/driverApi';
import { realTimeService } from '../services/realTimeService';
import DriverTrackingScreen from './DriverTrackingScreen';

interface DriverDashboardScreenProps {
  onBack: () => void;
  onToggleOnline: (isOnline: boolean) => void;
  userEmail?: string | null;
  isOnline?: boolean;
}

// Raahi Brand Colors (from Figma)
const RAAHI_COLORS = {
  background: '#F6EFD8',
  primary: '#cf923d',
  secondary: '#c3aa85',
  dark: '#11211e',
  lightBg: '#fef8e3',
  border: '#a89c8a',
  success: '#38a35f',
  golden: '#c06821',
};

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
  
  // Verification status
  const [canStartRides, setCanStartRides] = useState(true);
  const [verificationNotes, setVerificationNotes] = useState<string | null>(null);

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
        
        // Check verification status
        if (profileData.onboarding) {
          setCanStartRides(profileData.onboarding.can_start_rides);
          setVerificationNotes(profileData.onboarding.verification_notes || null);
          
          console.log('🚗 Verification status:', {
            can_start_rides: profileData.onboarding.can_start_rides,
            documents_verified: profileData.onboarding.documents_verified,
            is_verified: profileData.onboarding.is_verified
          });
        }
        
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

  // Handle ride request rejection - keeping for potential future use
  // const handleRejectRide = () => {
  //   if (newRideRequest && driverProfile?.driver_id) {
  //     realTimeService.rejectRideRequest(newRideRequest.rideId, driverProfile.driver_id);
  //     setShowRideRequest(false);
  //     setNewRideRequest(null);
  //     console.log('❌ Ride rejected:', newRideRequest.rideId);
  //     // Stay in looking_for_rides state
  //   }
  // };

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
    // Only pass valid trip states to DriverTrackingScreen
    const validTripStates: ('en_route_to_pickup' | 'arrived_at_pickup' | 'passenger_picked_up' | 'trip_started')[] = [
      'en_route_to_pickup',
      'arrived_at_pickup', 
      'passenger_picked_up',
      'trip_started'
    ];
    
    const currentTripState = validTripStates.includes(driverState as any) 
      ? driverState as 'en_route_to_pickup' | 'arrived_at_pickup' | 'passenger_picked_up' | 'trip_started'
      : undefined;

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
        tripState={currentTripState}
        onStartTrip={handleStartTrip}
        onArrivedAtPickup={handleArrivedAtPickup}
        onPickupPassenger={handlePickupPassenger}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: RAAHI_COLORS.background }}>
      {/* Header - Figma Style */}
      <div className="p-6 pb-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/50"
            style={{ color: RAAHI_COLORS.dark }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </Button>
          
          <div className="text-center">
            <h1 style={{ 
              fontFamily: 'Samarkan, Arial', 
              color: RAAHI_COLORS.dark,
              fontSize: '42px',
              fontWeight: 'normal',
              letterSpacing: '1px'
            }}>
              Raahi
            </h1>
            <p style={{
              fontSize: '12px',
              color: RAAHI_COLORS.secondary,
              marginTop: '-4px'
            }}>Driver</p>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-sm px-3 py-1"
            style={{ 
              color: RAAHI_COLORS.primary,
              border: `1px solid ${RAAHI_COLORS.border}`
            }}
          >
            Support
          </Button>
        </div>

        {/* Driver Profile Card - Figma Style */}
        <Card className="mb-6 border-0 shadow-md" style={{ 
          backgroundColor: 'white',
          borderRadius: '20px'
        }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-4" style={{ borderColor: RAAHI_COLORS.secondary }}>
                <AvatarFallback style={{ 
                  backgroundColor: RAAHI_COLORS.primary, 
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: 'bold'
                }}>
                  {loading ? '...' : (driverProfile?.name?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || 'D')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 style={{ 
                  color: RAAHI_COLORS.dark,
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>
                  {loading ? 'Loading...' : (driverProfile?.name || userEmail?.split('@')[0] || 'Driver')}
                </h2>
                <p style={{ 
                  color: RAAHI_COLORS.secondary,
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  Professional Driver
                </p>
                <div className="flex items-center space-x-2">
                  <Badge style={{ 
                    backgroundColor: RAAHI_COLORS.primary, 
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}>
                    ⭐ {loading ? '...' : (driverProfile?.rating?.toFixed(1) || '4.8')}
                  </Badge>
                  <Badge style={{ 
                    backgroundColor: RAAHI_COLORS.lightBg,
                    color: RAAHI_COLORS.dark,
                    border: `1px solid ${RAAHI_COLORS.border}`,
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}>
                    {loading ? '...' : (driverProfile?.total_trips || 127)} Trips
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GO Button / Verification Status - Figma Style */}
        <Card className="mb-6 border-0 shadow-md" style={{ borderRadius: '20px' }}>
          <CardContent className="p-6 text-center">
            {!canStartRides ? (
              /* Document Verification Pending */
              <div>
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: RAAHI_COLORS.lightBg }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={RAAHI_COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <circle cx="12" cy="15" r="3"></circle>
                    </svg>
                  </div>
                </div>
                <h3 style={{ 
                  color: RAAHI_COLORS.dark, 
                  fontWeight: 'bold', 
                  fontSize: '20px',
                  marginBottom: '8px' 
                }}>
                  Document Verification Pending
                </h3>
                <p style={{ 
                  color: RAAHI_COLORS.secondary, 
                  fontSize: '14px', 
                  marginBottom: '20px',
                  lineHeight: '1.5'
                }}>
                  Your documents are being reviewed by our team. This usually takes 24-48 hours.
                </p>
                <div style={{ 
                  backgroundColor: RAAHI_COLORS.lightBg,
                  border: `2px solid ${RAAHI_COLORS.border}`,
                  borderRadius: '16px',
                  padding: '16px',
                  marginTop: '16px'
                }}>
                  <p style={{ 
                    color: RAAHI_COLORS.dark, 
                    fontSize: '14px', 
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    ⏳ Verification in Progress
                  </p>
                  <p style={{ 
                    color: RAAHI_COLORS.secondary, 
                    fontSize: '13px'
                  }}>
                    You can start accepting rides once your documents are verified ✅
                  </p>
                  {verificationNotes && (
                    <p style={{ 
                      color: RAAHI_COLORS.primary, 
                      fontSize: '12px',
                      marginTop: '8px',
                      fontStyle: 'italic'
                    }}>
                      Note: {verificationNotes}
                    </p>
                  )}
                </div>
              </div>
            ) : driverState === 'offline' ? (
              /* Ready to Go Online */
              <div>
                <h3 style={{ 
                  color: RAAHI_COLORS.dark, 
                  fontWeight: 'bold', 
                  fontSize: '20px',
                  marginBottom: '8px' 
                }}>
                  Ready to earn?
                </h3>
                <p style={{ 
                  color: RAAHI_COLORS.secondary, 
                  fontSize: '14px', 
                  marginBottom: '24px' 
                }}>
                  Tap GO to start accepting ride requests
                </p>
                <Button 
                  onClick={handleGoOnline}
                  disabled={loading}
                  className="w-full py-6 text-xl font-bold shadow-lg hover:shadow-xl transition-all"
                  style={{ 
                    backgroundColor: RAAHI_COLORS.success,
                    color: 'white',
                    border: 'none',
                    borderRadius: '40px',
                    fontSize: '24px',
                    letterSpacing: '2px'
                  }}
                >
                  GO
                </Button>
              </div>
            ) : null}
            
            {driverState === 'looking_for_rides' && (
              <div>
                <div className="animate-pulse mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RAAHI_COLORS.success }}></div>
                    <h3 style={{ 
                      color: RAAHI_COLORS.dark, 
                      fontWeight: 'bold', 
                      fontSize: '20px'
                    }}>
                      You're Online
                    </h3>
                  </div>
                </div>
                <p style={{ 
                  color: RAAHI_COLORS.secondary, 
                  fontSize: '14px', 
                  marginBottom: '24px' 
                }}>
                  Looking for ride requests nearby...
                </p>
                <Button 
                  onClick={handleGoOffline}
                  disabled={loading}
                  className="w-full py-4 text-lg font-semibold border-2"
                  style={{ 
                    borderColor: RAAHI_COLORS.border,
                    backgroundColor: 'transparent',
                    color: RAAHI_COLORS.dark,
                    borderRadius: '40px'
                  }}
                >
                  Go Offline
                </Button>
              </div>
            )}
            
            {driverState === 'en_route_to_pickup' && (
              <div>
                <h3 style={{ 
                  color: RAAHI_COLORS.dark, 
                  fontWeight: 'bold', 
                  fontSize: '20px',
                  marginBottom: '8px' 
                }}>
                  🚗 En route to pickup
                </h3>
                <p style={{ color: RAAHI_COLORS.secondary, fontSize: '14px' }}>
                  Navigate to your passenger's location
                </p>
              </div>
            )}
            
            {driverState === 'arrived_at_pickup' && (
              <div>
                <h3 style={{ 
                  color: RAAHI_COLORS.dark, 
                  fontWeight: 'bold', 
                  fontSize: '20px',
                  marginBottom: '8px' 
                }}>
                  📍 Arrived at pickup
                </h3>
                <p style={{ color: RAAHI_COLORS.secondary, fontSize: '14px' }}>
                  Passenger has been notified of your arrival
                </p>
              </div>
            )}
            
            {driverState === 'passenger_picked_up' && (
              <div>
                <h3 style={{ 
                  color: RAAHI_COLORS.dark, 
                  fontWeight: 'bold', 
                  fontSize: '20px',
                  marginBottom: '8px' 
                }}>
                  👤 Passenger on board
                </h3>
                <p style={{ color: RAAHI_COLORS.secondary, fontSize: '14px' }}>
                  Ready to start the trip
                </p>
              </div>
            )}
            
            {driverState === 'trip_started' && (
              <div>
                <h3 style={{ 
                  color: RAAHI_COLORS.dark, 
                  fontWeight: 'bold', 
                  fontSize: '20px',
                  marginBottom: '8px' 
                }}>
                  🎯 Trip in progress
                </h3>
                <p style={{ color: RAAHI_COLORS.secondary, fontSize: '14px' }}>
                  Navigate to destination
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earnings Stats - Figma Style */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-0 shadow-md" style={{ 
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${RAAHI_COLORS.primary} 0%, ${RAAHI_COLORS.golden} 100%)`
          }}>
            <CardContent className="p-6 text-center">
              <div style={{ 
                color: 'white', 
                fontSize: '32px', 
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {loading ? '...' : `₹${earnings?.today?.amount?.toLocaleString() || '$$$'}`}
              </div>
              <div style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Today's Earnings
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md" style={{ 
            borderRadius: '20px',
            backgroundColor: 'white'
          }}>
            <CardContent className="p-6 text-center">
              <div style={{ 
                color: RAAHI_COLORS.dark, 
                fontSize: '32px', 
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {loading ? '...' : (earnings?.today?.trips || 8)}
              </div>
              <div style={{ 
                color: RAAHI_COLORS.secondary, 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Trips Today
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Figma Style */}
        <div className="space-y-3">
          <h3 style={{ 
            color: RAAHI_COLORS.dark, 
            fontWeight: 'bold', 
            fontSize: '18px',
            marginBottom: '16px' 
          }}>
            Quick Actions
          </h3>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" style={{ borderRadius: '16px' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: RAAHI_COLORS.primary }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div style={{ fontWeight: 'bold', color: RAAHI_COLORS.dark, fontSize: '16px' }}>Trip History</div>
                  <div style={{ color: RAAHI_COLORS.secondary, fontSize: '13px' }}>View your completed rides</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RAAHI_COLORS.secondary} strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" style={{ borderRadius: '16px' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: RAAHI_COLORS.primary }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div style={{ fontWeight: 'bold', color: RAAHI_COLORS.dark, fontSize: '16px' }}>Earnings Report</div>
                  <div style={{ color: RAAHI_COLORS.secondary, fontSize: '13px' }}>View detailed earnings</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RAAHI_COLORS.secondary} strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" style={{ borderRadius: '16px' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: RAAHI_COLORS.primary }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div style={{ fontWeight: 'bold', color: RAAHI_COLORS.dark, fontSize: '16px' }}>Profile Settings</div>
                  <div style={{ color: RAAHI_COLORS.secondary, fontSize: '13px' }}>Update your information</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RAAHI_COLORS.secondary} strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Online Status Banner */}
          {onlineStatus && isLookingForRides && (
            <Card className="mt-6 border-0 shadow-lg" style={{ 
              background: `linear-gradient(135deg, ${RAAHI_COLORS.success} 0%, #2d8a4f 100%)`,
              borderRadius: '20px'
            }}>
              <CardContent className="p-5 text-center">
                <div className="animate-pulse">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                      🚗 Looking for rides nearby
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                    You'll be notified when a ride request comes in
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ride Request Modal - Figma Style */}
          {showRideRequest && newRideRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <Card className="w-full max-w-md border-0 shadow-2xl animate-in" style={{ 
                backgroundColor: 'white',
                borderRadius: '24px',
                border: `3px solid ${newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden}`
              }}>
                <CardContent className="p-6">
                  {/* Ride Type Badge */}
                  <div className="text-center mb-4">
                    <Badge style={{ 
                      backgroundColor: newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden,
                      color: 'white',
                      padding: '8px 20px',
                      fontSize: '14px',
                      borderRadius: '20px',
                      fontWeight: 'bold'
                    }}>
                      {newRideRequest.rideType === 'bike' ? '🏍️ Bike Rescue' : '🚗 Raahi Driver'}
                    </Badge>
                  </div>

                  {/* Earnings */}
                  <div className="text-center mb-6">
                    <p style={{ color: RAAHI_COLORS.secondary, fontSize: '14px', marginBottom: '4px' }}>
                      Earning
                    </p>
                    <p style={{ 
                      color: newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden,
                      fontSize: '36px',
                      fontWeight: 'bold',
                      lineHeight: '1'
                    }}>
                      ₹{newRideRequest.estimatedFare}
                    </p>
                  </div>

                  {/* Distance Info - Figma Style */}
                  <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: newRideRequest.rideType === 'bike' ? '#f0faf4' : '#fff9f3' }}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p style={{ fontSize: '14px', color: RAAHI_COLORS.dark }}>Pickup Distance</p>
                        <div className="text-right">
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: RAAHI_COLORS.dark }}>
                            {newRideRequest.pickupDistance || '1.5'} km
                          </p>
                          <p style={{ fontSize: '12px', color: RAAHI_COLORS.secondary }}>
                            {Math.ceil((newRideRequest.pickupDistance || 1.5) * 3)} min away
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200"></div>
                      <div className="flex items-center justify-between">
                        <p style={{ fontSize: '14px', color: RAAHI_COLORS.dark }}>Drop Distance</p>
                        <div className="text-right">
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden }}>
                            {newRideRequest.distance} km
                          </p>
                          <p style={{ fontSize: '12px', color: RAAHI_COLORS.secondary }}>
                            {Math.ceil(newRideRequest.distance * 2)} min away
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: RAAHI_COLORS.dark }}>Pickup</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: RAAHI_COLORS.dark }}>Drop</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <p style={{ fontSize: '13px', color: RAAHI_COLORS.secondary, lineHeight: '1.4' }}>
                        {newRideRequest.pickupLocation.address}
                      </p>
                      <p style={{ fontSize: '13px', color: RAAHI_COLORS.secondary, lineHeight: '1.4' }}>
                        {newRideRequest.dropLocation.address}
                      </p>
                    </div>
                  </div>

                  {/* Passenger & Payment Info */}
                  <div className="mb-6 flex justify-between text-sm">
                    <div>
                      <span style={{ color: RAAHI_COLORS.secondary }}>👤 </span>
                      <span style={{ color: RAAHI_COLORS.dark, fontWeight: '500' }}>{newRideRequest.passengerName}</span>
                    </div>
                    <div>
                      <span style={{ color: RAAHI_COLORS.secondary }}>💳 </span>
                      <span style={{ color: RAAHI_COLORS.dark, fontWeight: '500' }}>{newRideRequest.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Action Buttons - Figma Style */}
                  <Button
                    onClick={handleAcceptRide}
                    className="w-full py-6 text-lg font-bold shadow-lg mb-3"
                    style={{ 
                      backgroundColor: newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden,
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px'
                    }}
                  >
                    Accept Ride →
                  </Button>

                  {/* Auto-decline timer */}
                  <div className="text-center">
                    <p style={{ color: RAAHI_COLORS.secondary, fontSize: '12px' }}>
                      Auto-declines in 30 seconds
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }