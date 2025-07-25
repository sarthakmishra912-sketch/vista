# 📱 Ride Hailing Mobile App

A React Native/Expo mobile application for riders and drivers.

## **🚀 Quick Start**

### **Prerequisites**
- Node.js 16+
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your phone

### **Installation**
```bash
# Clone and install
git clone <repository-url>
cd ride-hailing-mobile
npm install --legacy-peer-deps --ignore-scripts
```

### **Backend Setup**
This mobile app requires the backend API to be running:

```bash
# Option 1: Run backend locally
git clone <backend-repository-url>
cd ride-hailing-backend
npm install
npm run start:simple

# Option 2: Use remote backend
# Configure EXPO_PUBLIC_API_URL in .env
```

### **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit .env file
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### **Running the App**

#### **Mobile Testing (Recommended)**
```bash
# Start with tunnel for mobile device access
npx expo start --tunnel

# Scan QR code with Expo Go app
# Works from any network/location
```

#### **Local Network Testing**
```bash
# Start on local network
npx expo start

# Use your computer's IP in .env:
# EXPO_PUBLIC_API_URL=http://YOUR_IP:3000/api
```

#### **Web Testing**
```bash
# Start for web browser
npx expo start --web

# Opens in browser at localhost:19006
```

---

## **📱 Platform Support**

### **Mobile Platforms**
- ✅ **iOS** - iPhone/iPad via Expo Go
- ✅ **Android** - Phone/Tablet via Expo Go
- ✅ **Native Performance** - Optimized for mobile

### **Development Platforms**  
- ✅ **Expo Go** - Development builds
- ✅ **iOS Simulator** - Xcode simulator
- ✅ **Android Emulator** - Android Studio
- ✅ **Web Browser** - Development testing

---

## **🗺️ Features**

### **Core Features**
- ✅ **Authentication** - Phone + OTP login
- ✅ **Google Maps** - Real map integration
- ✅ **GPS Tracking** - Live location updates
- ✅ **Ride Booking** - Complete booking flow
- ✅ **Driver Tracking** - Real-time driver location
- ✅ **Route Planning** - Turn-by-turn directions
- ✅ **Fare Calculator** - Dynamic pricing
- ✅ **Payment Integration** - Multiple payment options

### **User Types**
- 🧑‍💼 **Riders** - Book and track rides
- 🚗 **Drivers** - Accept and complete rides
- 🔄 **Toggle Mode** - Switch between rider/driver

### **Real-time Features**
- 📍 **Live Location** - GPS tracking
- 🚗 **Driver Updates** - Real-time driver movement
- 💬 **Notifications** - Ride status updates
- 🔄 **WebSocket** - Live data synchronization

---

## **🔧 Configuration**

### **Environment Variables**

#### **Backend API**
```bash
# Backend server URL
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_WEBSOCKET_URL=ws://localhost:3000
```

#### **Google Maps**
```bash
# Get from Google Cloud Console
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### **Authentication (Optional)**
```bash
EXPO_PUBLIC_JWT_SECRET=your-jwt-secret
```

#### **Payment (Optional)**
```bash
EXPO_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
```

### **Network Configuration**

#### **Tunnel Mode (Best for Mobile)**
```bash
# Use localhost - tunnel handles routing
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Start with tunnel
npx expo start --tunnel
```

#### **Local Network Mode**
```bash
# Use your computer's IP
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api

# Find your IP:
# macOS/Linux: ifconfig | grep inet
# Windows: ipconfig
```

---

## **📋 Backend API Integration**

### **Required Backend Endpoints**
The mobile app expects these API endpoints:

#### **Authentication**
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `GET /api/auth/me`

#### **Users & Drivers**
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/drivers/nearby`
- `POST /api/drivers/status`

#### **Rides**
- `POST /api/rides/request`
- `GET /api/rides/:id`
- `PUT /api/rides/:id/accept`
- `PUT /api/rides/:id/cancel`

### **API Client Configuration**
```typescript
// src/services/apiClient.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Automatically handles:
// - Authentication headers
// - Error handling
// - Network retries
// - Request/response logging
```

---

## **🧭 Navigation Structure**

### **Authentication Flow**
```
┌─ AuthStack ─────────────────┐
│  ├─ PhoneInput              │
│  ├─ OTPVerification         │
│  └─ ProfileSetup            │
└─────────────────────────────┘
```

### **Main App Flow**
```
┌─ MainTabs ──────────────────┐
│  ├─ HomeStack               │
│  │  ├─ MapScreen            │
│  │  ├─ RideRequest          │
│  │  ├─ RideInProgress       │
│  │  └─ RideComplete         │
│  ├─ RidesTab                │
│  ├─ ProfileTab              │
│  └─ DriverTab (conditional) │
└─────────────────────────────┘
```

---

## **🗺️ Maps Integration**

### **Google Maps Setup**
1. **Get API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable Maps SDK for iOS/Android
   - Create API key
   - Add to `.env` file

2. **Required APIs:**
   - Maps SDK for Android
   - Maps SDK for iOS  
   - Directions API
   - Places API
   - Geocoding API

### **Map Features**
- ✅ **Interactive Maps** - Pan, zoom, markers
- ✅ **GPS Location** - User's current location
- ✅ **Route Display** - Turn-by-turn directions
- ✅ **Driver Markers** - Live driver locations
- ✅ **Custom Markers** - Pickup/dropoff points
- ✅ **Traffic Info** - Real-time traffic data

---

## **📱 Mobile-Specific Features**

### **Device APIs**
- 📍 **GPS/Location** - High-accuracy positioning
- 📷 **Camera** - Profile photos, document scanning
- 📞 **Phone** - Direct calling (emergency)
- 🔔 **Push Notifications** - Ride status updates
- 🔧 **Device Info** - Platform, version detection

### **Offline Support**
- 💾 **Local Storage** - User preferences, auth tokens
- 🗺️ **Cached Maps** - Basic offline map support
- 📱 **Offline Mode** - Limited functionality without network

### **Performance Optimizations**
- ⚡ **Fast Startup** - Optimized bundle size
- 🔄 **Smooth Animations** - Native transitions
- 💾 **Memory Management** - Efficient resource usage
- 🔋 **Battery Optimization** - Power-efficient location tracking

---

## **🧪 Testing**

### **Mobile Device Testing**
```bash
# Physical device (recommended)
npx expo start --tunnel
# Scan QR code with Expo Go

# iOS Simulator (macOS only)
npx expo run:ios

# Android Emulator
npx expo run:android
```

### **Web Testing**
```bash
# Web browser testing
npx expo start --web
# Opens at http://localhost:19006
```

### **Component Testing**
```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

---

## **🚀 Build & Deployment**

### **Development Builds**
```bash
# Build for testing
npx expo build:android
npx expo build:ios
```

### **Production Builds**
```bash
# EAS Build (recommended)
npm install -g @expo/eas-cli
eas build --platform all

# App Store deployment
eas submit --platform ios
eas submit --platform android
```

### **OTA Updates**
```bash
# Over-the-air updates
eas update
```

---

## **🛠️ Troubleshooting**

### **Common Issues**

#### **"Network request failed"**
```bash
# Check backend is running
curl http://localhost:3000/health

# Use tunnel mode
npx expo start --tunnel

# Check .env configuration
cat .env
```

#### **"Module not found" errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .expo
npm install --legacy-peer-deps --ignore-scripts
npx expo start --clear
```

#### **Maps not loading**
```bash
# Check Google Maps API key
echo $EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

# Verify API key has required permissions
# - Maps SDK for Android
# - Maps SDK for iOS
```

#### **iOS Pod install errors**
```bash
# Skip iOS scripts (for Expo Go)
npm install --ignore-scripts

# Or clean and reinstall
cd ios && pod install && cd ..
```

---

## **📊 Performance Monitoring**

### **Built-in Analytics**
- 📈 **App Performance** - Startup time, crashes
- 🗺️ **Map Performance** - Rendering, interactions
- 🔗 **API Performance** - Request times, failures
- 👤 **User Analytics** - Feature usage, flows

### **Error Tracking**
- 🚨 **Crash Reporting** - Automatic crash detection
- 🐛 **Error Boundaries** - Graceful error handling
- 📊 **Performance Metrics** - FPS, memory usage

---

## **🏗️ Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── MapView.tsx
│   ├── RideBookingCard.tsx
│   └── UserTypeToggle.tsx
├── screens/            # Screen components
│   ├── auth/
│   ├── home/
│   ├── rides/
│   └── profile/
├── services/           # API and business logic
│   ├── apiClient.ts
│   ├── authService.ts
│   ├── rideService.ts
│   └── mapsService.ts
├── navigation/         # Navigation configuration
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── styles/            # Global styles and themes
```

---

## **🔐 Security**

### **Authentication**
- 🔐 **JWT Tokens** - Secure API authentication
- 📱 **Biometric Auth** - Optional fingerprint/face ID
- 🔒 **Secure Storage** - Encrypted token storage

### **Data Protection**
- 🔐 **API Encryption** - HTTPS/WSS protocols
- 📍 **Location Privacy** - Opt-in location sharing
- 💾 **Local Encryption** - Sensitive data encryption

---

## **📞 Support & Resources**

### **Documentation**
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Google Maps React Native](https://github.com/react-native-maps/react-native-maps)

### **Community**
- [Expo Forums](https://forums.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

---

## **✨ Key Benefits**

### **For Development**
- 🚀 **Fast Development** - Hot reload, live updates
- 📱 **Cross-platform** - iOS & Android from one codebase  
- 🔧 **Easy Setup** - No Xcode/Android Studio required
- 🌐 **Web Support** - Test in browser

### **For Production**
- 📱 **Native Performance** - Real native app experience
- 🔄 **OTA Updates** - Update app without app store
- 📊 **Analytics Built-in** - Performance and usage tracking
- 🚀 **Scalable** - Handles millions of users

**The mobile app is completely independent and can connect to any compatible backend API!** 🚀