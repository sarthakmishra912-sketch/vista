import React, { lazy, Suspense, useCallback, useEffect } from 'react';
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import useAppState from './hooks/useAppState';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PricingProvider } from './contexts/PricingContext';
import realTimeService from './services/realTimeService';

// Global callback for document verification success
declare global {
  interface Window {
    handleDocumentVerificationSuccess?: () => void;
  }
}

// 🚀 PERFORMANCE OPTIMIZATION: Lazy load all screens with error handling
const LoginScreen = lazy(() => import('./screens/LoginScreen').catch(() => ({ default: () => <div>Login Screen Loading...</div> })));
const MobileNumberScreen = lazy(() => import('./components/auth/MobileNumberScreen').catch(() => ({ default: () => <div>Mobile Number Screen Loading...</div> })));
const MobileOTPScreen = lazy(() => import('./components/auth/MobileOTPScreen').catch(() => ({ default: () => <div>OTP Screen Loading...</div> })));
const DashboardScreen = lazy(() => import('./components/DashboardScreen').catch(() => ({ default: () => <div>Dashboard Loading...</div> })));
const ContactNumberScreen = lazy(() => import('./components/ContactNumberScreen').catch(() => ({ default: () => <div>Contact Screen Loading...</div> })));
const OTPVerificationScreen = lazy(() => import('./components/OTPVerificationScreen').catch(() => ({ default: () => <div>OTP Screen Loading...</div> })));
const TermsScreen = lazy(() => import('./components/TermsScreen').catch(() => ({ default: () => <div>Terms Screen Loading...</div> })));
const RideBookingScreen = lazy(() => import('./components/RideBookingScreen').catch(() => ({ default: () => <div>Ride Booking Loading...</div> })));
const BookingLoaderScreen = lazy(() => import('./components/BookingLoaderScreen').catch(() => ({ default: () => <div>Booking Loader Loading...</div> })));
const DriverTrackingScreen = lazy(() => import('./components/DriverTrackingScreen').catch(() => ({ default: () => <div>Driver Tracking Loading...</div> })));
const DriverSignupScreen = lazy(() => import('./components/DriverSignupScreen').catch(() => ({ default: () => <div>Driver Signup Loading...</div> })));
const DriverDashboardScreen = lazy(() => import('./components/DriverDashboardScreen').catch(() => ({ default: () => <div>Driver Dashboard Loading...</div> })));
const DriverLoginScreen = lazy(() => import('./components/DriverLoginScreen').catch(() => ({ default: () => <div>Driver Login Loading...</div> })));
const AdminDashboardScreen = lazy(() => import('./components/AdminDashboardScreen').catch(() => ({ default: () => <div>Admin Dashboard Loading...</div> })));

// 🎯 LAZY LOAD DRIVER SCREENS: Import individually for better performance with error handling
const DriverEmailCollectionScreen = lazy(() => import('./components/driver/DriverEmailCollectionScreen').catch(() => ({ default: () => <div>Driver Email Collection Loading...</div> })));
const DriverLanguageSelectionScreen = lazy(() => import('./components/driver/DriverLanguageSelectionScreen').catch(() => ({ default: () => <div>Driver Language Selection Loading...</div> })));
const DriverEarningSetupScreen = lazy(() => import('./components/driver/DriverEarningSetupScreen').catch(() => ({ default: () => <div>Driver Earning Setup Loading...</div> })));
const DriverVehicleSelectionScreen = lazy(() => import('./components/driver/DriverVehicleSelectionScreen').catch(() => ({ default: () => <div>Driver Vehicle Selection Loading...</div> })));
const DriverLicenseUploadScreen = lazy(() => import('./components/driver/DriverLicenseUploadScreen').catch(() => ({ default: () => <div>Driver License Upload Loading...</div> })));
const DriverProfilePhotoScreen = lazy(() => import('./components/driver/DriverProfilePhotoScreen').catch(() => ({ default: () => <div>Driver Profile Photo Loading...</div> })));
const DriverPhotoConfirmationScreen = lazy(() => import('./components/driver/DriverPhotoConfirmationScreen').catch(() => ({ default: () => <div>Driver Photo Confirmation Loading...</div> })));
const DriverDocumentUploadScreen = lazy(() => import('./components/driver/DriverDocumentUploadScreen').catch(() => ({ default: () => <div>Driver Document Upload Loading...</div> })));
const DriverDocumentVerificationScreen = lazy(() => import('./components/driver/DriverDocumentVerificationScreen').catch(() => ({ default: () => <div>Driver Document Verification Loading...</div> })));
const DriverDocumentVerificationSuccessScreen = lazy(() => import('./components/driver/DriverDocumentVerificationSuccessScreen').catch(() => ({ default: () => <div>Driver Document Verification Success Loading...</div> })));
const DriverRideSelectionScreen = lazy(() => import('./components/driver/DriverRideSelectionScreen').catch(() => ({ default: () => <div>Driver Ride Selection Loading...</div> })));

// Loading fallback component
const ScreenLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#F6EFD8]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-[#CF923D] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#11211E] font-medium">Loading...</p>
    </div>
  </div>
);

// Main App Component - wraps inner content with providers
export default function App() {
  return (
    <AuthProvider>
      <PricingProvider>
        <AppContent />
      </PricingProvider>
    </AuthProvider>
  );
}

// Inner component with access to auth context
function AppContent() {
  const appState = useAppState();
  const auth = useAuth();
  
  // Initialize WebSocket connection when app starts
  useEffect(() => {
    console.log('🚀 Initializing WebSocket connection...');
    realTimeService.connect();
  }, []);
  
  // Guard against undefined state
  if (!appState) {
    return <ScreenLoader />;
  }
  
  const {
    currentScreen,
    userEmail,
    userPhoneNumber,
    isDriverOnline,
    driverData,
    bookingData,
    isAppInitializing,
    isLoggedIn,
    isDriverMode
  } = appState;

  const { updateAppState } = appState;

  // 🔄 CRITICAL: Sync AuthContext authentication with appState
  React.useEffect(() => {
    console.log("🔄 Syncing auth state:", {
      authIsAuthenticated: auth.isAuthenticated,
      authUser: auth.user,
      appStateIsLoggedIn: isLoggedIn
    });
    
    // When AuthContext confirms authentication, update appState
    if (auth.isAuthenticated && auth.user && !isLoggedIn) {
      console.log("✅ User authenticated in AuthContext, syncing to appState");
      updateAppState({ 
        isLoggedIn: true,
        userEmail: auth.user.email || userEmail
      });
    }
    
    // When AuthContext confirms logout, update appState
    if (!auth.isAuthenticated && isLoggedIn) {
      console.log("❌ User logged out in AuthContext, syncing to appState");
      updateAppState({ 
        isLoggedIn: false
      });
    }
  }, [auth.isAuthenticated, auth.user, isLoggedIn, userEmail, updateAppState]);

  // Check for admin URL parameter - only on initial load
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasAdminParam = urlParams.get('admin') === 'true';
    
    if (hasAdminParam) {
      console.log("👨‍💼 Admin mode detected via URL, navigating to admin dashboard");
      updateAppState({ currentScreen: 'admin-dashboard' });
      
      // Remove admin parameter from URL to prevent re-triggering on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      console.log("🔧 Removed admin parameter from URL");
    }
  }, []); // Empty deps - only run once on mount

  // Set up global callback for document verification success
  React.useEffect(() => {
    if (currentScreen === 'driver-document-verification') {
      window.handleDocumentVerificationSuccess = () => {
        console.log("🎉 Document verification success callback triggered!");
        updateAppState({ 
          currentScreen: 'driver-document-verification-success'
        });
      };
    }
    
    return () => {
      if (window.handleDocumentVerificationSuccess) {
        delete window.handleDocumentVerificationSuccess;
      }
    };
  }, [currentScreen, updateAppState]);

  // 🚀 PERFORMANCE: Memoize handlers to prevent unnecessary re-renders
  const handleLogin = useCallback((method: string) => {
    console.log(`🔐 User login with ${method}`, { isDriverMode });
    
    // For mobile OTP, show phone number input screen first
    if (method === 'mobile-otp') {
      updateAppState({ 
        loginMethod: method,
        currentScreen: 'mobile-number' as any
      });
    } else {
      // For other methods (google, truecaller), check if driver mode
      if (isDriverMode) {
        console.log("🚗 Driver login - redirecting to driver onboarding");
        updateAppState({ 
          isLoggedIn: true, 
          loginMethod: method,
          currentScreen: 'driver-email-collection' // Start driver onboarding
        });
        toast.success(`Logged in as driver with ${method}`);
      } else {
        // Passenger login - go to dashboard
        updateAppState({ 
          isLoggedIn: true, 
          loginMethod: method,
          currentScreen: 'dashboard'
        });
        toast.success(`Logged in with ${method}`);
      }
    }
  }, [isDriverMode, updateAppState]);

  const handleContactSubmit = useCallback((phone: string) => {
    console.log("📱 Contact submitted:", phone);
    updateAppState({ 
      userPhoneNumber: phone,
      currentScreen: 'otp'
    });
  }, [updateAppState]);

  const handleOTPVerify = useCallback((otp: string) => {
    console.log("🔢 OTP verified:", otp);
    updateAppState({ 
      isLoggedIn: true,
      currentScreen: 'terms'
    });
  }, [updateAppState]);

  // 📱 Mobile OTP Flow Handlers
  const handleMobileNumberSubmit = useCallback(async (phoneNumber: string, countryCode: string) => {
    console.log("📱 Mobile number submitted:", phoneNumber);
    try {
      // Extract just the phone number without country code for sendOTP
      const phoneOnly = phoneNumber.replace(countryCode, '');
      
      // Send OTP via authService
      await auth.sendOTP(phoneOnly, countryCode);
      
      // Store phone number and navigate to OTP screen
      updateAppState({ 
        userPhoneNumber: phoneNumber,
        currentScreen: 'mobile-otp' as any
      });
      
      toast.success('OTP sent successfully!');
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    }
  }, [auth, updateAppState]);

  const handleMobileOTPVerify = useCallback(async (otp: string) => {
    console.log("🔢 Mobile OTP verified:", otp, { isDriverMode });
    try {
      if (!userPhoneNumber) {
        throw new Error('Phone number not found');
      }
      
      // Verify OTP via authService
      const loginResponse = await auth.login({
        method: 'mobile_otp',
        phone: userPhoneNumber,
        otp: otp
      });
      
      // Update login state first
      updateAppState({ 
        isLoggedIn: true
      });
      
      // Navigate based on driver mode
      if (isDriverMode) {
        console.log("🚗 Driver OTP verified - checking driver status...");
        toast.loading('Checking driver status...', { id: 'driver-status-check' });
        
        // Check driver status via API
        try {
          const accessToken = loginResponse.tokens.accessToken;
          
          const response = await fetch('http://localhost:5001/api/driver/onboarding/status', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json();
          
          toast.dismiss('driver-status-check');
          
          if (data.success && data.data) {
            const { onboarding_status, can_start_rides, is_verified } = data.data;
            
            console.log("📊 Driver status after login:", {
              onboarding_status,
              can_start_rides,
              is_verified
            });

            // Route based on driver status
            if (can_start_rides && is_verified) {
              // Verified driver - go to dashboard
              console.log("✅ Verified driver - going to dashboard");
              updateAppState({ 
                currentScreen: 'driver-dashboard'
              });
              toast.success('Welcome back!');
            } else {
              // Incomplete onboarding - resume from last step
              console.log("⏳ Driver onboarding incomplete - resuming from:", onboarding_status);
              
              const screenMap: { [key: string]: string } = {
                'EMAIL_COLLECTION': 'driver-email-collection',
                'LANGUAGE_SELECTION': 'driver-language-selection',
                'EARNING_SETUP': 'driver-earning-setup',
                'VEHICLE_SELECTION': 'driver-vehicle-selection',
                'LICENSE_UPLOAD': 'driver-license-upload',
                'PROFILE_PHOTO': 'driver-profile-photo',
                'DOCUMENT_UPLOAD': 'driver-document-upload',
                'VERIFICATION_PENDING': 'driver-document-verification',
              };
              
              const nextScreen = screenMap[onboarding_status] || 'driver-email-collection';
              
              updateAppState({ 
                currentScreen: nextScreen as any
              });
              toast.success('Continue your driver registration');
            }
          } else if (response.status === 404) {
            // No driver profile - start onboarding
            console.log("📝 No driver profile - starting onboarding");
            updateAppState({ 
              currentScreen: 'driver-email-collection'
            });
            toast.success('Complete driver registration');
          } else {
            throw new Error(data.message || 'Failed to check driver status');
          }
        } catch (statusError: any) {
          console.error('❌ Error checking driver status:', statusError);
          toast.dismiss('driver-status-check');
          
          // On error, start onboarding
          updateAppState({ 
            currentScreen: 'driver-email-collection'
          });
          toast.success('Complete driver registration');
        }
      } else {
        // Passenger login - go to dashboard
        updateAppState({ 
          currentScreen: 'dashboard'
        });
        toast.success('Login successful!');
      }
    } catch (error: any) {
      console.error('Failed to verify OTP:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
      throw error; // Re-throw to let the component handle it
    }
  }, [auth, userPhoneNumber, isDriverMode, updateAppState]);

  const handleMobileOTPResend = useCallback(async () => {
    console.log("🔄 Resending OTP");
    try {
      if (!userPhoneNumber) {
        throw new Error('Phone number not found');
      }
      
      // Extract country code and phone number
      const countryCode = userPhoneNumber.substring(0, 3); // e.g., +91
      const phoneOnly = userPhoneNumber.substring(3);
      
      // Resend OTP via authService
      await auth.sendOTP(phoneOnly, countryCode);
      toast.success('OTP resent successfully!');
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      toast.error(error.message || 'Failed to resend OTP. Please try again.');
      throw error;
    }
  }, [auth, userPhoneNumber]);

  const handleTermsAccept = useCallback(() => {
    console.log("📋 Terms accepted");
    updateAppState({ 
      currentScreen: 'dashboard'
    });
  }, [updateAppState]);

  const handleFindRide = useCallback(() => {
    console.log("🚗 Find ride clicked");
    console.log("🔍 Auth state check:", {
      'auth.isAuthenticated': auth.isAuthenticated,
      'auth.user': auth.user,
      'isLoggedIn': isLoggedIn,
      'currentScreen': currentScreen
    });
    
    // Check BOTH authentication states - use the stricter check
    // For a user to access booking, they must be authenticated in BOTH contexts
    const isUserAuthenticated = auth.isAuthenticated && isLoggedIn;
    
    if (!isUserAuthenticated) {
      console.log("🔐 User not authenticated, redirecting to login");
      console.log("❌ Auth failed because:", {
        authContextAuthenticated: auth.isAuthenticated,
        appStateLoggedIn: isLoggedIn
      });
      updateAppState({ 
        currentScreen: 'login',
        isLoggedIn: false
      });
      toast.info('Please login to book a ride');
      return;
    }
    
    console.log("✅ User authenticated, proceeding to booking");
    updateAppState({ 
      currentScreen: 'booking'
    });
  }, [auth.isAuthenticated, auth.user, isLoggedIn, currentScreen, updateAppState]);

  const handleRideBooked = useCallback((rideData: any) => {
    console.log("🚗 Ride booked:", rideData);
    updateAppState({ 
      currentScreen: 'booking-loader',
      bookingData: rideData
    });
  }, [updateAppState]);

  const handleDriverFound = useCallback((driver: any) => {
    console.log("👨‍💼 Driver found:", driver);
    updateAppState({ 
      currentScreen: 'driver-tracking',
      driverData: driver
    });
  }, [updateAppState]);

  const handleCancelBooking = useCallback(() => {
    console.log("❌ Booking cancelled - returning to booking screen");
    updateAppState({ 
      currentScreen: 'booking',
      bookingData: null,
      driverData: null
    });
    toast.info('Ride search cancelled');
  }, [updateAppState]);

  const handleBackToDashboardFromBooking = useCallback(() => {
    console.log("🏠 Back to dashboard from booking");
    updateAppState({ 
      currentScreen: 'dashboard'
    });
  }, [updateAppState]);

  const handleBackFromBookingLoader = useCallback(() => {
    console.log("🏠 Back from booking loader");
    updateAppState({ 
      currentScreen: 'booking'
    });
  }, [updateAppState]);

  const handleBackFromDriverTracking = useCallback(() => {
    console.log("🏠 Back from driver tracking");
    updateAppState({ 
      currentScreen: 'dashboard',
      driverData: null,
      bookingData: null
    });
  }, [updateAppState]);

  const handleOpenDriversApp = useCallback(async () => {
    console.log("🚗 Open drivers app clicked");
    
    // 🎯 PRODUCTION FIX: Check if user is already logged in
    if (!auth.isAuthenticated || !isLoggedIn) {
      console.log("❌ Not logged in - showing login screen");
      updateAppState({ 
        currentScreen: 'login',
        isDriverMode: true
      });
      toast.info('Login as a driver');
      return;
    }

    // User is logged in - check their driver status
    console.log("✅ User logged in - checking driver status...");
    toast.loading('Checking driver status...', { id: 'driver-status' });
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch('http://localhost:5001/api/driver/onboarding/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        const { onboarding_status, can_start_rides, is_verified } = data.data;
        
        console.log("📊 Driver status:", {
          onboarding_status,
          can_start_rides,
          is_verified
        });

        toast.dismiss('driver-status');

        // Route based on driver status
        if (can_start_rides && is_verified) {
          // Driver is fully verified - go to driver dashboard
          console.log("✅ Driver verified - going to dashboard");
          updateAppState({ 
            currentScreen: 'driver-dashboard',
            isDriverMode: true
          });
          toast.success('Welcome back!');
        } else {
          // Driver exists but onboarding incomplete - resume onboarding
          console.log("⏳ Driver onboarding incomplete - resuming from:", onboarding_status);
          
          // Map onboarding status to screen
          const screenMap: { [key: string]: string } = {
            'EMAIL_COLLECTION': 'driver-email-collection',
            'LANGUAGE_SELECTION': 'driver-language-selection',
            'EARNING_SETUP': 'driver-earning-setup',
            'VEHICLE_SELECTION': 'driver-vehicle-selection',
            'LICENSE_UPLOAD': 'driver-license-upload',
            'PROFILE_PHOTO': 'driver-profile-photo',
            'DOCUMENT_UPLOAD': 'driver-document-upload',
            'VERIFICATION_PENDING': 'driver-document-verification',
          };
          
          const nextScreen = screenMap[onboarding_status] || 'driver-email-collection';
          
          updateAppState({ 
            currentScreen: nextScreen as any,
            isDriverMode: true
          });
          toast.info('Continue your driver registration');
        }
      } else if (response.status === 404) {
        // No driver profile - start onboarding
        console.log("📝 No driver profile - starting onboarding");
        toast.dismiss('driver-status');
        updateAppState({ 
          currentScreen: 'driver-email-collection',
          isDriverMode: true
        });
        toast.info('Complete driver registration');
      } else {
        throw new Error(data.message || 'Failed to check driver status');
      }
    } catch (error: any) {
      console.error('❌ Error checking driver status:', error);
      toast.dismiss('driver-status');
      
      // On error, assume first-time driver and start onboarding
      updateAppState({ 
        currentScreen: 'driver-email-collection',
        isDriverMode: true
      });
      toast.info('Complete driver registration');
    }
  }, [auth.isAuthenticated, isLoggedIn, updateAppState]);

  const handleSwitchAccount = useCallback(() => {
    console.log("🔄 Switch account");
    updateAppState({ 
      isLoggedIn: false,
      loginMethod: '',
      currentScreen: 'login',
      isDriverMode: false,
      userEmail: '',
      userPhoneNumber: ''
    });
  }, [updateAppState]);

  const handleLogout = useCallback(async () => {
    console.log("🚪 Logout clicked");
    try {
      // Logout from AuthContext (clears tokens)
      await auth.logout();
      
      // Clear app state
      updateAppState({ 
        isLoggedIn: false,
        loginMethod: '',
        currentScreen: 'dashboard',
        isDriverMode: false,
        userEmail: '',
        userPhoneNumber: '',
        bookingData: null,
        driverData: null
      });
      
      toast.success('Logged out successfully!');
      console.log("✅ Logout complete");
    } catch (error) {
      console.error("❌ Logout error:", error);
      toast.error('Failed to logout. Please try again.');
    }
  }, [auth, updateAppState]);

  const handleBackToLogin = useCallback(() => {
    console.log("🔐 Back to login");
    updateAppState({ 
      currentScreen: 'login'
    });
  }, [updateAppState]);

  const handleBackToContact = useCallback(() => {
    console.log("📱 Back to contact");
    updateAppState({ 
      currentScreen: 'contact'
    });
  }, [updateAppState]);

  const handleOTPResend = useCallback(() => {
    console.log("🔄 Resend OTP");
    toast.info("OTP resent to your phone");
  }, []);

  const handleDriverLogin = useCallback((driverData: any) => {
    console.log("🚗 Driver login:", driverData);
    updateAppState({ 
      isLoggedIn: true,
      isDriverMode: true,
      currentScreen: 'driver-dashboard',
      driverData: driverData
    });
  }, [updateAppState]);

  const handleDriverSignupContinue = useCallback((signupData: any) => {
    console.log("🚗 Driver signup continue:", signupData);
    updateAppState({ 
      currentScreen: 'driver-email-collection'
    });
  }, [updateAppState]);

  const handleDriverSignupBack = useCallback(() => {
    console.log("🔙 Driver signup back");
    updateAppState({ 
      currentScreen: 'driver-login'
    });
  }, [updateAppState]);

  const handleDriverEmailCollectionContinue = useCallback(async (driverData: { firstName: string; lastName: string; email: string }) => {
    console.log("📧 Driver details collected:", driverData);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        toast.error('Please login again');
        return;
      }

      // Update user profile with collected details
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          firstName: driverData.firstName,
          lastName: driverData.lastName,
          email: driverData.email
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log("✅ Driver profile updated:", data.data);
        
        // Update user in localStorage
        const updatedUser = {
          ...data.data.user,
          firstName: driverData.firstName,
          lastName: driverData.lastName,
          email: driverData.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update app state with new user email
        updateAppState({ 
          currentScreen: 'driver-language-selection',
          userEmail: driverData.email
        });
        
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('❌ Error updating driver profile:', error);
      toast.error(error.message || 'Failed to update profile');
      
      // Continue anyway to language selection
      updateAppState({ 
        currentScreen: 'driver-language-selection'
      });
    }
  }, [updateAppState]);

  const handleDriverEmailCollectionBack = useCallback(() => {
    console.log("🔙 Driver email collection back");
    updateAppState({ 
      currentScreen: 'driver-signup'
    });
  }, [updateAppState]);

  const handleDriverLanguageSelectionContinue = useCallback((languageData: any) => {
    console.log("🌐 Driver language selection continue:", languageData);
    updateAppState({ 
      currentScreen: 'driver-earning-setup'
    });
  }, [updateAppState]);

  const handleDriverLanguageSelectionBack = useCallback(() => {
    console.log("🔙 Driver language selection back");
    updateAppState({ 
      currentScreen: 'driver-email-collection'
    });
  }, [updateAppState]);

  const handleDriverEarningSetupContinue = useCallback((earningData: any) => {
    console.log("💼 Driver earning setup continue:", earningData);
    updateAppState({ 
      currentScreen: 'driver-vehicle-selection'
    });
  }, [updateAppState]);

  const handleDriverEarningSetupBack = useCallback(() => {
    console.log("🔙 Driver earning setup back");
    updateAppState({ 
      currentScreen: 'driver-language-selection'
    });
  }, [updateAppState]);

  const handleDriverVehicleSelectionContinue = useCallback((vehicleData: any) => {
    console.log("🚗 Driver vehicle selection continue:", vehicleData);
    updateAppState({ 
      currentScreen: 'driver-license-upload'
    });
  }, [updateAppState]);

  const handleDriverVehicleSelectionBack = useCallback(() => {
    console.log("🔙 Driver vehicle selection back");
    updateAppState({ 
      currentScreen: 'driver-earning-setup'
    });
  }, [updateAppState]);

  const handleDriverRideSelectionBack = useCallback(() => {
    console.log("🔙 Driver ride selection back");
    updateAppState({ 
      currentScreen: 'driver-vehicle-selection'
    });
  }, [updateAppState]);

  const handleDriverAcceptRide = useCallback((rideData: any) => {
    console.log("✅ Driver accepted ride:", rideData);
    updateAppState({ 
      currentScreen: 'driver-tracking',
      driverData: rideData
    });
  }, [updateAppState]);

  const handleDriverToggleOnline = useCallback((isOnline: boolean) => {
    console.log("🔄 Driver toggle online:", isOnline);
    updateAppState({ 
      isDriverOnline: isOnline
    });
  }, [updateAppState]);

  const handleDriverSupport = useCallback(() => {
    console.log("🆘 Driver support");
    toast.info("Support contacted");
  }, []);

  const handleDriverLicenseUploadContinue = useCallback((licenseData: any) => {
    console.log("📄 Driver license upload continue:", licenseData);
    updateAppState({ 
      currentScreen: 'driver-profile-photo'
    });
  }, [updateAppState]);

  const handleDriverLicenseUploadBack = useCallback(() => {
    console.log("🔙 Driver license upload back");
    updateAppState({ 
      currentScreen: 'driver-vehicle-selection'
    });
  }, [updateAppState]);

  const handleDriverProfilePhotoContinue = useCallback((photoData: any) => {
    console.log("📸 Driver profile photo continue:", photoData);
    updateAppState({ 
      currentScreen: 'driver-photo-confirmation'
    });
  }, [updateAppState]);

  const handleDriverProfilePhotoBack = useCallback(() => {
    console.log("🔙 Driver profile photo back");
    updateAppState({ 
      currentScreen: 'driver-license-upload'
    });
  }, [updateAppState]);

  const handleDriverPhotoConfirmationContinue = useCallback(() => {
    console.log("✅ Driver photo confirmation continue");
    updateAppState({ 
      currentScreen: 'driver-document-upload'
    });
  }, [updateAppState]);

  const handleDriverPhotoConfirmationBack = useCallback(() => {
    console.log("🔙 Driver photo confirmation back");
    updateAppState({ 
      currentScreen: 'driver-profile-photo'
    });
  }, [updateAppState]);

  const handleDriverDocumentUploadNext = useCallback((documentData: any) => {
    console.log("📋 Driver document upload next:", documentData);
    updateAppState({ 
      currentScreen: 'driver-document-verification'
    });
  }, [updateAppState]);

  const handleDriverDocumentUploadBack = useCallback(() => {
    console.log("🔙 Driver document upload back");
    updateAppState({ 
      currentScreen: 'driver-photo-confirmation'
    });
  }, [updateAppState]);

  const handleDriverDocumentVerificationBack = useCallback(() => {
    console.log("🔙 Driver document verification back");
    updateAppState({ 
      currentScreen: 'driver-document-upload'
    });
  }, [updateAppState]);

  const handleStartEarning = useCallback(() => {
    console.log("💰 Start earning");
    updateAppState({ 
      currentScreen: 'driver-dashboard'
    });
  }, [updateAppState]);

  const handleDriverDocumentVerificationSuccessBack = useCallback(() => {
    console.log("🔙 Driver document verification success back");
    updateAppState({ 
      currentScreen: 'driver-document-verification'
    });
  }, [updateAppState]);

  const handleDriverLoginBack = useCallback(() => {
    console.log("🔙 Driver login back");
    updateAppState({ 
      currentScreen: 'dashboard',
      isDriverMode: false
    });
  }, [updateAppState]);

  const handleDriverDashboardBack = useCallback(() => {
    console.log("🔙 Driver dashboard back");
    updateAppState({ 
      currentScreen: 'dashboard',
      isDriverMode: false
    });
  }, [updateAppState]);

  const handleTripComplete = useCallback(() => {
    console.log("✅ Trip completed");
    updateAppState({ 
      currentScreen: 'driver-dashboard',
      driverData: null,
      bookingData: null
    });
  }, [updateAppState]);

  // 🚀 PERFORMANCE: Add loading wrapper for all screens with error boundary
  const renderScreen = useCallback((ScreenComponent: React.ComponentType<any>, props: any) => (
    <Suspense fallback={<ScreenLoader />}>
      <ScreenComponent {...props} />
    </Suspense>
  ), []);

  // Show dashboard loading during app initialization
  if (isAppInitializing) {
    console.log("⏳ App initializing - checking user status");
    return renderScreen(DashboardScreen, {
      onFindRide: () => {},
      onOpenDriversApp: () => {},
      onSwitchAccount: () => {},
      onLogout: () => {},
      userEmail,
      isLoggedIn: false // During initialization, always show as not logged in
    });
  }

  // Main screen routing with performance optimization
  if (currentScreen === 'driver-email-collection') {
    console.log("🚗 Rendering Driver Email Collection Screen");
    return renderScreen(DriverEmailCollectionScreen, {
      onContinue: handleDriverEmailCollectionContinue,
      onBack: handleDriverEmailCollectionBack,
      onSupport: handleDriverSupport,
      userEmail
    });
  }

  if (currentScreen === 'driver-language-selection') {
    console.log("🌐 Rendering Driver Language Selection Screen");
    return renderScreen(DriverLanguageSelectionScreen, {
      onContinue: handleDriverLanguageSelectionContinue,
      onBack: handleDriverLanguageSelectionBack,
      onSupport: handleDriverSupport,
      userEmail
    });
  }

  if (currentScreen === 'driver-earning-setup') {
    console.log("💼 Rendering Driver Earning Setup Screen");
    return renderScreen(DriverEarningSetupScreen, {
      onContinue: handleDriverEarningSetupContinue,
      onBack: handleDriverEarningSetupBack,
      onSupport: handleDriverSupport,
      userEmail
    });
  }

  if (currentScreen === 'driver-vehicle-selection') {
    console.log("🚗 Rendering Driver Vehicle Selection Screen");
    return renderScreen(DriverVehicleSelectionScreen, {
      onContinue: handleDriverVehicleSelectionContinue,
      onBack: handleDriverVehicleSelectionBack,
      onSupport: handleDriverSupport,
      userEmail
    });
  }

  if (currentScreen === 'driver-ride-selection') {
    console.log("🎯 Rendering Driver Ride Selection Screen");
    return renderScreen(DriverRideSelectionScreen, {
      onBack: handleDriverRideSelectionBack,
      onAcceptRide: handleDriverAcceptRide,
      onToggleOnline: handleDriverToggleOnline,
      onSupport: handleDriverSupport,
      userEmail,
      isOnline: isDriverOnline,
      selectedVehicleType: localStorage.getItem('raahi_driver_selected_vehicle') || 'motorbike'
    });
  }

  if (currentScreen === 'driver-license-upload') {
    console.log("📄 Rendering Driver License Upload Screen");
    return renderScreen(DriverLicenseUploadScreen, {
      onContinue: handleDriverLicenseUploadContinue,
      onBack: handleDriverLicenseUploadBack,
      onSupport: handleDriverSupport,
      userEmail
    });
  }

  if (currentScreen === 'driver-profile-photo') {
    console.log("📸 Rendering Driver Profile Photo Screen");
    return renderScreen(DriverProfilePhotoScreen, {
      onContinue: handleDriverProfilePhotoContinue,
      onBack: handleDriverProfilePhotoBack,
      onSupport: handleDriverSupport,
      userEmail
    });
  }

  if (currentScreen === 'driver-photo-confirmation') {
    console.log("✅ Rendering Driver Photo Confirmation Screen");
    return renderScreen(DriverPhotoConfirmationScreen, {
      onContinue: handleDriverPhotoConfirmationContinue,
      onBack: handleDriverPhotoConfirmationBack,
      userEmail
    });
  }

  if (currentScreen === 'driver-document-upload') {
    console.log("📋 Rendering Driver Document Upload Screen");
    return renderScreen(DriverDocumentUploadScreen, {
      onNext: handleDriverDocumentUploadNext,
      onBack: handleDriverDocumentUploadBack,
      onSupport: handleDriverSupport,
      userEmail
    });
  }

  if (currentScreen === 'driver-document-verification') {
    console.log("🔍 Rendering Driver Document Verification Screen");
    return renderScreen(DriverDocumentVerificationScreen, {
      onBack: handleDriverDocumentVerificationBack,
      onSupport: handleDriverSupport,
      userEmail
    });
  }

  if (currentScreen === 'driver-document-verification-success') {
    console.log("🎉 Rendering Driver Document Verification Success Screen");
    return renderScreen(DriverDocumentVerificationSuccessScreen, {
      onStartEarning: handleStartEarning,
      onBack: handleDriverDocumentVerificationSuccessBack,
      userEmail
    });
  }

  if (currentScreen === 'driver-login') {
    console.log("🚗 Rendering Driver Login Screen");
    return renderScreen(DriverLoginScreen, {
      onDriverLogin: handleDriverLogin,
      onDriverSignup: () => {
        console.log("🚗 Driver signup clicked - starting onboarding flow");
        updateAppState({ 
          currentScreen: 'driver-email-collection'
        });
      },
      onBack: handleDriverLoginBack
    });
  }

  if (currentScreen === 'driver-dashboard') {
    console.log("🚗 Rendering Driver Dashboard Screen");
    return renderScreen(DriverDashboardScreen, {
      onBack: handleDriverDashboardBack,
      onToggleOnline: handleDriverToggleOnline,
      userEmail,
      isOnline: isDriverOnline
    });
  }

  if (currentScreen === 'driver-signup') {
    console.log("🚗 Rendering Driver Signup Screen");
    return renderScreen(DriverSignupScreen, {
      onContinue: handleDriverSignupContinue,
      onBack: handleDriverSignupBack,
      userEmail
    });
  }
  
  if (currentScreen === 'driver-tracking') {
    console.log("🚗 Rendering Driver Tracking Screen");
    return renderScreen(DriverTrackingScreen, {
      driver: driverData,
      otp: "2323",
      pickupLocation: bookingData?.pickupLocation,
      dropLocation: bookingData?.dropLocation,
      onTripComplete: handleTripComplete,
      onCancel: handleCancelBooking,
      onBack: handleBackFromDriverTracking
    });
  }
  
  if (currentScreen === 'booking-loader') {
    console.log("🔄 Rendering Booking Loader Screen");
    return renderScreen(BookingLoaderScreen, {
      selectedVehicle: bookingData?.selectedVehicle,
      pickupLocation: bookingData?.pickupLocation,
      dropLocation: bookingData?.dropLocation,
      pickupCoords: bookingData?.pickupCoords,
      dropCoords: bookingData?.dropCoords,
      onDriverFound: handleDriverFound,
      onCancel: handleCancelBooking,
      onBack: handleBackFromBookingLoader
    });
  }
  
  if (currentScreen === 'booking') {
    console.log("🚗 Rendering Ride Booking Screen");
    return renderScreen(RideBookingScreen, {
      onRideBooked: handleRideBooked,
      onBack: handleBackToDashboardFromBooking
    });
  }
  
  if (currentScreen === 'terms') {
    console.log("📋 Rendering Terms Screen");
    return renderScreen(TermsScreen, {
      onAccept: handleTermsAccept,
      onBack: handleBackToLogin
    });
  }
  
  if (currentScreen === 'otp') {
    console.log("🔢 Rendering OTP Screen");
    return renderScreen(OTPVerificationScreen, {
      phoneNumber: userPhoneNumber,
      onVerify: handleOTPVerify,
      onBack: handleBackToContact,
      onResend: handleOTPResend
    });
  }
  
  if (currentScreen === 'contact') {
    console.log("📱 Rendering Contact Screen");
    return renderScreen(ContactNumberScreen, {
      onSubmit: handleContactSubmit,
      onBack: handleBackToLogin
    });
  }

  if (currentScreen === 'login') {
    console.log("🔐 Rendering Login Screen");
    return renderScreen(LoginScreen, {
      onLogin: handleLogin
    });
  }

  if (currentScreen === 'mobile-number') {
    console.log("📱 Rendering Mobile Number Screen");
    return renderScreen(MobileNumberScreen, {
      onSubmit: handleMobileNumberSubmit,
      onBack: () => updateAppState({ currentScreen: 'login' })
    });
  }

  if (currentScreen === 'mobile-otp') {
    console.log("🔢 Rendering Mobile OTP Screen");
    return renderScreen(MobileOTPScreen, {
      phoneNumber: userPhoneNumber || '',
      onVerify: handleMobileOTPVerify,
      onResend: handleMobileOTPResend,
      onBack: () => updateAppState({ currentScreen: 'mobile-number' as any })
    });
  }

  if (currentScreen === 'admin-dashboard') {
    console.log("👨‍💼 Rendering Admin Dashboard Screen");
    return renderScreen(AdminDashboardScreen, {
      onBack: () => updateAppState({ currentScreen: 'dashboard' })
    });
  }

  // Default screen - Dashboard (always shown first)
  console.log("🏠 Rendering Dashboard Screen", { isLoggedIn, userEmail });
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {renderScreen(DashboardScreen, {
        onFindRide: handleFindRide,
        onOpenDriversApp: handleOpenDriversApp,
        onSwitchAccount: handleSwitchAccount,
        onLogout: handleLogout,
        onOpenAdmin: () => updateAppState({ currentScreen: 'admin-dashboard' }),
        userEmail,
        isLoggedIn
      })}
    </div>
  );
}