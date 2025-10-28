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
  | 'mobile-number'
  | 'mobile-otp'
  | 'contact' 
  | 'otp' 
  | 'terms' 
  | 'booking' 
  | 'booking-loader' 
  | 'driver-tracking' 
  | 'driver-signup'
  | 'driver-dashboard'
  | 'driver-login'
  | 'driver-email-collection'
  | 'driver-language-selection'
  | 'driver-earning-setup'
  | 'driver-vehicle-selection'
  | 'driver-ride-selection'
  | 'driver-license-upload'
  | 'driver-profile-photo'
  | 'driver-photo-confirmation'
  | 'driver-document-upload'
  | 'driver-document-verification'
  | 'driver-document-verification-success'
  | 'admin-dashboard';

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
          driverMode: localStorage.getItem('raahi_driver_mode') === 'true',
          lastScreen: localStorage.getItem('raahi_last_screen') as ScreenType | null,
          accessToken: localStorage.getItem('accessToken')
        };

        const hasAccepted = preferences.terms === 'true';
        const userEmail = preferences.email || preferences.driverEmail;
        const hasToken = !!preferences.accessToken;
        
        console.log("🔍 User preferences loaded (optimized)", {
          hasAccepted,
          userEmail,
          driverMode: preferences.driverMode,
          lastScreen: preferences.lastScreen,
          hasToken
        });

        // 🎯 PRODUCTION FIX: Restore last screen if user has valid token
        // This prevents redirecting to landing page on refresh
        let initialScreen: ScreenType = 'dashboard';
        
        if (hasToken) {
          // User has token - restore their last screen
          const isLoginScreen = preferences.lastScreen === 'login' || 
                                preferences.lastScreen === 'mobile-number' || 
                                preferences.lastScreen === 'mobile-otp';
          
          const isAdminScreen = preferences.lastScreen === 'admin-dashboard';
          
          // CRITICAL: If last screen was admin, don't restore it automatically
          // Admin access should require explicit navigation
          if (preferences.lastScreen && !isLoginScreen && !isAdminScreen) {
            initialScreen = preferences.lastScreen;
            console.log("✅ Restoring last screen:", initialScreen);
          } else if (preferences.driverMode) {
            // Driver mode - ALWAYS go to driver dashboard, never admin
            initialScreen = 'driver-dashboard';
            console.log("✅ Driver with token - going to driver dashboard");
          } else {
            // Passenger with token - go to dashboard
            initialScreen = 'dashboard';
            console.log("✅ Passenger with token - going to dashboard");
          }
        } else {
          // No token - always start at landing page
          initialScreen = 'dashboard';
          console.log("✅ No token - starting at landing page");
        }

        startTransition(() => {
          setAppState(prev => ({
            ...prev,
            hasAcceptedTerms: hasAccepted,
            isFirstTimeUser: !hasAccepted,
            userEmail,
            isLoggedIn: false, // Let AuthContext set this
            loginMethod: null,
            isDriverMode: preferences.driverMode,
            currentScreen: initialScreen,
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
      setAppState(prev => {
        const newState = { ...prev, ...updates };
        
        // 🎯 PRODUCTION FIX: Persist current screen to localStorage
        // This allows restoring the screen on page refresh
        if (updates.currentScreen && updates.currentScreen !== prev.currentScreen) {
          // Don't persist admin screens - require explicit navigation
          if (updates.currentScreen !== 'admin-dashboard') {
            localStorage.setItem('raahi_last_screen', updates.currentScreen);
            console.log("💾 Saved last screen:", updates.currentScreen);
          } else {
            console.log("⚠️  Not persisting admin screen - requires explicit access");
          }
        }
        
        // Persist driver mode
        if (updates.isDriverMode !== undefined && updates.isDriverMode !== prev.isDriverMode) {
          localStorage.setItem('raahi_driver_mode', String(updates.isDriverMode));
          console.log("💾 Saved driver mode:", updates.isDriverMode);
        }
        
        return newState;
      });
    });
  }, []);

  return {
    ...appState,
    updateAppState,
  };
}