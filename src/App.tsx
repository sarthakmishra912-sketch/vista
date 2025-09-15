import React, { lazy, Suspense, useMemo, useCallback, startTransition } from 'react';
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import useAppState from './hooks/useAppState';

// Global callback for document verification success
declare global {
  interface Window {
    handleDocumentVerificationSuccess?: () => void;
  }
}

// 🚀 PERFORMANCE OPTIMIZATION: Lazy load all screens
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const DashboardScreen = lazy(() => import('./components/DashboardScreen'));
const ContactNumberScreen = lazy(() => import('./components/ContactNumberScreen'));
const OTPVerificationScreen = lazy(() => import('./components/OTPVerificationScreen'));
const TermsScreen = lazy(() => import('./components/TermsScreen'));
const RideBookingScreen = lazy(() => import('./components/RideBookingScreen'));
const BookingLoaderScreen = lazy(() => import('./components/BookingLoaderScreen'));
const DriverTrackingScreen = lazy(() => import('./components/DriverTrackingScreen'));
const DriverSignupScreen = lazy(() => import('./components/DriverSignupScreen'));
const DriverDashboardScreen = lazy(() => import('./components/DriverDashboardScreen'));
const DriverLoginScreen = lazy(() => import('./components/DriverLoginScreen'));

// 🎯 LAZY LOAD DRIVER SCREENS: Import individually for better performance
const DriverEmailCollectionScreen = lazy(() => import('./components/driver/DriverEmailCollectionScreen'));
const DriverLanguageSelectionScreen = lazy(() => import('./components/driver/DriverLanguageSelectionScreen'));
const DriverEarningSetupScreen = lazy(() => import('./components/driver/DriverEarningSetupScreen'));
const DriverVehicleSelectionScreen = lazy(() => import('./components/driver/DriverVehicleSelectionScreen'));
const DriverLicenseUploadScreen = lazy(() => import('./components/driver/DriverLicenseUploadScreen'));
const DriverProfilePhotoScreen = lazy(() => import('./components/driver/DriverProfilePhotoScreen'));
const DriverPhotoConfirmationScreen = lazy(() => import('./components/driver/DriverPhotoConfirmationScreen'));
const DriverDocumentUploadScreen = lazy(() => import('./components/driver/DriverDocumentUploadScreen'));
const DriverDocumentVerificationScreen = lazy(() => import('./components/driver/DriverDocumentVerificationScreen'));
const DriverDocumentVerificationSuccessScreen = lazy(() => import('./components/driver/DriverDocumentVerificationSuccessScreen'));
const DriverRideSelectionScreen = lazy(() => import('./components/driver/DriverRideSelectionScreen'));

// Loading fallback component
const ScreenLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#F6EFD8]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-[#CF923D] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#11211E] font-medium">Loading...</p>
    </div>
  </div>
);

// ❌ REMOVED: DriverDocumentVerificationFailureScreen - functionality completely removed

/* ========================================
 * API SERVICES - IMPORT WHEN READY
 * ========================================
 * Uncomment these imports when implementing real API integration:
 * 
 * import { authApi } from './services/auth/authApi';
 * import { passengerApi } from './services/passenger/passengerApi';
 * import { driverApi } from './services/driver/driverApi';
 * import { rideApi } from './services/ride/rideApi';
 * import { documentApi } from './services/document/documentApi';
 * import { verificationApi } from './services/verification/verificationApi';
 * import { locationApi } from './services/location/locationApi';
 * import { paymentApi } from './services/payment/paymentApi';
 * import { notificationApi } from './services/notification/notificationApi';
 * import { analyticsApi } from './services/analytics/analyticsApi';
 * ======================================== */





/* ========================================
 * RAAHI CAB APP - MAIN APPLICATION COMPONENT
 * ========================================
 * 
 * This is the main entry point for the Raahi cab application.
 * It handles both passenger and driver flows with comprehensive
 * state management and API integration points.
 * 
 * ENVIRONMENT SETUP:
 * Before deploying to production, ensure you have:
 * 1. API base URLs configured for different environments
 * 2. Authentication tokens and API keys set up
 * 3. Error monitoring and analytics configured
 * 4. Real-time WebSocket connections established
 * 5. Push notification services configured
 * 
 * API INTEGRATION CHECKLIST:
 * □ Authentication APIs (Login, OTP, Sessions)
 * □ Passenger APIs (Profile, Booking, Payments)
 * □ Driver APIs (Registration, Documents, Earnings)
 * □ Ride APIs (Booking, Tracking, Completion)
 * □ Location APIs (Geocoding, Route Planning)
 * □ Payment APIs (Processing, Wallet, Refunds)
 * □ Notification APIs (Push, SMS, Email)
 * □ Analytics APIs (Events, Metrics, Insights)
 * □ Document APIs (Upload, Verification, Storage)
 * □ Support APIs (Tickets, Chat, FAQ)
 * 
 * REAL-TIME FEATURES TO IMPLEMENT:
 * □ Live ride tracking with WebSocket connections
 * □ Driver location updates and ETA calculations
 * □ Real-time fare calculations and surge pricing
 * □ Push notifications for ride status updates
 * □ In-app chat between driver and passenger
 * □ Live document verification status updates
 * 
 * ======================================== */

export default function App() {
  const appState = useAppState();
  
  // Guard against undefined state
  if (!appState) {
    return <div>Loading...</div>;
  }
  
  const {
    isLoggedIn,
    loginMethod,
    currentScreen,
    userPhoneNumber,
    verifiedOTP,
    hasAcceptedTerms,
    isFirstTimeUser,
    isAppInitializing,
    bookingData,
    driverData,
    userEmail,
    isDriverOnline,
    isDriverMode,
    updateAppState,
  } = appState;

  // ✅ OPTIMIZED STATE RESTORATION: Memoized and debounced
  const driverProgressState = useMemo(() => {
    try {
      const driverEmail = localStorage.getItem('raahi_driver_email');
      const onboardingStatus = localStorage.getItem('raahi_driver_onboarding_status');
      const isDriverMode = localStorage.getItem('raahi_driver_mode') === 'true';
      
      return { driverEmail, onboardingStatus, isDriverMode };
    } catch (error) {
      console.error('❌ Error reading driver progress:', error);
      return { driverEmail: null, onboardingStatus: null, isDriverMode: false };
    }
  }, []);

  // Universal back handler with smart navigation logic - DEFINED EARLY TO AVOID HOISTING ISSUES
  const handleUniversalBack = useCallback(() => {
    console.log("⬅️ Universal back handler triggered from:", currentScreen);
    
    try {
      // Driver mode navigation
      if (isDriverMode) {
        const driverBackMap: Record<string, string> = {
          'driver-language-selection': 'driver-email-collection',
          'driver-earning-setup': 'driver-language-selection',
          'driver-vehicle-selection': 'driver-earning-setup',
          'driver-license-upload': 'driver-vehicle-selection',
          'driver-profile-photo': 'driver-license-upload',
          'driver-photo-confirmation': 'driver-profile-photo',
          'driver-document-upload': 'driver-photo-confirmation',
          'driver-document-verification': 'driver-document-upload',
          'driver-document-verification-success': 'driver-document-verification',
          'driver-ride-selection': 'driver-dashboard',
          'driver-dashboard': 'dashboard',
          'driver-signup': 'driver-login',
          'driver-login': 'dashboard'
        };
        
        const targetScreen = driverBackMap[currentScreen] || 'dashboard';
        updateAppState({ 
          currentScreen: targetScreen,
          isDriverMode: targetScreen.startsWith('driver-')
        });
      } else {
        // Passenger mode navigation
        const passengerBackMap: Record<string, string> = {
          'login': 'dashboard',
          'contact': 'login',
          'otp': 'contact',
          'terms': 'otp',
          'booking': 'dashboard',
          'booking-loader': 'booking',
          'driver-tracking': 'booking'
        };
        
        const targetScreen = passengerBackMap[currentScreen] || 'dashboard';
        updateAppState({ currentScreen: targetScreen });
      }
    } catch (error) {
      console.error("Error in universal back navigation:", error);
      // Ultimate fallback - go to dashboard
      updateAppState({ 
        currentScreen: 'dashboard',
        isDriverMode: false
      });
    }
  }, [currentScreen, isDriverMode, updateAppState]);

  React.useEffect(() => {
    if (isAppInitializing || !driverProgressState.isDriverMode) return;
    
    const { driverEmail, onboardingStatus } = driverProgressState;
    
    if (driverEmail && onboardingStatus) {
      console.log(`📊 Resuming driver progress: ${onboardingStatus}`);
      
      const screenMap: Record<string, string> = {
        'language_selection': 'driver-language-selection',
        'earning_setup': 'driver-earning-setup',
        'vehicle_selection': 'driver-vehicle-selection',
        'license_upload': 'driver-license-upload',
        'profile_photo': 'driver-profile-photo',
        'photo_confirmation': 'driver-photo-confirmation',
        'documents_required': 'driver-document-upload',
        'documents_under_review': 'driver-document-verification',
        'completed': (() => {
          const selectedVehicle = localStorage.getItem('raahi_driver_selected_vehicle');
          const accountActive = localStorage.getItem('raahi_driver_account_active');
          
          if (selectedVehicle && accountActive === 'true') return 'driver-ride-selection';
          if (accountActive === 'true') return 'driver-vehicle-selection';
          return 'driver-document-verification-success';
        })()
      };
      
      const targetScreen = screenMap[onboardingStatus] || 'driver-email-collection';
      
      startTransition(() => {
        updateAppState({
          isDriverMode: true,
          isLoggedIn: true,
          userEmail: driverEmail,
          currentScreen: targetScreen,
          loginMethod: 'email'
        });
      });
    }
  }, [isAppInitializing, driverProgressState, updateAppState]);

  // 🔙 GLOBAL BACK BUTTON HANDLING: Browser back button and escape key support
  React.useEffect(() => {
    const handleBackNavigation = (event: KeyboardEvent) => {
      // Handle Escape key as back button
      if (event.key === 'Escape' && currentScreen !== 'dashboard') {
        event.preventDefault();
        console.log("⌨️ Escape key pressed - triggering back navigation");
        handleUniversalBack();
      }
    };

    const handleBrowserBack = (event: PopStateEvent) => {
      // Handle browser back button
      if (currentScreen !== 'dashboard') {
        event.preventDefault();
        console.log("🌐 Browser back button pressed");
        handleUniversalBack();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleBackNavigation);
    window.addEventListener('popstate', handleBrowserBack);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleBackNavigation);
      window.removeEventListener('popstate', handleBrowserBack);
    };
  }, [currentScreen, handleUniversalBack]);

  /* ========================================
   * API INTEGRATION: GLOBAL CONFIGURATION
   * ========================================
   * Configure API clients and global settings:
   * 
   * ```
   * // API Configuration
   * const API_CONFIG = {
   *   baseURL: process.env.REACT_APP_API_BASE_URL,
   *   timeout: 30000,
   *   retryAttempts: 3,
   *   retryDelay: 1000
   * };
   * 
   * // Authentication headers
   * const getAuthHeaders = () => ({
   *   'Authorization': `Bearer ${getSessionToken()}`,
   *   'X-App-Version': APP_VERSION,
   *   'X-Platform': 'web',
   *   'X-Device-ID': getDeviceId()
   * });
   * 
   * // Global error handler
   * const handleApiError = (error, context) => {
   *   if (error.status === 401) {
   *     // Token expired, refresh or logout
   *     handleTokenRefresh();
   *   } else if (error.status === 503) {
   *     // Service unavailable
   *     showMaintenanceMode();
   *   } else {
   *     // Log error for debugging
   *     analyticsApi.logError(error, context);
   *   }
   * };
   * 
   * // Real-time connection setup
   * useEffect(() => {
   *   if (isLoggedIn) {
   *     initializeRealTimeConnections();
   *   }
   *   return () => {
   *     cleanupRealTimeConnections();
   *   };
   * }, [isLoggedIn]);
   * ```
   * ======================================== */

  const handleLogin = useCallback((method: string) => {
    console.log("🚀 User logged in with:", method);
    
    try {
      /* ========================================
       * API INTEGRATION POINT: PASSENGER LOGIN
       * ========================================
       * Replace the demo email and localStorage logic with real API calls:
       * 
       * Example implementation:
       * ```
       * const loginResponse = await authApi.authenticatePassenger({
       *   method: method, // 'truecaller', 'google', 'mobile_otp'
       *   token: authToken, // received from auth provider
       *   deviceInfo: {
       *     deviceId: getDeviceId(),
       *     platform: 'web',
       *     appVersion: APP_VERSION
       *   }
       * });
       * 
       * const { user, sessionToken, refreshToken } = loginResponse.data;
       * 
       * // Store tokens securely
       * await secureStorage.setItem('raahi_session_token', sessionToken);
       * await secureStorage.setItem('raahi_refresh_token', refreshToken);
       * ```
       * ======================================== */
      
      // DEMO: Save user email for demo purposes (REMOVE IN PRODUCTION)
      const demoEmail = "dhruvsiwach@gmail.com";
      localStorage.setItem('raahi_user_email', demoEmail);
      
      // 🚀 PERFORMANCE: Wrap state updates in startTransition
      startTransition(() => {
        updateAppState({
          loginMethod: method,
          isLoggedIn: true,
          userEmail: demoEmail, // Replace with: user.email
          isDriverMode: false, // Ensure we exit driver mode for passenger login
          currentScreen: hasAcceptedTerms ? 'booking' : 'contact'
        });
      });
      
      /* ========================================
       * API INTEGRATION: USER PROFILE & TERMS
       * ========================================
       * After successful login, fetch user profile and terms status:
       * 
       * ```
       * const userProfile = await passengerApi.getUserProfile(user.id);
       * const termsStatus = await authApi.getTermsAcceptanceStatus(user.id);
       * 
       * updateAppState({
       *   hasAcceptedTerms: termsStatus.hasAccepted,
       *   isFirstTimeUser: userProfile.isFirstTime,
       *   currentScreen: termsStatus.hasAccepted ? 'booking' : 'contact'
       * });
       * ```
       * ======================================== */
      
      // Check if user has already accepted terms
      if (hasAcceptedTerms) {
        console.log("🎯 Returning user - going directly to ride booking");
      } else {
        console.log("📱 New user - starting with contact input");
      }
    } catch (error) {
      console.error("Error during login:", error);
      
      /* ========================================
       * API INTEGRATION: ERROR HANDLING
       * ========================================
       * Handle different types of login errors:
       * 
       * ```
       * if (error.code === 'USER_SUSPENDED') {
       *   toast.error("Account suspended", {
       *     description: "Please contact support for assistance"
       *   });
       * } else if (error.code === 'INVALID_TOKEN') {
       *   toast.error("Authentication failed", {
       *     description: "Please try logging in again"
       *   });
       * } else {
       *   toast.error("Login failed", {
       *     description: "Please check your connection and try again"
       *   });
       * }
       * ```
       * ======================================== */
    }
  }, [hasAcceptedTerms, updateAppState]);

  const handleLogout = () => {
    try {
      updateAppState({
        isLoggedIn: false,
        loginMethod: null,
        currentScreen: 'dashboard',
        userPhoneNumber: null,
        verifiedOTP: null,
        isAppInitializing: false,
        bookingData: null,
        userEmail: null,
        isDriverMode: false,
        isDriverOnline: false,
      });
      
      // Clear user data but keep terms acceptance
      localStorage.removeItem('raahi_user_email');
      localStorage.removeItem('raahi_driver_email');
      localStorage.removeItem('raahi_driver_mode');
      localStorage.removeItem('raahi_driver_onboarding_status');
      
      toast.info("Logged out successfully", {
        description: "You can log in again anytime",
        duration: 2500,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleFindRide = useCallback(() => {
    console.log("🚗 Find ride clicked from dashboard");
    
    // Check if user is logged in
    if (isLoggedIn) {
      console.log("✅ User is logged in - going to ride booking");
      startTransition(() => {
        updateAppState({ currentScreen: 'booking' });
      });
    } else {
      console.log("❌ User not logged in - showing login screen");
      startTransition(() => {
        updateAppState({ currentScreen: 'login' });
      });
      toast.info("Please log in to book a ride", {
        description: "Choose your preferred login method",
        duration: 3000,
      });
    }
  }, [isLoggedIn, updateAppState]);

  const handleSwitchAccount = () => {
    console.log("🔄 Switch account clicked");
    updateAppState({ currentScreen: 'login' });
    toast.info("Choose your login method", {
      description: "Select how you'd like to log in",
      duration: 2500,
    });
  };

  const handleOpenDriversApp = useCallback(() => {
    console.log("🚗 Open Drivers' App clicked - showing email collection screen");
    
    // Set driver mode and show email collection screen directly
    localStorage.setItem('raahi_driver_mode', 'true');
    startTransition(() => {
      updateAppState({ 
        isDriverMode: true,
        currentScreen: 'driver-email-collection'
      });
    });
    
    toast.info("Welcome to Raahi Driver", {
      description: "Complete your registration to start earning",
      duration: 3000,
    });
  }, [updateAppState]);

  const handleBackToDashboard = () => {
    console.log("⬅️ Back to dashboard");
    updateAppState({ currentScreen: 'dashboard' });
  };

  const handleBackToBooking = () => {
    console.log("⬅️ Back to ride booking");
    updateAppState({ currentScreen: 'booking' });
  };

  const handleBackFromDriverTracking = () => {
    console.log("⬅️ Back from driver tracking to booking");
    updateAppState({ currentScreen: 'booking' });
  };

  const handleBackFromBookingLoader = () => {
    console.log("⬅️ Back from booking loader to booking");
    updateAppState({ currentScreen: 'booking' });
  };

  const handleContactSubmit = (phoneNumber: string) => {
    console.log("📱 Phone number submitted:", phoneNumber);
    updateAppState({ 
      userPhoneNumber: phoneNumber,
      currentScreen: 'otp' 
    });
  };

  const handleBackToContact = () => {
    console.log("⬅️ Back to contact");
    updateAppState({ currentScreen: 'contact' });
  };

  const handleBackToLogin = () => {
    console.log("⬅️ Back to login");
    updateAppState({ currentScreen: 'login' });
  };

  const handleOTPVerify = async (otp: string) => {
    console.log("✅ OTP verified successfully:", otp);
    console.log("🔍 Checking terms status:");
    console.log("  - isFirstTimeUser:", isFirstTimeUser);
    console.log("  - hasAcceptedTerms:", hasAcceptedTerms);
    
    try {
      /* ========================================
       * API INTEGRATION POINT: OTP VERIFICATION
       * ========================================
       * Replace with real OTP verification API call:
       * 
       * ```
       * const verificationResponse = await authApi.verifyOTP({
       *   phoneNumber: userPhoneNumber,
       *   otp: otp,
       *   sessionId: otpSessionId // stored from OTP request
       * });
       * 
       * const { user, sessionToken, isFirstTime } = verificationResponse.data;
       * 
       * // Store session token
       * await secureStorage.setItem('raahi_session_token', sessionToken);
       * 
       * // Update app state with real user data
       * updateAppState({
       *   verifiedOTP: otp,
       *   userEmail: user.email,
       *   isFirstTimeUser: isFirstTime,
       *   isLoggedIn: true
       * });
       * ```
       * ======================================== */
      
      updateAppState({ verifiedOTP: otp });
      
      /* ========================================
       * API INTEGRATION: TERMS & CONDITIONS CHECK
       * ========================================
       * Check terms acceptance status from backend:
       * 
       * ```
       * const termsStatus = await authApi.getTermsAcceptanceStatus(user.id);
       * 
       * updateAppState({
       *   hasAcceptedTerms: termsStatus.hasAccepted,
       *   currentTermsVersion: termsStatus.currentVersion
       * });
       * ```
       * ======================================== */
      
      // Check if user needs to accept terms (first-time user)
      if (isFirstTimeUser && !hasAcceptedTerms) {
        console.log("📋 First-time user detected - showing terms screen");
        updateAppState({ currentScreen: 'terms' });
        
        // Show info toast
        toast.info("First-time user", {
          description: "Please accept terms & conditions to continue",
          duration: 4000,
        });
      } else {
        console.log("🎯 Returning user - going to ride booking");
        updateAppState({ currentScreen: 'booking' });
        
        /* ========================================
         * API INTEGRATION: USER PROFILE SYNC
         * ========================================
         * Sync user profile data after successful login:
         * 
         * ```
         * const userProfile = await passengerApi.getUserProfile(user.id);
         * const rideHistory = await rideApi.getRecentRides(user.id, { limit: 5 });
         * 
         * // Update app state with user data
         * updateAppState({
         *   userProfile: userProfile.data,
         *   recentRides: rideHistory.data
         * });
         * ```
         * ======================================== */
        
        // Show welcome back toast with delay
        setTimeout(() => {
          toast.success("Welcome back!", {
            description: "You're all set to book rides",
            duration: 2500,
          });
        }, 300);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      
      /* ========================================
       * API INTEGRATION: OTP ERROR HANDLING
       * ========================================
       * Handle OTP verification errors:
       * 
       * ```
       * if (error.code === 'INVALID_OTP') {
       *   toast.error("Invalid OTP", {
       *     description: "Please check the code and try again"
       *   });
       * } else if (error.code === 'OTP_EXPIRED') {
       *   toast.error("OTP expired", {
       *     description: "Please request a new code"
       *   });
       * } else if (error.code === 'MAX_ATTEMPTS_EXCEEDED') {
       *   toast.error("Too many attempts", {
       *     description: "Please try again after some time"
       *   });
       * }
       * ```
       * ======================================== */
      
      toast.error("Verification failed", {
        description: "Please check the OTP and try again",
        duration: 3000,
      });
    }
  };

  const handleOTPResend = async () => {
    console.log("📨 OTP resent to:", userPhoneNumber);
    
    try {
      /* ========================================
       * API INTEGRATION POINT: RESEND OTP
       * ========================================
       * Replace with real OTP resend API call:
       * 
       * ```
       * const resendResponse = await authApi.resendOTP({
       *   phoneNumber: userPhoneNumber,
       *   type: 'PASSENGER_LOGIN' // or 'DRIVER_LOGIN'
       * });
       * 
       * const { sessionId, expiresAt } = resendResponse.data;
       * 
       * // Store new session ID
       * setOtpSessionId(sessionId);
       * 
       * toast.success("OTP sent!", {
       *   description: `New code sent to ${userPhoneNumber}`,
       *   duration: 3000
       * });
       * ```
       * ======================================== */
      
      // DEMO: Show success message (REPLACE WITH REAL API CALL)
      toast.success("OTP sent!", {
        description: `New code sent to ${userPhoneNumber}`,
        duration: 3000
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      
      /* ========================================
       * API INTEGRATION: RESEND OTP ERROR HANDLING
       * ========================================
       * Handle resend OTP errors:
       * 
       * ```
       * if (error.code === 'RATE_LIMITED') {
       *   toast.error("Too many requests", {
       *     description: "Please wait before requesting another code"
       *   });
       * } else if (error.code === 'INVALID_PHONE') {
       *   toast.error("Invalid phone number", {
       *     description: "Please go back and enter a valid number"
       *   });
       * }
       * ```
       * ======================================== */
      
      toast.error("Failed to resend OTP", {
        description: "Please try again",
        duration: 3000
      });
    }
  };

  const handleTermsAccept = () => {
    console.log("✅ Terms accepted!");
    
    try {
      updateAppState({
        hasAcceptedTerms: true,
        isFirstTimeUser: false,
        currentScreen: 'booking'
      });
      
      // Save to localStorage
      localStorage.setItem('raahi_has_accepted_terms', 'true');
      console.log("💾 Terms acceptance saved to localStorage");
      console.log("🎯 Redirecting to ride booking screen");
    } catch (error) {
      console.error("Error accepting terms:", error);
    }
  };

  const handleTermsBack = () => {
    console.log("⬅️ User went back from terms to OTP screen");
    updateAppState({ currentScreen: 'otp' });
  };



  const handleBackToDashboardFromBooking = () => {
    console.log("⬅️ Back to dashboard from booking");
    updateAppState({ currentScreen: 'dashboard' });
  };

  const handleRideBooked = async (rideData: any) => {
    console.log("🚗 Ride booked with data:", rideData);
    
    try {
      /* ========================================
       * API INTEGRATION POINT: RIDE BOOKING
       * ========================================
       * Replace with real ride booking API call:
       * 
       * ```
       * const bookingResponse = await rideApi.createRideRequest({
       *   passengerId: user.id,
       *   pickupLocation: {
       *     latitude: rideData.pickupLocation.lat,
       *     longitude: rideData.pickupLocation.lng,
       *     address: rideData.pickupLocation.address
       *   },
       *   dropoffLocation: {
       *     latitude: rideData.dropLocation.lat,
       *     longitude: rideData.dropLocation.lng,
       *     address: rideData.dropLocation.address
       *   },
       *   vehicleType: rideData.selectedVehicle.type,
       *   paymentMethod: rideData.paymentMethod,
       *   estimatedFare: rideData.estimatedFare,
       *   scheduledTime: rideData.scheduledTime, // for scheduled rides
       *   specialRequests: rideData.specialRequests
       * });
       * 
       * const { rideId, estimatedWaitTime } = bookingResponse.data;
       * 
       * // Start real-time tracking
       * const unsubscribe = rideApi.subscribeToRideUpdates(rideId, (update) => {
       *   handleRideUpdate(update);
       * });
       * ```
       * ======================================== */
      
      updateAppState({
        bookingData: rideData,
        currentScreen: 'booking-loader'
      });
      
      /* ========================================
       * API INTEGRATION: ANALYTICS & TRACKING
       * ========================================
       * Track ride booking event:
       * 
       * ```
       * await analyticsApi.trackEvent('ride_requested', {
       *   rideId: rideId,
       *   vehicleType: rideData.selectedVehicle.type,
       *   estimatedDistance: rideData.estimatedDistance,
       *   estimatedFare: rideData.estimatedFare,
       *   paymentMethod: rideData.paymentMethod,
       *   timestamp: new Date().toISOString()
       * });
       * ```
       * ======================================== */
      
    } catch (error) {
      console.error("Error booking ride:", error);
      
      /* ========================================
       * API INTEGRATION: RIDE BOOKING ERROR HANDLING
       * ========================================
       * Handle ride booking errors:
       * 
       * ```
       * if (error.code === 'NO_DRIVERS_AVAILABLE') {
       *   toast.error("No drivers available", {
       *     description: "Please try again or choose a different vehicle type"
       *   });
       * } else if (error.code === 'PAYMENT_METHOD_INVALID') {
       *   toast.error("Payment issue", {
       *     description: "Please update your payment method"
       *   });
       * } else if (error.code === 'LOCATION_NOT_SERVICEABLE') {
       *   toast.error("Service unavailable", {
       *     description: "We don't service this area yet"
       *   });
       * }
       * ```
       * ======================================== */
      
      toast.error("Booking failed", {
        description: "Please try again",
        duration: 3000
      });
    }
  };

  const handleDriverFound = (foundDriverData: any) => {
    console.log("👨‍✈️ Driver found:", foundDriverData);
    
    // Dismiss any existing toasts
    toast.dismiss();
    
    updateAppState({
      driverData: foundDriverData,
      currentScreen: 'driver-tracking'
    });
    
    // Show driver found toast
    setTimeout(() => {
      toast.success(`Driver ${foundDriverData.name} accepted your ride!`, {
        description: `ETA: ${foundDriverData.eta} • ${foundDriverData.vehicle}`,
        duration: 4000,
      });
    }, 200);
  };

  const handleCancelBooking = () => {
    console.log("❌ Booking cancelled");
    
    // Dismiss any existing toasts first
    toast.dismiss();
    
    // Update state - go back to dashboard
    updateAppState({
      currentScreen: 'dashboard',
      bookingData: null,
      driverData: null
    });
    
    // Show cancellation toast with proper cleanup
    setTimeout(() => {
      toast.info("Booking cancelled", {
        description: "You can book another ride anytime",
        duration: 2500,
      });
    }, 100);
  };

  const handleTripComplete = () => {
    console.log("✅ Trip completed");
    
    // Dismiss any existing toasts
    toast.dismiss();
    
    // TODO: Navigate to trip completion/rating screen
    updateAppState({
      currentScreen: 'dashboard',
      bookingData: null,
      driverData: null
    });
    
    // Show completion toast
    setTimeout(() => {
      toast.success("Trip completed!", {
        description: "Thank you for choosing Raahi",
        duration: 3500,
      });
    }, 150);
  };

  const handleDriverSignupContinue = (email: string, password: string) => {
    console.log("🚗 Driver signup continue clicked:", { email, password });
    
    // TODO: Implement actual driver registration API call
    toast.success("Driver account created successfully!", {
      description: "Welcome to Raahi Drivers",
      duration: 3000,
    });
    
    // Save driver email and ensure we stay in driver mode
    localStorage.setItem('raahi_driver_email', email);
    
    // Navigate to driver dashboard and ensure driver mode is maintained
    setTimeout(() => {
      updateAppState({ 
        currentScreen: 'driver-dashboard',
        isDriverMode: true,
        userEmail: email
      });
    }, 1000);
  };

  const handleDriverSignupBack = () => {
    console.log("⬅️ Back from driver signup");
    // If in driver mode, go back to driver login, otherwise go to main dashboard
    updateAppState({ 
      currentScreen: isDriverMode ? 'driver-login' : 'dashboard'
    });
  };

  const handleDriverDashboardBack = () => {
    console.log("⬅️ Back from driver dashboard to main dashboard");
    updateAppState({ 
      currentScreen: 'dashboard',
      isDriverMode: false
    });
  };

  const handleDriverLogin = (method: string, email?: string, password?: string) => {
    console.log("🚗 Driver logged in with:", { method, email });
    
    try {
      // Save driver email for demo purposes
      const driverEmail = email || "driver@raahi.com";
      localStorage.setItem('raahi_driver_email', driverEmail);
      
      updateAppState({
        loginMethod: method,
        isLoggedIn: true,
        userEmail: driverEmail,
        isDriverMode: true,
        currentScreen: method === 'signup' ? 'driver-signup' : 'driver-dashboard'
      });
      
      toast.success("Driver login successful!", {
        description: "Welcome to Raahi Driver",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error during driver login:", error);
    }
  };

  const handleDriverLoginBack = () => {
    console.log("⬅️ Back from driver login to main dashboard");
    updateAppState({ 
      currentScreen: 'dashboard',
      isDriverMode: false
    });
  };

  const handleDriverEmailCollectionContinue = async (email: string) => {
    console.log("🚗 Driver email collection continue clicked:", { email });
    
    try {
      // Show loading toast
      const loadingToast = toast.loading("Creating your driver account...", {
        description: "Please wait while we set up your profile",
      });

      /* ========================================
       * API INTEGRATION POINT: DRIVER REGISTRATION
       * ========================================
       * Replace mock API call with real driver registration:
       * 
       * ```
       * const registrationResponse = await driverApi.registerDriver({
       *   email: email,
       *   platform: 'web',
       *   deviceInfo: {
       *     deviceId: getDeviceId(),
       *     userAgent: navigator.userAgent,
       *     timestamp: new Date().toISOString()
       *   },
       *   referralCode: getReferralFromURL() // if applicable
       * });
       * 
       * const { 
       *   driverId, 
       *   sessionToken, 
       *   onboardingStatus, 
       *   requiredDocuments 
       * } = registrationResponse.data;
       * 
       * // Store driver session securely
       * await secureStorage.setItem('raahi_driver_session', sessionToken);
       * await secureStorage.setItem('raahi_driver_id', driverId);
       * ```
       * ======================================== */

      // DEMO: Simulate API call (REPLACE WITH REAL API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // DEMO: Mock successful response (REPLACE WITH REAL DATA)
      const mockDriverId = `driver_${Date.now()}`;
      const mockToken = `mock_token_${Date.now()}`;
      
      // DEMO: Save driver data to localStorage (REPLACE WITH SECURE STORAGE)
      localStorage.setItem('raahi_driver_email', email);
      localStorage.setItem('raahi_driver_id', mockDriverId);
      localStorage.setItem('raahi_driver_token', mockToken);
      localStorage.setItem('raahi_driver_onboarding_status', 'language_selection');
      localStorage.setItem('raahi_driver_mode', 'true'); // Track driver mode
      
      /* ========================================
       * API INTEGRATION: DRIVER ONBOARDING STATUS
       * ========================================
       * Check driver's onboarding status to determine next screen:
       * 
       * ```
       * const onboardingStatus = await driverApi.getOnboardingStatus(driverId);
       * 
       * let nextScreen = 'driver-language-selection';
       * 
       * switch (onboardingStatus.currentStep) {
       *   case 'LANGUAGE_SELECTION':
       *     nextScreen = 'driver-language-selection';
       *     break;
       *   case 'EARNING_SETUP':
       *     nextScreen = 'driver-earning-setup';
       *     break;
       *   case 'VEHICLE_SELECTION':
       *     nextScreen = 'driver-vehicle-selection';
       *     break;
       *   case 'DOCUMENT_UPLOAD':
       *     nextScreen = 'driver-document-upload';
       *     break;
       *   case 'VERIFICATION_PENDING':
       *     nextScreen = 'driver-document-verification';
       *     break;
       *   case 'APPROVED':
       *     nextScreen = 'driver-dashboard';
       *     break;
       * }
       * ```
       * ======================================== */
      
      updateAppState({
        loginMethod: 'email',
        isLoggedIn: true,
        userEmail: email,
        isDriverMode: true,
        currentScreen: 'driver-language-selection' // Replace with: nextScreen
      });
      
      /* ========================================
       * API INTEGRATION: DRIVER ANALYTICS
       * ========================================
       * Track driver registration event:
       * 
       * ```
       * await analyticsApi.trackEvent('driver_registered', {
       *   driverId: driverId,
       *   email: email,
       *   registrationSource: 'web_app',
       *   timestamp: new Date().toISOString()
       * });
       * ```
       * ======================================== */
      
      toast.success("Driver registration successful!", {
        description: "Now let's set up your language preference",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error during driver registration:", error);
      
      /* ========================================
       * API INTEGRATION: DRIVER REGISTRATION ERROR HANDLING
       * ========================================
       * Handle different registration errors:
       * 
       * ```
       * if (error.code === 'EMAIL_ALREADY_EXISTS') {
       *   toast.error("Email already registered", {
       *     description: "Please use a different email or try logging in"
       *   });
       * } else if (error.code === 'INVALID_EMAIL') {
       *   toast.error("Invalid email format", {
       *     description: "Please enter a valid email address"
       *   });
       * } else if (error.code === 'DRIVER_LIMIT_REACHED') {
       *   toast.error("Registration temporarily unavailable", {
       *     description: "We'll notify you when spots open up"
       *   });
       * }
       * ```
       * ======================================== */
      
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "Please try again or contact support",
        duration: 4000,
      });
    }
  };

  const handleDriverEmailCollectionBack = () => {
    console.log("⬅️ Back from driver email collection to main dashboard");
    updateAppState({ 
      currentScreen: 'dashboard',
      isDriverMode: false
    });
  };

  const handleDriverSupport = async () => {
    console.log("📞 Driver support clicked");
    
    try {
      /* ========================================
       * API INTEGRATION POINT: COMPREHENSIVE SUPPORT SYSTEM
       * ========================================
       * Implement full-featured support system:
       * 
       * ```
       * // 1. Create support ticket with context
       * const supportTicket = await supportApi.createTicket({
       *   userId: driverId,
       *   userType: 'DRIVER',
       *   category: 'ONBOARDING_HELP', // or get from user selection
       *   priority: 'MEDIUM',
       *   subject: 'Driver onboarding assistance',
       *   description: 'User requested help during onboarding process',
       *   metadata: {
       *     currentScreen: currentScreen,
       *     onboardingStep: getOnboardingStep(),
       *     userAgent: navigator.userAgent,
       *     timestamp: new Date().toISOString()
       *   }
       * });
       * 
       * // 2. Initialize in-app chat if available
       * const chatSession = await supportApi.initializeChatSession({
       *   ticketId: supportTicket.id,
       *   driverId: driverId,
       *   preferredLanguage: getDriverLanguage()
       * });
       * 
       * // 3. Set up real-time chat connection
       * const chatSocket = await supportApi.connectToChat(chatSession.sessionId);
       * 
       * // 4. Send notification to support team
       * await notificationApi.notifySupportTeam({
       *   ticketId: supportTicket.id,
       *   urgency: 'NORMAL',
       *   driverInfo: getDriverContext()
       * });
       * 
       * // 5. Alternative support channels
       * const supportOptions = await supportApi.getSupportOptions({
       *   userType: 'DRIVER',
       *   issue: 'ONBOARDING',
       *   location: getDriverLocation()
       * });
       * 
       * // Options might include:
       * // - Live chat
       * // - Phone callback
       * // - WhatsApp support
       * // - Email support
       * // - Video call assistance
       * // - Local support center visit
       * ```
       * ======================================== */
      
      // DEMO: Simulate a support request (REPLACE WITH REAL IMPLEMENTATION)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      /* ========================================
       * API INTEGRATION: SMART SUPPORT ROUTING
       * ========================================
       * Implement intelligent support routing:
       * 
       * ```
       * // Analyze user's current context and route to appropriate support
       * const supportRouting = await supportApi.getOptimalSupportRoute({
       *   driverId: driverId,
       *   currentIssue: detectCurrentIssue(),
       *   userFrustrationLevel: analyzeFrustrationLevel(),
       *   preferredContactMethod: getUserPreferences().supportContact,
       *   businessHours: isBusinessHours(),
       *   supportAgentAvailability: await supportApi.getAgentAvailability()
       * });
       * 
       * switch (supportRouting.recommendedAction) {
       *   case 'LIVE_CHAT':
       *     openLiveChatWidget();
       *     break;
       *   case 'PHONE_CALLBACK':
       *     schedulePhoneCallback();
       *     break;
       *   case 'FAQ_REDIRECT':
       *     showRelevantFAQ();
       *     break;
       *   case 'VIDEO_SUPPORT':
       *     initializeVideoSupport();
       *     break;
       * }
       * ```
       * ======================================== */
      
      toast.success("Support request submitted", {
        description: "Our team will contact you within 24 hours",
        duration: 4000,
      });
    } catch (error) {
      console.error("Support request error:", error);
      
      /* ========================================
       * API INTEGRATION: FALLBACK SUPPORT OPTIONS
       * ========================================
       * Provide fallback support when API fails:
       * 
       * ```
       * // Show multiple contact options as fallback
       * const fallbackSupport = {
       *   phone: '+91-1234567890',
       *   email: 'driver-support@raahi.com',
       *   whatsapp: '+91-9876543210',
       *   telegram: '@raahi_support',
       *   supportHours: '24/7 for emergencies, 9 AM - 9 PM for general queries'
       * };
       * 
       * toast.error("Support system temporarily unavailable", {
       *   description: `Please call ${fallbackSupport.phone} or email ${fallbackSupport.email}`,
       *   duration: 8000,
       *   action: {
       *     label: "View all options",
       *     onClick: () => showSupportOptions(fallbackSupport)
       *   }
       * });
       * ```
       * ======================================== */
      
      toast.info("Driver Support", {
        description: "Call us at +91-1234567890 or email support@raahi.com",
        duration: 6000,
      });
    }
  };

  const handleDriverToggleOnline = (isOnline: boolean) => {
    console.log("🔄 Driver toggled online status:", isOnline);
    
    // Update the driver online status in state
    updateAppState({ isDriverOnline: isOnline });
    
    // TODO: Update driver online status in backend
    toast.info(isOnline ? "You are now online" : "You are now offline", {
      description: isOnline ? "You'll receive ride requests" : "You won't receive ride requests",
      duration: 2500,
    });
  };

  const handleDriverLanguageSelectionContinue = async (selectedLanguage: string) => {
    console.log("🌐 Driver language selection continue clicked:", { selectedLanguage });
    
    try {
      // Save language preference and update onboarding status
      localStorage.setItem('raahi_driver_language', selectedLanguage);
      localStorage.setItem('raahi_driver_onboarding_status', 'earning_setup');
      
      // TODO: Update driver language preference via API
      // await driverApi.updateDriverPreferences(driverId, { language: selectedLanguage });
      
      // Navigate to earning setup screen
      updateAppState({
        currentScreen: 'driver-earning-setup'
      });
      
      toast.success("Language preference saved!", {
        description: "Now let's set up your earning preferences",
        duration: 2500,
      });
    } catch (error) {
      console.error("Error saving language preference:", error);
      toast.error("Failed to save language preference", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    }
  };

  const handleDriverLanguageSelectionBack = () => {
    console.log("⬅️ Back from driver language selection to email collection");
    updateAppState({ currentScreen: 'driver-email-collection' });
  };

  const handleDriverEarningSetupContinue = async (setupData: { location: string; referralCode?: string }) => {
    console.log("💼 Driver earning setup continue clicked:", setupData);
    
    try {
      // Save earning setup preferences and update onboarding status
      localStorage.setItem('raahi_driver_location', setupData.location);
      localStorage.setItem('raahi_driver_onboarding_status', 'vehicle_selection');
      if (setupData.referralCode) {
        localStorage.setItem('raahi_driver_referral_code', setupData.referralCode);
      }
      
      // TODO: Update driver setup preferences via API
      // await driverApi.updateDriverSetup(driverId, {
      //   location: setupData.location,
      //   referral_code: setupData.referralCode
      // });
      
      // Navigate to vehicle selection screen
      updateAppState({
        currentScreen: 'driver-vehicle-selection'
      });
      
      toast.success("Setup completed!", {
        description: "Now choose your vehicle type to start earning",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving earning setup:", error);
      toast.error("Failed to save setup preferences", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    }
  };

  const handleDriverEarningSetupBack = () => {
    console.log("⬅️ Back from driver earning setup to language selection");
    updateAppState({ currentScreen: 'driver-language-selection' });
  };

  const handleDriverVehicleSelectionContinue = async (vehicleData: { 
    vehicleType: string; 
    serviceTypes: string[]; 
    expectedEarnings: { daily: number; hourly: number } 
  }) => {
    console.log("🚗 Driver vehicle selection continue clicked:", vehicleData);
    
    try {
      // Save vehicle selection data and update onboarding status
      localStorage.setItem('raahi_driver_vehicle_selection', JSON.stringify(vehicleData));
      localStorage.setItem('raahi_driver_selected_vehicle', vehicleData.vehicleType);
      localStorage.setItem('raahi_driver_onboarding_status', 'license_upload');
      
      // TODO: Update driver vehicle selection via API
      // await driverApi.updateDriverVehicleSelection(driverId, {
      //   vehicle_type: vehicleData.vehicleType,
      //   service_types: vehicleData.serviceTypes,
      //   expected_earnings: vehicleData.expectedEarnings,
      //   timestamp: new Date().toISOString()
      // });
      
      // Navigate to license upload screen as part of document verification
      updateAppState({
        currentScreen: 'driver-license-upload'
      });
      
      const vehicleTypeName = vehicleData.vehicleType === 'commercial_car' ? 'Commercial Car' : 
                             vehicleData.vehicleType === 'motorbike' ? 'Motorbike' : 'Driver';
      
      toast.success("Vehicle selection saved!", {
        description: `Ready to earn with ${vehicleTypeName} - Expected: ₹${vehicleData.expectedEarnings.daily}/day`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving vehicle selection:", error);
      toast.error("Failed to save vehicle selection", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    }
  };

  const handleDriverVehicleSelectionBack = () => {
    console.log("⬅️ Back from driver vehicle selection to earning setup");
    updateAppState({ currentScreen: 'driver-earning-setup' });
  };

  const handleDriverLicenseUploadContinue = async (licenseData: { frontImage: File | null }) => {
    console.log("📄 Driver license upload continue clicked:", licenseData);
    
    try {
      /* ========================================
       * API INTEGRATION POINT: LICENSE DOCUMENT UPLOAD
       * ========================================
       * Replace with real document upload API:
       * 
       * ```
       * // 1. Upload file to secure storage
       * const uploadResponse = await documentApi.uploadDocument({
       *   driverId: driverId,
       *   documentType: 'DRIVING_LICENSE',
       *   file: licenseData.frontImage,
       *   metadata: {
       *     uploadedAt: new Date().toISOString(),
       *     fileSize: licenseData.frontImage?.size,
       *     fileName: licenseData.frontImage?.name
       *   }
       * });
       * 
       * const { documentId, uploadUrl, verificationId } = uploadResponse.data;
       * 
       * // 2. Submit for automated verification (OCR + validation)
       * const verificationResponse = await verificationApi.submitDocumentVerification({
       *   documentId: documentId,
       *   documentType: 'DRIVING_LICENSE',
       *   driverId: driverId
       * });
       * 
       * // 3. Update driver onboarding status
       * await driverApi.updateOnboardingProgress(driverId, {
       *   step: 'LICENSE_UPLOADED',
       *   status: 'VERIFICATION_PENDING',
       *   documentIds: [documentId]
       * });
       * ```
       * ======================================== */
      
      // DEMO: Save license data to localStorage (REPLACE WITH REAL UPLOAD)
      const licenseInfo = {
        frontImageName: licenseData.frontImage?.name,
        frontImageSize: licenseData.frontImage?.size,
        uploadedAt: new Date().toISOString()
      };
      
      localStorage.setItem('raahi_driver_license_info', JSON.stringify(licenseInfo));
      localStorage.setItem('raahi_driver_onboarding_status', 'profile_photo');
      
      /* ========================================
       * API INTEGRATION: DOCUMENT VERIFICATION SERVICES
       * ========================================
       * Integrate with document verification providers:
       * 
       * Option 1: AWS Textract for OCR
       * ```
       * const ocrResults = await verificationApi.extractTextFromDocument({
       *   documentUrl: uploadUrl,
       *   documentType: 'DRIVING_LICENSE'
       * });
       * 
       * const extractedData = {
       *   licenseNumber: ocrResults.licenseNumber,
       *   expiryDate: ocrResults.expiryDate,
       *   name: ocrResults.holderName,
       *   dateOfBirth: ocrResults.dateOfBirth
       * };
       * ```
       * 
       * Option 2: Third-party verification (Veriff, Jumio, etc.)
       * ```
       * const verificationSession = await verificationApi.createVerificationSession({
       *   driverId: driverId,
       *   documentType: 'DRIVING_LICENSE',
       *   documentUrl: uploadUrl
       * });
       * ```
       * ======================================== */
      
      // Navigate to profile photo screen as next step in onboarding
      updateAppState({
        currentScreen: 'driver-profile-photo'
      });
      
      /* ========================================
       * API INTEGRATION: REAL-TIME NOTIFICATIONS
       * ========================================
       * Set up real-time notifications for verification status:
       * 
       * ```
       * // Subscribe to document verification updates
       * const unsubscribe = notificationApi.subscribeToVerificationUpdates(driverId, (update) => {
       *   if (update.documentType === 'DRIVING_LICENSE') {
       *     if (update.status === 'VERIFIED') {
       *       toast.success("License verified!", {
       *         description: "Your driving license has been approved"
       *       });
       *     } else if (update.status === 'REJECTED') {
       *       toast.error("License verification failed", {
       *         description: update.rejectionReason
       *       });
       *     }
       *   }
       * });
       * ```
       * ======================================== */
      
      toast.success("License uploaded successfully!", {
        description: "Your document is under review. You'll be notified once approved.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error uploading license:", error);
      
      /* ========================================
       * API INTEGRATION: DOCUMENT UPLOAD ERROR HANDLING
       * ========================================
       * Handle different upload errors:
       * 
       * ```
       * if (error.code === 'FILE_TOO_LARGE') {
       *   toast.error("File too large", {
       *     description: "Please upload a file smaller than 10MB"
       *   });
       * } else if (error.code === 'INVALID_FILE_TYPE') {
       *   toast.error("Invalid file type", {
       *     description: "Please upload a PNG, JPG, or PDF file"
       *   });
       * } else if (error.code === 'UPLOAD_QUOTA_EXCEEDED') {
       *   toast.error("Upload limit reached", {
       *     description: "Please try again tomorrow"
       *   });
       * }
       * ```
       * ======================================== */
      
      toast.error("Failed to upload license", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    }
  };

  const handleDriverLicenseUploadBack = () => {
    console.log("⬅️ Back from driver license upload to vehicle selection");
    updateAppState({ currentScreen: 'driver-vehicle-selection' });
  };

  const handleDriverProfilePhotoContinue = async (photoData: { profileImage: File | null }) => {
    console.log("📸 Driver profile photo continue clicked:", photoData);
    
    try {
      /* ========================================
       * API INTEGRATION POINT: PROFILE PHOTO UPLOAD & FACIAL VERIFICATION
       * ========================================
       * Comprehensive profile photo processing pipeline:
       * 
       * ```
       * // 1. Upload profile photo to secure storage
       * const uploadResponse = await documentApi.uploadDocument({
       *   driverId: driverId,
       *   documentType: 'PROFILE_PHOTO',
       *   file: photoData.profileImage,
       *   metadata: {
       *     uploadedAt: new Date().toISOString(),
       *     userAgent: navigator.userAgent,
       *     sessionId: generateSessionId(),
       *     deviceInfo: getDeviceInfo()
       *   }
       * });
       * 
       * const { documentId, photoUrl, faceDetectionScore } = uploadResponse.data;
       * 
       * // 2. Facial verification against government ID
       * const facialVerificationResponse = await verificationApi.verifyFacialMatch({
       *   driverId: driverId,
       *   profilePhotoUrl: photoUrl,
       *   governmentIdPhotoUrl: licensePhotoUrl, // from license upload
       *   verificationProvider: 'AWS_REKOGNITION' // or 'VERIFF', 'JUMIO'
       * });
       * 
       * // 3. Liveness detection to prevent spoofing
       * const livenessCheck = await verificationApi.performLivenessCheck({
       *   photoUrl: photoUrl,
       *   sessionId: uploadResponse.sessionId
       * });
       * 
       * // 4. Background check integration (if required)
       * const backgroundCheckResponse = await verificationApi.initiateBackgroundCheck({
       *   driverId: driverId,
       *   personalInfo: extractedPersonalInfo,
       *   consentGiven: true
       * });
       * ```
       * ======================================== */
      
      // DEMO: Save profile photo data to localStorage (REPLACE WITH REAL UPLOAD)
      const profilePhotoInfo = {
        profileImageName: photoData.profileImage?.name,
        profileImageSize: photoData.profileImage?.size,
        uploadedAt: new Date().toISOString()
      };
      
      localStorage.setItem('raahi_driver_profile_photo_info', JSON.stringify(profilePhotoInfo));
      localStorage.setItem('raahi_driver_onboarding_status', 'photo_confirmation');
      
      /* ========================================
       * API INTEGRATION: ADVANCED VERIFICATION PROVIDERS
       * ========================================
       * 
       * Option 1: AWS Rekognition for facial verification
       * ```
       * const rekognitionResponse = await verificationApi.compareFaces({
       *   sourceImage: profilePhotoUrl,
       *   targetImage: licensePhotoUrl,
       *   similarityThreshold: 85
       * });
       * ```
       * 
       * Option 2: Veriff comprehensive verification
       * ```
       * const veriffSession = await veriffApi.createSession({
       *   verification: {
       *     callback: `${API_BASE_URL}/webhooks/veriff`,
       *     person: {
       *       firstName: driverInfo.firstName,
       *       lastName: driverInfo.lastName,
       *       dateOfBirth: driverInfo.dateOfBirth
       *     },
       *     document: {
       *       number: licenseNumber,
       *       type: 'DRIVER_LICENSE',
       *       country: 'IN'
       *     },
       *     additionalData: {
       *       driverId: driverId
       *     }
       *   }
       * });
       * ```
       * 
       * Option 3: Custom ML pipeline
       * ```
       * const mlVerificationResponse = await verificationApi.runMLVerification({
       *   profilePhoto: photoUrl,
       *   documentPhoto: licensePhotoUrl,
       *   models: ['face_match', 'liveness_detection', 'quality_check']
       * });
       * ```
       * ======================================== */
      
      // Navigate to photo confirmation screen
      updateAppState({
        currentScreen: 'driver-photo-confirmation'
      });
      
      /* ========================================
       * API INTEGRATION: DRIVER STATUS UPDATES
       * ========================================
       * Update driver onboarding progress and status:
       * 
       * ```
       * await driverApi.updateOnboardingStatus(driverId, {
       *   step: 'PROFILE_PHOTO_COMPLETED',
       *   status: 'VERIFICATION_PENDING',
       *   verificationSessionId: verificationResponse.sessionId,
       *   completedAt: new Date().toISOString(),
       *   nextStep: 'DOCUMENT_UPLOAD'
       * });
       * 
       * // Set up webhook listeners for verification results
       * const webhookSubscription = await notificationApi.subscribeToVerificationUpdates(
       *   driverId,
       *   ['FACE_VERIFICATION_COMPLETE', 'BACKGROUND_CHECK_COMPLETE']
       * );
       * ```
       * ======================================== */
      
      toast.success("Profile photo uploaded successfully!", {
        description: "Your photo is being verified. You'll be notified once approved.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      
      /* ========================================
       * API INTEGRATION: VERIFICATION ERROR HANDLING
       * ========================================
       * Handle specific verification errors:
       * 
       * ```
       * if (error.code === 'FACE_NOT_DETECTED') {
       *   toast.error("Face not detected", {
       *     description: "Please ensure your face is clearly visible and try again"
       *   });
       * } else if (error.code === 'POOR_IMAGE_QUALITY') {
       *   toast.error("Image quality too low", {
       *     description: "Please take a clearer photo with better lighting"
       *   });
       * } else if (error.code === 'FACE_MATCH_FAILED') {
       *   toast.error("Face verification failed", {
       *     description: "Photo doesn't match your ID. Please try again"
       *   });
       * } else if (error.code === 'LIVENESS_CHECK_FAILED') {
       *   toast.error("Liveness check failed", {
       *     description: "Please take a live photo, not a screenshot"
       *   });
       * }
       * ```
       * ======================================== */
      
      toast.error("Failed to upload profile photo", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    }
  };

  const handleDriverProfilePhotoBack = () => {
    console.log("⬅️ Back from driver profile photo to license upload");
    updateAppState({ currentScreen: 'driver-license-upload' });
  };

  const handleDriverPhotoConfirmationContinue = async () => {
    console.log("✅ Driver photo confirmation OK clicked");
    
    try {
      // CLEAR any potentially corrupted document data first
      console.log("🧹 Clearing any existing document data before proceeding...");
      localStorage.removeItem('raahi_driver_documents_status');
      localStorage.removeItem('raahi_driver_documents');
      localStorage.removeItem('raahi_driver_documents_uploaded');
      
      // Save photo confirmation status and update onboarding status
      localStorage.setItem('raahi_driver_photo_confirmed', 'true');
      localStorage.setItem('raahi_driver_onboarding_status', 'documents_required');
      
      // Navigate to document upload screen to complete the onboarding
      updateAppState({
        currentScreen: 'driver-document-upload'
      });
      
      toast.success("Profile confirmed!", {
        description: "Now let's upload your documents to complete registration.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error finalizing onboarding:", error);
      toast.error("Something went wrong", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    }
  };

  const handleDriverPhotoConfirmationBack = () => {
    console.log("⬅️ Back from driver photo confirmation to profile photo");
    updateAppState({ currentScreen: 'driver-profile-photo' });
  };



  const handleDriverDocumentUploadNext = async (uploadedDocuments: any) => {
    console.log("➡️ Driver document upload next clicked with documents:", uploadedDocuments);
    
    try {
      /* ========================================
       * API INTEGRATION POINT: BULK DOCUMENT UPLOAD & VERIFICATION
       * ========================================
       * Complete document upload and verification pipeline:
       * 
       * ```
       * // 1. Upload all remaining documents
       * const uploadPromises = Object.entries(uploadedDocuments).map(async ([docType, docData]) => {
       *   if (docData.file) {
       *     return await documentApi.uploadDocument({
       *       driverId: driverId,
       *       documentType: docType.toUpperCase(),
       *       file: docData.file,
       *       metadata: {
       *         uploadedAt: new Date().toISOString(),
       *         originalFileName: docData.fileName
       *       }
       *     });
       *   }
       * });
       * 
       * const uploadResults = await Promise.all(uploadPromises);
       * 
       * // 2. Submit all documents for verification
       * const verificationResponse = await verificationApi.submitBulkVerification({
       *   driverId: driverId,
       *   documents: uploadResults.map(result => ({
       *     documentId: result.documentId,
       *     documentType: result.documentType,
       *     verificationLevel: 'COMPREHENSIVE' // or 'BASIC', 'ENHANCED'
       *   }))
       * });
       * 
       * // 3. Check verification results for any failures
       * if (verificationResponse.status === 'PARTIAL_FAILURE') {
       *   // Some documents failed verification, show failure screen
       *   const failedDocuments = verificationResponse.failedDocuments.map(doc => ({
       *     id: doc.documentType.toLowerCase(),
       *     title: getDocumentTitle(doc.documentType),
       *     reason: doc.failureReason,
       *     description: doc.failureDescription
       *   }));
       *   
       *   updateAppState({
       *     currentScreen: 'driver-document-verification-failure',
       *     failedDocuments: failedDocuments
       *   });
       *   return;
       * }
       * ```
       * ======================================== */
      
      // DEMO: Save document upload completion status (REPLACE WITH REAL API)
      localStorage.setItem('raahi_driver_documents_uploaded', 'true');
      localStorage.setItem('raahi_driver_onboarding_status', 'documents_under_review');
      
      // Set up global callback for success screen navigation
      window.handleDocumentVerificationSuccess = handleDriverDocumentVerificationSuccess;
      
      // Navigate to document verification status screen
      updateAppState({
        currentScreen: 'driver-document-verification'
      });
      
      toast.success("Documents uploaded successfully!", {
        description: "Your documents are now being verified. You can track the progress.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error completing document upload:", error);
      
      toast.error("Something went wrong", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    }
  };

  const handleDriverDocumentUploadBack = () => {
    console.log("⬅️ Back from driver document upload to photo confirmation");
    updateAppState({ currentScreen: 'driver-photo-confirmation' });
  };

  const handleDriverDocumentVerificationSuccess = () => {
    console.log("🎉 Driver document verification completed successfully!");
    
    try {
      // Mark onboarding as completed
      localStorage.setItem('raahi_driver_onboarding_status', 'completed');
      localStorage.setItem('raahi_driver_verification_completed', 'true');
      
      // Navigate to success screen
      updateAppState({
        currentScreen: 'driver-document-verification-success'
      });
      
      toast.success("All documents verified!", {
        description: "Congratulations! You're ready to start earning.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error handling verification success:", error);
    }
  };

  const handleDriverDocumentVerificationBack = () => {
    console.log("⬅️ Back from driver document verification to document upload");
    updateAppState({ currentScreen: 'driver-document-upload' });
  };

  const handleDriverDocumentVerificationSuccessBack = () => {
    console.log("⬅️ Back from driver document verification success to verification screen");
    updateAppState({ currentScreen: 'driver-document-verification' });
  };

  const handleStartEarning = () => {
    console.log("🚀 Start Earning clicked - driver ready to earn!");
    
    try {
      /* ========================================
       * API INTEGRATION POINT: ACTIVATE DRIVER ACCOUNT
       * ========================================
       * Complete driver activation and make them available for rides:
       * 
       * ```
       * await driverApi.activateDriverAccount({
       *   driverId: driverId,
       *   status: 'ACTIVE',
       *   availableForRides: true,
       *   onboardingCompleted: true,
       *   verificationCompleted: true,
       *   activatedAt: new Date().toISOString()
       * });
       * 
       * // Set initial driver location and availability
       * await driverApi.updateDriverStatus({
       *   driverId: driverId,
       *   status: 'AVAILABLE',
       *   location: await getCurrentLocation(),
       *   isOnline: true
       * });
       * 
       * // Send welcome notification
       * await notificationApi.sendWelcomeNotification(driverId);
       * ```
       * ======================================== */
      
      // Update local storage and complete onboarding
      localStorage.setItem('raahi_driver_account_active', 'true');
      localStorage.setItem('raahi_driver_earning_status', 'active');
      localStorage.setItem('raahi_driver_onboarding_status', 'completed');
      
      // Navigate to driver ride selection screen first
      updateAppState({
        currentScreen: 'driver-ride-selection',
        isDriverOnline: false // Start offline, let them go online when ready
      });
      
      toast.success("🎉 You're ready to earn!", {
        description: "Choose your vehicle type and start accepting rides.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error starting earning:", error);
      
      toast.error("Failed to activate account", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    }
  };

  const handleDriverVehicleSelect = (vehicleType: string) => {
    console.log("🚗 Driver selected vehicle type:", vehicleType);
    
    /* ========================================
     * API INTEGRATION POINT: SAVE VEHICLE SELECTION
     * ========================================
     * Save driver's vehicle selection preference:
     * 
     * ```
     * await driverApi.updateDriverVehiclePreference({
     *   driverId: driverId,
     *   selectedVehicleType: vehicleType,
     *   updatedAt: new Date().toISOString()
     * });
     * ```
     * ======================================== */
    
    // Save vehicle selection for session
    localStorage.setItem('raahi_driver_selected_vehicle', vehicleType);
    
    // Navigate to ride selection screen
    updateAppState({
      currentScreen: 'driver-ride-selection',
      // Pass vehicle type through state if needed
    });
    
    toast.success(`${vehicleType} selected!`, {
      description: "Now you can go online and start accepting rides",
      duration: 3000,
    });
  };

  const handleDriverRideSelectionBack = () => {
    console.log("⬅️ Back from driver ride selection");
    
    try {
      // Go back to vehicle selection or dashboard depending on flow
      const hasSelectedVehicle = localStorage.getItem('raahi_driver_selected_vehicle');
      const accountActive = localStorage.getItem('raahi_driver_account_active');
      
      if (hasSelectedVehicle && accountActive === 'true') {
        // If vehicle already selected and account active, go to dashboard
        updateAppState({ 
          currentScreen: 'driver-dashboard',
          isDriverMode: true
        });
      } else if (hasSelectedVehicle) {
        // If vehicle selected but account not active, go to verification success
        updateAppState({ 
          currentScreen: 'driver-document-verification-success',
          isDriverMode: true
        });
      } else {
        // If no vehicle selected, go back to vehicle selection
        updateAppState({ 
          currentScreen: 'driver-vehicle-selection',
          isDriverMode: true
        });
      }
    } catch (error) {
      console.error("Error in driver ride selection back navigation:", error);
      // Fallback to dashboard
      updateAppState({ 
        currentScreen: 'dashboard',
        isDriverMode: false
      });
    }
  };

  const handleDriverAcceptRide = async (rideData: any) => {
    console.log("✅ Driver accepted ride:", rideData);
    
    try {
      /* ========================================
       * API INTEGRATION POINT: START RIDE TRACKING
       * ========================================
       * Start ride tracking and navigation:
       * 
       * ```
       * await rideApi.startRideTracking({
       *   rideId: rideData.rideId,
       *   driverId: driverId,
       *   startedAt: new Date().toISOString()
       * });
       * 
       * // Start navigation to pickup
       * await navigationApi.startNavigation({
       *   driverId: driverId,
       *   destination: rideData.pickupLocation,
       *   rideId: rideData.rideId
       * });
       * ```
       * ======================================== */
      
      // Navigate to driver tracking screen (if exists) or dashboard
      updateAppState({
        currentScreen: 'driver-dashboard', // Replace with driver-tracking if available
        driverData: rideData,
        isDriverMode: true
      });
      
      toast.success("Ride accepted!", {
        description: `Navigate to pickup: ${rideData.pickupLocation}`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error accepting ride:", error);
      toast.error("Failed to accept ride", {
        description: "Please try again",
        duration: 3000,
      });
    }
  };

  // ❌ REMOVED: handleDriverDocumentVerificationFailure - functionality completely removed

  // 🚀 PERFORMANCE: Add loading wrapper for all screens with error boundary
  const renderScreen = useCallback((ScreenComponent: React.ComponentType<any>, props: any) => (
    <Suspense fallback={<ScreenLoader />}>
      <ScreenComponent {...props} />
      <Toaster />
    </Suspense>
  ), []);

  // Show dashboard loading during app initialization
  if (isAppInitializing) {
    console.log("⏳ App initializing - checking user status");
    return renderScreen(DashboardScreen, {
      onFindRide: () => {},
      onOpenDriversApp: () => {},
      onSwitchAccount: () => {},
      userEmail
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
      onBack: handleTermsBack
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

  // Default screen - Dashboard (always shown first)
  console.log("🏠 Rendering Dashboard Screen");
  return renderScreen(DashboardScreen, {
    onFindRide: handleFindRide,
    onOpenDriversApp: handleOpenDriversApp,
    onSwitchAccount: handleSwitchAccount,
    userEmail
  });
}