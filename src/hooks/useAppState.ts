import React, { useState, useEffect, startTransition } from 'react';

interface BookingData {
  selectedVehicle?: any;
  pickupLocation?: string;
  dropLocation?: string;
}

interface DriverData {
  name?: string;
  eta?: string;
  vehicle?: string;
}

type ScreenType = 
  | 'dashboard' 
  | 'login' 
  | 'contact' 
  | 'otp' 
  | 'terms' 
  | 'booking' 
  | 'booking-loader' 
  | 'driver-tracking' 
  | 'driver-signup'
  | 'driver-dashboard'
  | 'driver-login'
  | 'driver-email-collection';

interface AppState {
  isLoggedIn: boolean;
  loginMethod: string | null;
  currentScreen: ScreenType;
  userPhoneNumber: string | null;
  verifiedOTP: string | null;
  hasAcceptedTerms: boolean;
  isFirstTimeUser: boolean;
  isAppInitializing: boolean;
  bookingData: BookingData | null;
  driverData: DriverData | null;
  userEmail: string | null;
  isDriverOnline: boolean;
  isDriverMode: boolean;
}

export default function useAppState() {
  // 🚀 PERFORMANCE: Initialize state with memoized values
  const initialState = React.useMemo<AppState>(() => ({
    isLoggedIn: false,
    loginMethod: null,
    currentScreen: 'dashboard',
    userPhoneNumber: null,
    verifiedOTP: null,
    hasAcceptedTerms: false,
    isFirstTimeUser: true,
    isAppInitializing: true,
    bookingData: null,
    driverData: null,
    userEmail: null,
    isDriverOnline: false,
    isDriverMode: false,
  }), []);

  const [appState, setAppState] = useState<AppState>(initialState);

  // 🚀 PERFORMANCE: Optimized user preferences loading
  useEffect(() => {
    const loadUserPreferences = () => {
      try {
        // Batch localStorage reads to minimize access
        const preferences = {
          terms: localStorage.getItem('raahi_has_accepted_terms'),
          email: localStorage.getItem('raahi_user_email'),
          driverEmail: localStorage.getItem('raahi_driver_email'),
          driverMode: localStorage.getItem('raahi_driver_mode') === 'true'
        };

        const hasAccepted = preferences.terms === 'true';
        const userEmail = preferences.email || preferences.driverEmail;
        
        console.log("🔍 User preferences loaded (optimized)");

        startTransition(() => {
          setAppState(prev => ({
            ...prev,
            hasAcceptedTerms: hasAccepted,
            isFirstTimeUser: !hasAccepted,
            userEmail,
            isLoggedIn: hasAccepted && userEmail ? true : false,
            loginMethod: hasAccepted && userEmail ? 'auto-login' : null,
            isDriverMode: preferences.driverMode,
            currentScreen: 'dashboard',
            isAppInitializing: false,
          }));
        });

      } catch (error) {
        console.error("Error loading user preferences:", error);
        startTransition(() => {
          setAppState(prev => ({
            ...prev,
            isAppInitializing: false,
          }));
        });
      }
    };

    // Defer execution to next tick for better performance
    const timeoutId = setTimeout(loadUserPreferences, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // 🚀 PERFORMANCE: Memoized update function with startTransition
  const updateAppState = React.useCallback((updates: Partial<AppState>) => {
    startTransition(() => {
      setAppState(prev => ({ ...prev, ...updates }));
    });
  }, []);

  return {
    ...appState,
    updateAppState,
  };
}