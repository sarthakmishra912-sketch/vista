import React, { lazy, Suspense, useCallback } from 'react';
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { AuthProvider } from './contexts/AuthContext';
import { PricingProvider } from './contexts/PricingContext';

// Simple fallback components for missing screens
const FallbackScreen = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{name}</h1>
      <p className="text-gray-600 mb-4">This screen is under development</p>
      <button 
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Try to load components, fallback to simple components if they fail
const DashboardScreen = lazy(() => 
  import('./components/DashboardScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Dashboard" /> 
  }))
);

const LoginScreen = lazy(() => 
  import('./screens/LoginScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Login" /> 
  }))
);

const ContactNumberScreen = lazy(() => 
  import('./components/ContactNumberScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Contact Number" /> 
  }))
);

const OTPVerificationScreen = lazy(() => 
  import('./components/OTPVerificationScreen').catch(() => ({ 
    default: () => <FallbackScreen name="OTP Verification" /> 
  }))
);

const TermsScreen = lazy(() => 
  import('./components/TermsScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Terms & Conditions" /> 
  }))
);

const RideBookingScreen = lazy(() => 
  import('./components/RideBookingScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Ride Booking" /> 
  }))
);

const BookingLoaderScreen = lazy(() => 
  import('./components/BookingLoaderScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Booking Loader" /> 
  }))
);

const DriverTrackingScreen = lazy(() => 
  import('./components/DriverTrackingScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Driver Tracking" /> 
  }))
);

const DriverSignupScreen = lazy(() => 
  import('./components/DriverSignupScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Driver Signup" /> 
  }))
);

const DriverDashboardScreen = lazy(() => 
  import('./components/DriverDashboardScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Driver Dashboard" /> 
  }))
);

const DriverLoginScreen = lazy(() => 
  import('./components/DriverLoginScreen').catch(() => ({ 
    default: () => <FallbackScreen name="Driver Login" /> 
  }))
);

// Loading component
const ScreenLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#F6EFD8]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-[#CF923D] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#11211E] font-medium">Loading...</p>
    </div>
  </div>
);

export default function App() {
  // Simple state management
  const [currentScreen, setCurrentScreen] = React.useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');

  // Handlers
  const handleLogin = useCallback((method: string) => {
    console.log(`🔐 User login with ${method}`);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
    toast.success(`Logged in with ${method}`);
  }, []);

  const handleFindRide = useCallback(() => {
    console.log("🚗 Find ride clicked");
    setCurrentScreen('booking');
  }, []);

  const handleOpenDriversApp = useCallback(() => {
    console.log("🚗 Open drivers app");
    setCurrentScreen('driver-login');
  }, []);

  const handleSwitchAccount = useCallback(() => {
    console.log("🔄 Switch account");
    setIsLoggedIn(false);
    setCurrentScreen('login');
    setUserEmail('');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    console.log("🏠 Back to dashboard");
    setCurrentScreen('dashboard');
  }, []);

  const handleRideBooked = useCallback((rideData: any) => {
    console.log("🚗 Ride booked:", rideData);
    setCurrentScreen('booking-loader');
    toast.success("Ride booked successfully!");
  }, []);

  const handleDriverLogin = useCallback((driverData: any) => {
    console.log("🚗 Driver login:", driverData);
    setIsLoggedIn(true);
    setCurrentScreen('driver-dashboard');
    toast.success("Driver logged in successfully!");
  }, []);

  const handleDriverSignup = useCallback((signupData: any) => {
    console.log("🚗 Driver signup:", signupData);
    setCurrentScreen('driver-email-collection');
  }, []);

  const handleBackToLogin = useCallback(() => {
    console.log("🔐 Back to login");
    setCurrentScreen('login');
  }, []);

  // Render screen wrapper
  const renderScreen = useCallback((ScreenComponent: React.ComponentType<any>, props: any) => (
    <Suspense fallback={<ScreenLoader />}>
      <ScreenComponent {...props} />
    </Suspense>
  ), []);

  // Screen routing
  if (currentScreen === 'driver-login') {
    return renderScreen(DriverLoginScreen, {
      onDriverLogin: handleDriverLogin,
      onBack: handleBackToLogin
    });
  }

  if (currentScreen === 'driver-signup') {
    return renderScreen(DriverSignupScreen, {
      onContinue: handleDriverSignup,
      onBack: handleBackToLogin
    });
  }

  if (currentScreen === 'driver-dashboard') {
    return renderScreen(DriverDashboardScreen, {
      onBack: handleBackToDashboard,
      userEmail
    });
  }

  if (currentScreen === 'booking') {
    return renderScreen(RideBookingScreen, {
      onRideBooked: handleRideBooked,
      onBack: handleBackToDashboard
    });
  }

  if (currentScreen === 'booking-loader') {
    return renderScreen(BookingLoaderScreen, {
      onBack: handleBackToDashboard
    });
  }

  if (currentScreen === 'driver-tracking') {
    return renderScreen(DriverTrackingScreen, {
      onBack: handleBackToDashboard
    });
  }

  if (currentScreen === 'contact') {
    return renderScreen(ContactNumberScreen, {
      onSubmit: (phone: string) => {
        console.log("📱 Contact submitted:", phone);
        setCurrentScreen('otp');
      },
      onBack: handleBackToLogin
    });
  }

  if (currentScreen === 'otp') {
    return renderScreen(OTPVerificationScreen, {
      onVerify: (otp: string) => {
        console.log("🔢 OTP verified:", otp);
        setCurrentScreen('terms');
      },
      onBack: () => setCurrentScreen('contact'),
      onResend: () => toast.info("OTP resent to your phone")
    });
  }

  if (currentScreen === 'terms') {
    return renderScreen(TermsScreen, {
      onAccept: () => {
        console.log("📋 Terms accepted");
        setCurrentScreen('dashboard');
        setIsLoggedIn(true);
      },
      onBack: handleBackToLogin
    });
  }

  if (currentScreen === 'login') {
    return renderScreen(LoginScreen, {
      onLogin: handleLogin
    });
  }

  // Default screen - Dashboard
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


