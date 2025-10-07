import { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
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
  blue: '#0080FF',
  white: '#FFFFFF',
  gray: '#666666',
  lightGray: '#F5F5F5',
  mapBg: '#E5E5E5',
};

export default function DriverDashboardScreen({ 
  onBack, 
  onToggleOnline, 
  isOnline = false 
}: DriverDashboardScreenProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);

  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(isOnline);
  const [newRideRequest, setNewRideRequest] = useState<any>(null);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'tracking'>('dashboard');
  const [acceptedRide, setAcceptedRide] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number }>({
    lat: 28.6139, // Default Delhi location
    lng: 77.2090,
  });
  const [currentDate, setCurrentDate] = useState<string>('');
  const [nearbyLocation, setNearbyLocation] = useState<string>('Peer Baba Dargah');
  const [showMenu, setShowMenu] = useState(false);

  // Verification status
  const [canStartRides, setCanStartRides] = useState(true);

  // Initialize Google Map
  useEffect(() => {
    if (!mapRef.current || typeof google === 'undefined') return;

    // Initialize map
    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: driverLocation,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    googleMapRef.current = map;

    // Add driver marker
    const marker = new (window as any).google.maps.Marker({
      position: driverLocation,
      map: map,
      icon: {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#0080FF',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      },
    });

    driverMarkerRef.current = marker;

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setDriverLocation(newPos);
          map.setCenter(newPos);
          marker.setPosition(newPos);

          // Reverse geocode to get nearby location name
          const geocoder = new (window as any).google.maps.Geocoder();
          geocoder.geocode({ location: newPos }, (results: any, status: any) => {
            if (status === 'OK' && results && results[0]) {
              const addressComponents = results[0].address_components;
              const locality = addressComponents.find((comp: any) => 
                comp.types.includes('locality') || comp.types.includes('sublocality')
              );
              if (locality) {
                setNearbyLocation(locality.long_name);
              }
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Update date
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formatted = `Today - ${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
      setCurrentDate(formatted);
    };
    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Load driver data on component mount
  useEffect(() => {
    const loadDriverData = async () => {
      try {
        setLoading(true);
        console.log('🚗 Loading driver dashboard data...');
        
        const [profileData, earningsData] = await Promise.all([
          driverApi.getDriverProfile(),
          driverApi.getDriverEarnings()
        ]);
        
        setDriverProfile(profileData);
        setEarnings(earningsData);
        setOnlineStatus(profileData.is_online || false);
        
        if (profileData.onboarding) {
          setCanStartRides(profileData.onboarding.can_start_rides);
        }
        
        console.log('🚗 Driver dashboard data loaded successfully');
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
    realTimeService.connect();

    if (driverProfile?.driver_id) {
      realTimeService.joinDriverRoom(driverProfile.driver_id);
    }

    realTimeService.onNewRideRequest((rideRequest) => {
      console.log('🚨 NEW RIDE REQUEST:', rideRequest);
      setNewRideRequest(rideRequest);
      setShowRideRequest(true);
      
      setTimeout(() => {
        if (showRideRequest) {
          setShowRideRequest(false);
          setNewRideRequest(null);
        }
      }, 30000);
    });

    realTimeService.onRideTaken((data) => {
      if (data.rideId === newRideRequest?.rideId) {
        console.log('🚫 Ride taken by another driver');
        setShowRideRequest(false);
        setNewRideRequest(null);
      }
    });

    return () => {
      if (driverProfile?.driver_id) {
        realTimeService.leaveDriverRoom(driverProfile.driver_id);
      }
      realTimeService.removeAllListeners();
    };
  }, [driverProfile?.driver_id, showRideRequest, newRideRequest?.rideId]);

  // Handle GO Online
  const handleGoOnline = async () => {
    if (!canStartRides) {
      alert('Your documents are still being verified. Please wait for approval before going online.');
      return;
    }

    try {
      console.log('🚀 Driver going online...');
      const success = await driverApi.updateOnlineStatus(true);
      
      if (success) {
        setOnlineStatus(true);
        onToggleOnline(true);
        
        if (driverProfile?.driver_id) {
          realTimeService.joinDriverRoom(driverProfile.driver_id);
        }
        
        console.log('✅ Driver is now online');
      }
    } catch (error) {
      console.error('❌ Error going online:', error);
    }
  };

  // Handle GO Offline
  const handleGoOffline = async () => {
    try {
      console.log('🛑 Driver going offline...');
      const success = await driverApi.updateOnlineStatus(false);
      
      if (success) {
        setOnlineStatus(false);
        onToggleOnline(false);
        
        if (driverProfile?.driver_id) {
          realTimeService.leaveDriverRoom(driverProfile.driver_id);
        }
        
        console.log('✅ Driver is now offline');
      }
    } catch (error) {
      console.error('❌ Error going offline:', error);
    }
  };

  // Handle ride acceptance
  const handleAcceptRide = () => {
    if (newRideRequest && driverProfile?.driver_id) {
      realTimeService.acceptRideRequest(newRideRequest.rideId, driverProfile.driver_id);
      setShowRideRequest(false);
      setNewRideRequest(null);
      setCurrentScreen('tracking');
      setAcceptedRide(newRideRequest);
      console.log('✅ Ride accepted:', newRideRequest.rideId);
    }
  };

  // Handle trip completion
  const handleTripComplete = () => {
    setCurrentScreen('dashboard');
    setAcceptedRide(null);
    console.log('✅ Trip completed');
  };

  // Handle trip cancellation
  const handleTripCancel = () => {
    setCurrentScreen('dashboard');
    setAcceptedRide(null);
    console.log('❌ Trip cancelled');
  };

  // Show tracking screen if ride accepted
  if (currentScreen === 'tracking' && acceptedRide) {
    return (
      <DriverTrackingScreen
        driver={{
          id: driverProfile?.driver_id || 'driver-id',
          name: driverProfile?.name || 'Driver',
          rating: driverProfile?.rating || 4.8,
          vehicle: driverProfile?.vehicle_info?.model || 'Vehicle',
          phone: driverProfile?.phone || '+91 98765 43210',
          rideId: acceptedRide.rideId
        }}
        otp="2323"
        pickupLocation={acceptedRide.pickupLocation?.address || 'Pickup Location'}
        dropLocation={acceptedRide.dropLocation?.address || 'Drop Location'}
        onTripComplete={handleTripComplete}
        onCancel={handleTripCancel}
        isDriverView={true}
      />
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Google Map */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: RAAHI_COLORS.mapBg
        }} 
      />

      {/* Top Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: 'transparent',
        zIndex: 10,
      }}>
        {/* Hamburger Menu */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: RAAHI_COLORS.white,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            position: 'relative',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={RAAHI_COLORS.dark} strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          {/* Notification Badge */}
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: RAAHI_COLORS.blue,
            color: RAAHI_COLORS.white,
            fontSize: '10px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            90
          </div>
        </button>

        {/* Center: Earnings Badge */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          borderRadius: '24px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          <span style={{ color: RAAHI_COLORS.success, fontSize: '18px', fontWeight: 'bold' }}>₹</span>
          <span style={{ color: RAAHI_COLORS.white, fontSize: '18px', fontWeight: 'bold' }}>
            {loading ? '0.00' : earnings?.today?.amount?.toFixed(2) || '0.00'}
          </span>
        </div>

        {/* Search Icon */}
        <button
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: RAAHI_COLORS.white,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RAAHI_COLORS.dark} strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      {/* Date and Location Info */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 10,
      }}>
        <div style={{
          color: RAAHI_COLORS.dark,
          fontSize: '14px',
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(255,255,255,0.8)',
        }}>
          {currentDate}
        </div>
        <div style={{
          color: RAAHI_COLORS.gray,
          fontSize: '12px',
          textShadow: '0 1px 2px rgba(255,255,255,0.8)',
        }}>
          {nearbyLocation}
        </div>
      </div>

      {/* Go Online/Offline Button */}
      <div style={{
        position: 'absolute',
        bottom: '220px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <Button
          onClick={onlineStatus ? handleGoOffline : handleGoOnline}
          disabled={loading || !canStartRides}
          style={{
            backgroundColor: onlineStatus ? RAAHI_COLORS.gray : RAAHI_COLORS.blue,
            color: RAAHI_COLORS.white,
            border: `4px solid ${RAAHI_COLORS.white}`,
            borderRadius: '50px',
            padding: '16px 48px',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            cursor: canStartRides ? 'pointer' : 'not-allowed',
            opacity: loading || !canStartRides ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {onlineStatus ? 'Go Offline' : 'Go Online'}
          {!onlineStatus && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
        </Button>
      </div>

      {/* Bottom Sheet */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: RAAHI_COLORS.white,
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
        zIndex: 10,
        padding: '24px 16px',
      }}>
        {/* Status Text */}
        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: RAAHI_COLORS.dark,
            marginBottom: '8px',
          }}>
            {onlineStatus ? "You're Online" : "You're Offline"}
          </h2>
          {!canStartRides && (
            <p style={{
              fontSize: '14px',
              color: RAAHI_COLORS.gray,
              marginBottom: '8px',
            }}>
              Document verification pending
            </p>
          )}
          {onlineStatus && (
            <p style={{
              fontSize: '14px',
              color: RAAHI_COLORS.gray,
            }}>
              Looking for ride requests...
            </p>
          )}
          {!onlineStatus && (
            <p style={{
              fontSize: '14px',
              color: RAAHI_COLORS.gray,
            }}>
              Tap "Go Online" to start receiving ride requests
            </p>
          )}
        </div>

        {/* Account Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: `1px solid ${RAAHI_COLORS.border}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RAAHI_COLORS.gray} strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span style={{
              fontSize: '14px',
              color: RAAHI_COLORS.gray,
            }}>
              Account
            </span>
          </div>
          
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RAAHI_COLORS.dark} strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Ride Request Modal */}
      {showRideRequest && newRideRequest && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: RAAHI_COLORS.white,
            borderRadius: '24px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            border: `3px solid ${newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden}`,
          }}>
            {/* Ride Type */}
            <div style={{
              textAlign: 'center',
              marginBottom: '16px',
            }}>
              <span style={{
                backgroundColor: newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden,
                color: RAAHI_COLORS.white,
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
                {newRideRequest.rideType === 'bike' ? '🏍️ Bike Rescue' : '🚗 Raahi Driver'}
              </span>
            </div>

            {/* Earning */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ color: RAAHI_COLORS.gray, fontSize: '14px', marginBottom: '4px' }}>
                Earning
              </p>
              <p style={{
                color: newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden,
                fontSize: '36px',
                fontWeight: 'bold',
              }}>
                ₹{newRideRequest.estimatedFare}
              </p>
            </div>

            {/* Distance Info */}
            <div style={{
              backgroundColor: newRideRequest.rideType === 'bike' ? '#f0faf4' : '#fff9f3',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
            }}>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', color: RAAHI_COLORS.dark }}>Pickup Distance</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: RAAHI_COLORS.dark }}>
                  {newRideRequest.pickupDistance || '1.5'} km
                </p>
                <p style={{ fontSize: '12px', color: RAAHI_COLORS.gray }}>
                  {Math.ceil((newRideRequest.pickupDistance || 1.5) * 3)} min away
                </p>
              </div>
              <div style={{ borderTop: `1px solid ${RAAHI_COLORS.border}`, paddingTop: '12px' }}>
                <p style={{ fontSize: '14px', color: RAAHI_COLORS.dark }}>Drop Distance</p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden,
                }}>
                  {newRideRequest.distance} km
                </p>
                <p style={{ fontSize: '12px', color: RAAHI_COLORS.gray }}>
                  {Math.ceil(newRideRequest.distance * 2)} min away
                </p>
              </div>
            </div>

            {/* Locations */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: RAAHI_COLORS.dark }}>Pickup</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: RAAHI_COLORS.dark }}>Drop</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <p style={{ fontSize: '13px', color: RAAHI_COLORS.gray }}>
                  {newRideRequest.pickupLocation.address}
                </p>
                <p style={{ fontSize: '13px', color: RAAHI_COLORS.gray }}>
                  {newRideRequest.dropLocation.address}
                </p>
              </div>
            </div>

            {/* Accept Button */}
            <Button
              onClick={handleAcceptRide}
              style={{
                width: '100%',
                backgroundColor: newRideRequest.rideType === 'bike' ? RAAHI_COLORS.success : RAAHI_COLORS.golden,
                color: RAAHI_COLORS.white,
                border: 'none',
                borderRadius: '20px',
                padding: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Accept Ride →
            </Button>

            {/* Auto-decline timer */}
            <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: RAAHI_COLORS.gray }}>
              Auto-declines in 30 seconds
            </p>
          </div>
        </div>
      )}

      {/* Menu Sidebar (if needed) */}
      {showMenu && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            backgroundColor: RAAHI_COLORS.white,
            boxShadow: '2px 0 16px rgba(0,0,0,0.2)',
            zIndex: 50,
            padding: '24px',
          }}
          onClick={() => setShowMenu(false)}
        >
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: RAAHI_COLORS.dark,
            marginBottom: '24px',
          }}>
            Menu
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <button
              style={{
                textAlign: 'left',
                padding: '12px',
                border: 'none',
                background: 'none',
                fontSize: '16px',
                color: RAAHI_COLORS.dark,
                cursor: 'pointer',
              }}
            >
              Profile
            </button>
            <button
              style={{
                textAlign: 'left',
                padding: '12px',
                border: 'none',
                background: 'none',
                fontSize: '16px',
                color: RAAHI_COLORS.dark,
                cursor: 'pointer',
              }}
            >
              Earnings
            </button>
            <button
              style={{
                textAlign: 'left',
                padding: '12px',
                border: 'none',
                background: 'none',
                fontSize: '16px',
                color: RAAHI_COLORS.dark,
                cursor: 'pointer',
              }}
            >
              Trip History
            </button>
            <button
              onClick={onBack}
              style={{
                textAlign: 'left',
                padding: '12px',
                border: 'none',
                background: 'none',
                fontSize: '16px',
                color: RAAHI_COLORS.dark,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
