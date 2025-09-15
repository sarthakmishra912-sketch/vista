import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state_provider.dart';
import '../constants.dart';
import 'dashboard_screen.dart';
import 'login_screen.dart';
import 'contact_number_screen.dart';
import 'otp_verification_screen.dart';
import 'terms_screen.dart';
import 'ride_booking_screen.dart';
import 'booking_loader_screen.dart';
import 'driver_tracking_screen.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  @override
  void initState() {
    super.initState();
    // Initialize app state
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AppStateProvider>().initializeApp();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppStateProvider>(
      builder: (context, appState, child) {
        // Show dashboard loading during app initialization
        if (appState.isAppInitializing) {
          debugPrint("⏳ App initializing - showing dashboard");
          return const DashboardScreen();
        }

        // Main screen routing based on current screen
        switch (appState.currentScreen) {
          case AppScreen.dashboard:
            debugPrint("🏠 Rendering Dashboard Screen");
            return const DashboardScreen();
            
          case AppScreen.login:
            debugPrint("🔐 Rendering Login Screen");
            return const LoginScreen();
            
          case AppScreen.contact:
            debugPrint("📱 Rendering Contact Screen");
            return const ContactNumberScreen();
            
          case AppScreen.otp:
            debugPrint("🔢 Rendering OTP Screen");
            return const OTPVerificationScreen();
            
          case AppScreen.terms:
            debugPrint("📋 Rendering Terms Screen");
            return const TermsScreen();
            
          case AppScreen.booking:
            debugPrint("🚗 Rendering Ride Booking Screen");
            return const RideBookingScreen();
            
          case AppScreen.bookingLoader:
            debugPrint("🔄 Rendering Booking Loader Screen");
            return const BookingLoaderScreen();
            
          case AppScreen.driverTracking:
            debugPrint("🗺️ Rendering Driver Tracking Screen");
            return const DriverTrackingScreen();
            
          default:
            debugPrint("🏠 Default - Rendering Dashboard Screen");
            return const DashboardScreen();
        }
      },
    );
  }
}