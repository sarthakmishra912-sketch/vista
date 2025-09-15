# Raahi - Butter to your जाम 🚗

A complete cab booking Flutter application with authentic Raahi branding and seamless user experience.

![Raahi App](https://img.shields.io/badge/Flutter-3.0+-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

## 📱 About Raahi

Raahi is a comprehensive cab booking application built with Flutter, featuring:
- **3 Authentication Methods**: Truecaller OTP, Google Sign-In, Mobile OTP
- **Complete Ride Journey**: From booking to completion with real-time tracking
- **Authentic Branding**: Custom Raahi colors, fonts, and immersive mobile UI
- **State Management**: Provider pattern for robust app state handling
- **Persistent Storage**: SharedPreferences for user preferences

## 🚀 Quick Start

### Prerequisites

Before running the Flutter app, ensure you have:

- **Flutter SDK**: 3.0.0 or higher
- **Dart**: 3.0.0 or higher
- **Android Studio** or **VS Code** with Flutter extensions
- **iOS**: Xcode 14+ (for iOS development)
- **Android**: Android SDK 21+ (API level 21)

### Installation

1. **Clone or extract the project files**
   ```bash
   # If you have git access to this project
   git clone <repository-url>
   cd raahi-flutter-app
   ```

2. **Install Flutter dependencies**
   ```bash
   flutter pub get
   ```

3. **Verify Flutter installation**
   ```bash
   flutter doctor
   ```
   Ensure all checkmarks are green for your target platforms.

4. **Run the app**
   ```bash
   # For debug mode
   flutter run
   
   # For specific device
   flutter run -d <device-id>
   
   # For release mode
   flutter run --release
   ```

## 📦 Dependencies

### Core Dependencies
```yaml
# State Management
provider: ^6.1.1

# Local Storage  
shared_preferences: ^2.2.2
flutter_secure_storage: ^9.0.0

# HTTP & Networking
http: ^1.1.0
dio: ^5.4.0

# UI Components
pin_code_fields: ^8.0.1
country_code_picker: ^3.0.0

# Location & Maps
geolocator: ^10.1.0
geocoding: ^2.1.1
permission_handler: ^11.1.0

# Communication
url_launcher: ^6.2.2

# Utilities
intl: ^0.19.0
uuid: ^4.2.1
```

## 🏗️ Project Structure

```
lib/
├── main.dart                 # App entry point
├── providers/
│   ├── app_state_provider.dart    # Global app state management
│   └── ride_provider.dart         # Ride booking state management
├── screens/
│   ├── login_screen.dart          # Authentication screen
│   ├── splash_screen.dart         # Find a Trip screen
│   ├── contact_number_screen.dart # Phone input screen
│   ├── otp_verification_screen.dart # OTP verification
│   ├── terms_screen.dart          # Terms & conditions
│   ├── ride_booking_screen.dart   # Vehicle selection & booking
│   ├── booking_loader_screen.dart # Driver search animation
│   └── driver_tracking_screen.dart # Real-time driver tracking
└── utils/
    ├── raahi_colors.dart          # Brand color definitions
    └── app_theme.dart             # Material theme configuration
```

## 🎨 Raahi Branding

### Color Palette
```dart
class RaahiColors {
  static const textPrimary = Color(0xFF11211e);      // Main text
  static const backgroundPrimary = Color(0xFFF6EFD8); // Background
  static const buttonPrimary = Color(0xFFcf923d);     // Buttons
  static const tagline = Color(0xFFc3aa85);           // Tagline
  // ... additional colors
}
```

### Custom Fonts
- **Samarkan**: Main logo and branding
- **Poppins**: Primary UI text (Regular, Medium, SemiBold, Bold)
- **Kite One**: Tagline accent
- **Abhaya Libre**: Hindi text support

## 📱 Features Implementation

### Authentication Flow
```dart
// Login methods available
- Truecaller OTP (SDK integration ready)
- Google Sign-In (OAuth 2.0 ready)
- Mobile OTP (SMS gateway integration ready)
```

### State Management
```dart
// Global app state
context.read<AppStateProvider>().login('truecaller');
context.read<AppStateProvider>().navigateToScreen(AppScreen.booking);

// Ride booking state
context.read<RideProvider>().selectVehicle('raahi-mini');
context.read<RideProvider>().setPickupLocation('Location');
```

### Screen Navigation
```dart
AppScreen.login → AppScreen.contact → AppScreen.otp → 
AppScreen.terms (first-time) → AppScreen.booking → 
AppScreen.bookingLoader → AppScreen.driverTracking
```

## 🔧 Development Setup

### VS Code Extensions (Recommended)
- Flutter
- Dart
- Flutter Widget Snippets
- Awesome Flutter Snippets

### Android Development
1. **Install Android Studio**
2. **Set up Android SDK** (API level 21+)
3. **Create AVD** (Android Virtual Device)
4. **Enable USB Debugging** on physical device

### iOS Development (macOS only)
1. **Install Xcode** (14+)
2. **Set up iOS Simulator**
3. **Configure Apple Developer Account** (for device testing)
4. **Install CocoaPods**
   ```bash
   sudo gem install cocoapods
   cd ios && pod install
   ```

## 🚀 Building for Production

### Android APK
```bash
# Build debug APK
flutter build apk --debug

# Build release APK  
flutter build apk --release

# Build App Bundle (recommended for Play Store)
flutter build appbundle --release
```

### iOS IPA
```bash
# Build for iOS device
flutter build ios --release

# Open in Xcode for App Store upload
open ios/Runner.xcworkspace
```

## 🔗 API Integration

The app is designed with API integration in mind. All network calls are documented with comments:

### Authentication APIs
```dart
// Truecaller verification
POST /api/auth/truecaller-verify
{ phone: string, truecaller_token: string }

// Google Sign-In verification  
POST /api/auth/google-verify
{ id_token: string, access_token: string }

// Mobile OTP
POST /api/auth/send-otp
{ phone: string, country_code: string }
```

### Ride Booking APIs
```dart
// Driver search
POST /api/rides/search
{ pickup_lat: number, pickup_lng: number, vehicle_type: string }

// Real-time tracking
WebSocket: ws://your-api.com/rides/{ride_id}/track
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
flutter test

# Integration tests
flutter test integration_test/

# Widget tests
flutter test test/widget_test.dart
```

### Debug Tools
```bash
# Flutter Inspector
flutter run --dart-define=FLUTTER_WEB_USE_SKIA=true

# Performance profiling
flutter run --profile

# Debug with DevTools
flutter pub global activate devtools
flutter pub global run devtools
```

## 🔒 Security Considerations

### Secure Storage
```dart
// Sensitive data storage
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const storage = FlutterSecureStorage();
await storage.write(key: 'auth_token', value: token);
```

### API Security
- Use HTTPS endpoints only
- Implement certificate pinning
- Add API key protection
- Implement rate limiting

## 📋 Environment Configuration

### Development
```dart
// lib/config/app_config.dart
class AppConfig {
  static const String baseUrl = 'https://dev-api.raahi.com';
  static const String googleClientId = 'your-dev-client-id';
  static const String truecallerAppKey = 'your-dev-truecaller-key';
}
```

### Production
```dart
class AppConfig {
  static const String baseUrl = 'https://api.raahi.com';
  static const String googleClientId = 'your-prod-client-id';
  static const String truecallerAppKey = 'your-prod-truecaller-key';
}
```

## 🐛 Troubleshooting

### Common Issues

**1. Flutter Doctor Issues**
```bash
flutter doctor --verbose
flutter clean && flutter pub get
```

**2. Android Build Issues**
```bash
cd android && ./gradlew clean
flutter clean && flutter pub get
```

**3. iOS Build Issues**
```bash
cd ios && rm -rf Pods Podfile.lock
pod install
flutter clean && flutter pub get
```

**4. Package Conflicts**
```bash
flutter pub deps
flutter pub upgrade
```

## 📈 Performance Optimization

### Build Optimization
```bash
# Enable obfuscation for release builds
flutter build apk --release --obfuscate --split-debug-info=debug-info/

# Optimize bundle size
flutter build appbundle --release --tree-shake-icons
```

### Runtime Optimization
- Use `const` constructors where possible
- Implement lazy loading for screens
- Optimize image assets with proper sizing
- Use `ListView.builder` for large lists

## 🤝 Contributing

### Code Style
```bash
# Format code
flutter format .

# Analyze code
flutter analyze

# Check for unused dependencies
flutter pub deps
```

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Flutter Documentation](https://docs.flutter.dev/)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Provider Package](https://pub.dev/packages/provider)

### Issues & Questions
For technical issues or questions about the Raahi Flutter app:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include device information and error logs

---

**Built with ❤️ in Delhi, NCR using Flutter**

*Raahi - Making every journey smooth as butter!* 🧈✨