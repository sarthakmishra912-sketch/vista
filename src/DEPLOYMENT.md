# 🚀 Raahi Flutter App - Deployment Guide

This guide covers deploying the Raahi Flutter app to production environments.

## 📱 Mobile App Deployment

### Android Deployment

#### 1. **Prepare Release Build**
```bash
# Generate key for app signing
keytool -genkey -v -keystore ~/raahi-release-key.keystore -name raahi -keyalg RSA -keysize 2048 -validity 10000

# Build signed APK
flutter build apk --release

# Build signed App Bundle (recommended for Play Store)
flutter build appbundle --release
```

#### 2. **Google Play Store**
```bash
# Create optimized release build
flutter build appbundle --release --obfuscate --split-debug-info=debug-info/

# Upload to Google Play Console
# 1. Create new app in Play Console
# 2. Upload the .aab file from build/app/outputs/bundle/release/
# 3. Complete store listing with Raahi branding
# 4. Set up release management
```

#### 3. **Key Configuration**
```properties
# android/key.properties
storePassword=your-keystore-password
keyPassword=your-key-password  
keyAlias=raahi
storeFile=/path/to/raahi-release-key.keystore
```

### iOS Deployment

#### 1. **Prepare iOS Build**
```bash
# Build for iOS
flutter build ios --release

# Open in Xcode
open ios/Runner.xcworkspace
```

#### 2. **App Store Connect**
```bash
# Prerequisites:
# - Apple Developer Account ($99/year)
# - App Store Connect access
# - Xcode 14+

# Build and Archive in Xcode:
# 1. Select "Any iOS Device" 
# 2. Product → Archive
# 3. Upload to App Store Connect
# 4. Submit for review
```

#### 3. **iOS Configuration**
```xml
<!-- ios/Runner/Info.plist -->
<key>CFBundleDisplayName</key>
<string>Raahi</string>
<key>CFBundleIdentifier</key>
<string>com.raahi.app</string>
<key>CFBundleVersion</key>
<string>1.0.0</string>
```

## ⚙️ Environment Setup

### Production Configuration

#### 1. **API Endpoints**
```dart
// lib/config/prod_config.dart
class ProdConfig {
  static const String baseUrl = 'https://api.raahi.com';
  static const String websocketUrl = 'wss://ws.raahi.com';
  static const String googleMapsApiKey = 'your-prod-maps-key';
}
```

#### 2. **Third-Party Integrations**
```yaml
# pubspec.yaml - Production keys
# Add these as environment variables or secure config

google_sign_in:
  client_id: "your-prod-google-client-id"
  
truecaller_sdk:
  app_key: "your-prod-truecaller-key"
  
razorpay:
  key_id: "your-prod-razorpay-key"
```

### Firebase Setup (Optional)

#### 1. **Firebase Configuration**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase login
firebase init

# Add Firebase config files:
# - android/app/google-services.json
# - ios/Runner/GoogleService-Info.plist
```

#### 2. **Firebase Features**
```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^2.24.2
  firebase_analytics: ^10.7.4
  firebase_crashlytics: ^3.4.8
  firebase_messaging: ^14.7.10
```

## 🔒 Security & Performance

### Code Obfuscation
```bash
# Build with obfuscation
flutter build apk --release --obfuscate --split-debug-info=debug-info/
flutter build appbundle --release --obfuscate --split-debug-info=debug-info/
```

### ProGuard Configuration (Android)
```properties
# android/app/proguard-rules.pro
-keep class com.raahi.** { *; }
-keep class io.flutter.plugins.** { *; }
-keepclassmembers class * {
    @androidx.annotation.Keep *;
}
```

### Certificate Pinning
```dart
// lib/services/http_service.dart
class HttpService {
  static final dio = Dio();
  
  static void initializeCertificatePinning() {
    // Implement certificate pinning for production
    // Pin your API server's SSL certificate
  }
}
```

## 📊 Monitoring & Analytics

### Crash Reporting
```dart
// main.dart
import 'package:firebase_crashlytics/firebase_crashlytics.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Setup Crashlytics
  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterError;
  
  runApp(RaahiApp());
}
```

### Analytics Tracking
```dart
// lib/services/analytics_service.dart
class AnalyticsService {
  static final analytics = FirebaseAnalytics.instance;
  
  static Future<void> logRideBooking(String vehicleType) async {
    await analytics.logEvent(
      name: 'ride_booking',
      parameters: {'vehicle_type': vehicleType},
    );
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy Raahi App

on:
  push:
    branches: [main]

jobs:
  build_android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '11'
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
      - run: flutter pub get
      - run: flutter test
      - run: flutter build apk --release
      
  build_ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter test
      - run: flutter build ios --release --no-codesign
```

### Fastlane Integration
```ruby
# android/fastlane/Fastfile
default_platform(:android)

platform :android do
  desc "Deploy to Play Store"
  lane :deploy do
    gradle(task: "clean bundleRelease")
    upload_to_play_store(
      track: 'production',
      aab: '../build/app/outputs/bundle/release/app-release.aab'
    )
  end
end
```

## 📱 App Store Optimization

### App Store Metadata

#### Google Play Store
```yaml
Title: "Raahi - Cab Booking App"
Short Description: "Butter to your जाम - Premium cab booking"
Full Description: |
  Experience seamless cab booking with Raahi - the premium transportation app 
  that makes every journey smooth as butter!
  
  🚗 Features:
  - Multiple login options (Truecaller, Google, Mobile OTP)
  - Real-time driver tracking
  - Multiple vehicle options
  - Secure payments
  - 24/7 customer support

Keywords: "cab booking, taxi app, ride sharing, transportation, Raahi"
```

#### App Store Connect
```yaml
App Name: "Raahi - Cab Booking"
Subtitle: "Butter to your जाम"
Keywords: "cab,taxi,ride,booking,transportation,raahi"
Description: |
  Raahi brings you the smoothest cab booking experience in Delhi NCR.
  
  KEY FEATURES:
  • Quick booking with multiple vehicle options
  • Real-time driver tracking and ETA
  • Secure payment integration
  • 24/7 customer support
  • Premium ride experience
```

### App Screenshots
```bash
# Required screenshot sizes:
# Android: 
# - Phone: 1080x1920 (minimum)
# - Tablet: 2560x1800

# iOS:
# - iPhone: 1290x2796 (iPhone 14 Pro Max)
# - iPad: 2048x2732 (12.9" iPad Pro)
```

## 🔧 Post-Deployment

### Version Management
```yaml
# pubspec.yaml
version: 1.0.0+1  # version+build_number

# For updates:
version: 1.0.1+2  # Increment version and build number
```

### Rollback Strategy
```bash
# If issues arise, rollback steps:
# 1. Stop release rollout in Play Console
# 2. Upload previous stable version
# 3. Investigate and fix issues
# 4. Re-deploy with fixes
```

### User Feedback Monitoring
```dart
// In-app review prompting
import 'package:in_app_review/in_app_review.dart';

class ReviewService {
  static Future<void> requestReview() async {
    final InAppReview inAppReview = InAppReview.instance;
    if (await inAppReview.isAvailable()) {
      inAppReview.requestReview();
    }
  }
}
```

---

## 📞 Production Support

### Monitoring Checklist
- [ ] App crash rates < 1%
- [ ] Average app startup time < 3 seconds
- [ ] API response times < 2 seconds
- [ ] User retention rates
- [ ] Ride completion rates
- [ ] Payment success rates

### Emergency Response
```dart
// Feature flags for emergency shutdowns
class FeatureFlags {
  static bool get isRideBookingEnabled => true; // Can be controlled remotely
  static bool get isPaymentEnabled => true;
  static bool get isTrackingEnabled => true;
}
```

**📱 Your Flutter app is ready for production deployment!**

*Remember: Always test thoroughly on real devices before releasing to production.*