import React, { lazy, Suspense, useMemo, useCallback, startTransition } from 'react';
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import useAppState from './hooks/useAppState';
import { AuthProvider } from './contexts/AuthContext';
import { PricingProvider } from './contexts/PricingContext';

// Global callback for document verification success
declare global {
  interface Window {
    handleDocumentVerificationSuccess?: () => void;
  }
}

// 🚀 PERFORMANCE OPTIMIZATION: Lazy load all screens with error handling
const LoginScreen = lazy(() => import('./screens/LoginScreen').catch(() => ({ default: () => <div>Login Screen Loading...</div> })));
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

export default function App() {
  const appState = useAppState();
  
  // Guard against undefined state
  if (!appState) {
    return <ScreenLoader />;
  }
  
  const {
    isLoggedIn,
    loginMethod,
    currentScreen,
    userEmail,
    userPhoneNumber,
    isDriverMode,
    isDriverOnline,
    driverData,
    bookingData,
    isAppInitializing
  } = appState;

  const { updateAppState } = appState;

  // 🚀 PERFORMANCE: Memoize handlers to prevent unnecessary re-renders
  const handleLogin = useCallback((method: string) => {
    console.log(`🔐 User login with ${method}`);
    updateAppState({ 
      isLoggedIn: true, 
      loginMethod: method,
      currentScreen: 'dashboard'
    });
  }, [updateAppState]);

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

  const handleTermsAccept = useCallback(() => {
    console.log("📋 Terms accepted");
    updateAppState({ 
      currentScreen: 'dashboard'
    });
  }, [updateAppState]);

  const handleFindRide = useCallback(() => {
    console.log("🚗 Find ride clicked");
    updateAppState({ 
      currentScreen: 'booking'
    });
  }, [updateAppState]);

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
    console.log("❌ Booking cancelled");
    updateAppState({ 
      currentScreen: 'dashboard',
      bookingData: null,
      driverData: null
    });
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

  const handleOpenDriversApp = useCallback(() => {
    console.log("🚗 Open drivers app");
    updateAppState({ 
      currentScreen: 'driver-login',
      isDriverMode: true
    });
  }, [updateAppState]);

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

  const handleDriverEmailCollectionContinue = useCallback((emailData: any) => {
    console.log("📧 Driver email collection continue:", emailData);
    updateAppState({ 
      currentScreen: 'driver-language-selection'
    });
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
      currentScreen: 'driver-ride-selection'
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
      currentScreen: 'driver-ride-selection'
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

  // Default screen - Dashboard (always shown first)
  console.log("🏠 Rendering Dashboard Screen");
  return (
    <AuthProvider>
      <PricingProvider>
        <div className="min-h-screen bg-gray-50">
          <Toaster />
          {renderScreen(DashboardScreen, {
            onFindRide: handleFindRide,
            onOpenDriversApp: handleOpenDriversApp,
            onSwitchAccount: handleSwitchAccount,
            userEmail
          })}
        </div>
      </PricingProvider>
    </AuthProvider>
  );
}