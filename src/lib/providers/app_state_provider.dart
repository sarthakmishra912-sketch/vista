import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';

class AppStateProvider with ChangeNotifier {
  AppScreen _currentScreen = AppScreen.dashboard;
  bool _isLoggedIn = false;
  String? _loginMethod;
  String? _userPhoneNumber;
  String? _verifiedOTP;
  bool _hasAcceptedTerms = false;
  bool _isFirstTimeUser = true;
  bool _isAppInitializing = true;
  Map<String, dynamic>? _bookingData;
  Map<String, dynamic>? _driverData;
  String? _userEmail;

  // Getters
  AppScreen get currentScreen => _currentScreen;
  bool get isLoggedIn => _isLoggedIn;
  String? get loginMethod => _loginMethod;
  String? get userPhoneNumber => _userPhoneNumber;
  String? get verifiedOTP => _verifiedOTP;
  bool get hasAcceptedTerms => _hasAcceptedTerms;
  bool get isFirstTimeUser => _isFirstTimeUser;
  bool get isAppInitializing => _isAppInitializing;
  Map<String, dynamic>? get bookingData => _bookingData;
  Map<String, dynamic>? get driverData => _driverData;
  String? get userEmail => _userEmail;

  // Initialize app
  Future<void> initializeApp() async {
    debugPrint("🔍 Initializing Raahi app...");
    
    try {
      final prefs = await SharedPreferences.getInstance();
      final hasAccepted = prefs.getBool('raahi_has_accepted_terms') ?? false;
      final savedUserEmail = prefs.getString('raahi_user_email');
      
      _hasAcceptedTerms = hasAccepted;
      _isFirstTimeUser = !hasAccepted;
      _userEmail = savedUserEmail;
      
      debugPrint("🔍 User preferences loaded:");
      debugPrint("  - hasAcceptedTerms: $hasAccepted");
      debugPrint("  - savedUserEmail: $savedUserEmail");
      debugPrint("  - isFirstTimeUser: ${!hasAccepted}");

      // Check if user is already logged in
      if (hasAccepted && savedUserEmail != null) {
        debugPrint("🚀 Auto-login: Returning user detected");
        _isLoggedIn = true;
        _loginMethod = 'auto-login';
      } else {
        debugPrint("👋 New user or not logged in - showing dashboard");
      }
      
      // Always start with dashboard screen
      _currentScreen = AppScreen.dashboard;
      _isAppInitializing = false;
      notifyListeners();
      
    } catch (e) {
      debugPrint("❌ Error initializing app: $e");
      _isAppInitializing = false;
      _currentScreen = AppScreen.dashboard;
      notifyListeners();
    }
  }

  // Login methods
  void login(String method) async {
    debugPrint("🚀 User logged in with: $method");
    _loginMethod = method;
    _isLoggedIn = true;
    
    // Save user email for demo purposes
    const demoEmail = "dhruvsiwach@gmail.com";
    _userEmail = demoEmail;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('raahi_user_email', demoEmail);
    } catch (e) {
      debugPrint("❌ Error saving user email: $e");
    }
    
    // Check if user has already accepted terms
    if (_hasAcceptedTerms) {
      debugPrint("🎯 Returning user - going directly to ride booking");
      _currentScreen = AppScreen.booking;
    } else {
      debugPrint("📱 New user - starting with contact input");
      _currentScreen = AppScreen.contact;
    }
    notifyListeners();
  }

  void logout() async {
    debugPrint("🚪 User logged out");
    _isLoggedIn = false;
    _loginMethod = null;
    _currentScreen = AppScreen.dashboard;
    _userPhoneNumber = null;
    _verifiedOTP = null;
    _bookingData = null;
    _driverData = null;
    _userEmail = null;
    
    // Clear user data but keep terms acceptance
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('raahi_user_email');
    } catch (e) {
      debugPrint("❌ Error clearing user email: $e");
    }
    
    // Don't reset terms acceptance on logout - it persists
    notifyListeners();
  }

  // Navigation methods
  void navigateToScreen(AppScreen screen) {
    debugPrint("🧭 Navigating to: $screen");
    _currentScreen = screen;
    notifyListeners();
  }

  void goToSplash() {
    _currentScreen = AppScreen.splash;
    notifyListeners();
  }

  void goToBooking() {
    _currentScreen = AppScreen.booking;
    notifyListeners();
  }

  void goToBookingLoader() {
    _currentScreen = AppScreen.bookingLoader;
    notifyListeners();
  }

  void goToDriverTracking() {
    _currentScreen = AppScreen.driverTracking;
    notifyListeners();
  }

  void goBackToBooking() {
    _currentScreen = AppScreen.booking;
    _bookingData = null;
    _driverData = null;
    notifyListeners();
  }

  // Contact/OTP flow
  void submitPhoneNumber(String phoneNumber) {
    debugPrint("📱 Phone number submitted: $phoneNumber");
    _userPhoneNumber = phoneNumber;
    _currentScreen = AppScreen.otp;
    notifyListeners();
  }

  void verifyOTP(String otp) {
    debugPrint("✅ OTP verified successfully: $otp");
    debugPrint("🔍 Checking terms status:");
    debugPrint("  - isFirstTimeUser: $_isFirstTimeUser");
    debugPrint("  - hasAcceptedTerms: $_hasAcceptedTerms");
    
    _verifiedOTP = otp;
    
    // Check if user needs to accept terms (first-time user)
    if (_isFirstTimeUser && !_hasAcceptedTerms) {
      debugPrint("📋 First-time user detected - showing terms screen");
      _currentScreen = AppScreen.terms;
    } else {
      debugPrint("🎯 Returning user - going to ride booking");
      _currentScreen = AppScreen.booking;
    }
    notifyListeners();
  }

  // Terms acceptance
  Future<void> acceptTerms() async {
    debugPrint("✅ Terms accepted!");
    
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('raahi_has_accepted_terms', true);
      
      _hasAcceptedTerms = true;
      _isFirstTimeUser = false;
      _currentScreen = AppScreen.booking;
      
      debugPrint("💾 Terms acceptance saved to SharedPreferences");
      debugPrint("🎯 Redirecting to ride booking screen");
      
      notifyListeners();
    } catch (e) {
      debugPrint("❌ Error saving terms acceptance: $e");
      // Still proceed to booking even if save fails
      _hasAcceptedTerms = true;
      _isFirstTimeUser = false;
      _currentScreen = AppScreen.booking;
      notifyListeners();
    }
  }

  // Ride booking flow
  void bookRide(Map<String, dynamic> rideData) {
    debugPrint("🚗 Ride booked with data: $rideData");
    _bookingData = rideData;
    _currentScreen = AppScreen.bookingLoader;
    notifyListeners();
  }

  void driverFound(Map<String, dynamic> foundDriverData) {
    debugPrint("👨‍✈️ Driver found: $foundDriverData");
    _driverData = foundDriverData;
    _currentScreen = AppScreen.driverTracking;
    notifyListeners();
  }

  void cancelTripAndGoToBooking() {
    debugPrint("❌ Trip cancelled, returning to booking");
    _currentScreen = AppScreen.booking;
    _bookingData = null;
    _driverData = null;
    notifyListeners();
  }

  void completeTripAndGoToBooking() {
    debugPrint("✅ Trip completed, returning to booking");
    _currentScreen = AppScreen.booking;
    _bookingData = null;
    _driverData = null;
    notifyListeners();
  }

  // Utility methods
  void clearBookingData() {
    _bookingData = null;
    _driverData = null;
    notifyListeners();
  }

  void setBookingData(Map<String, dynamic> data) {
    _bookingData = data;
    notifyListeners();
  }

  void setDriverData(Map<String, dynamic> data) {
    _driverData = data;
    notifyListeners();
  }

  // Dashboard specific methods
  void handleFindRide() {
    debugPrint("🚗 Find ride clicked from dashboard");
    
    // Check if user is logged in
    if (_isLoggedIn) {
      debugPrint("✅ User is logged in - going to ride booking");
      _currentScreen = AppScreen.booking;
    } else {
      debugPrint("❌ User not logged in - showing login screen");
      _currentScreen = AppScreen.login;
      showMessage("Please log in to book a ride");
    }
    notifyListeners();
  }

  void showMessage(String message) {
    debugPrint("📢 Message: $message");
    // In a real app, this would show a toast or snackbar
    // For now, we'll just log it
  }

  void goBackToDashboard() {
    debugPrint("⬅️ Back to dashboard");
    _currentScreen = AppScreen.dashboard;
    notifyListeners();
  }

  void cancelTripAndGoToDashboard() {
    debugPrint("❌ Trip cancelled, returning to dashboard");
    _currentScreen = AppScreen.dashboard;
    _bookingData = null;
    _driverData = null;
    notifyListeners();
  }

  void completeTripAndGoToDashboard() {
    debugPrint("✅ Trip completed, returning to dashboard");
    _currentScreen = AppScreen.dashboard;
    _bookingData = null;
    _driverData = null;
    notifyListeners();
  }
}