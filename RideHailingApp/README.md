# 🚗 Ride Hailing App

A modern ride-hailing application built with React Native (Expo) and PostgreSQL, featuring a beautiful UI, comprehensive ride management system, and real-time tracking.

## ✨ Features

### 🔐 Authentication & User Management
- **OTP-based Phone Authentication** with SMS verification (industry standard)
- **Secure JWT Token Management** with database session storage
- **Dual User Types**: Riders and Drivers with separate interfaces
- **Profile Management** with avatar upload support
- **Rate Limiting and Fraud Prevention** with attempt tracking

### 🚕 Ride Management
- **Ride Booking System** with multiple vehicle types (Economy, Comfort, Premium, XL)
- **Real-time Driver Tracking** with live location updates
- **Fare Calculation** based on distance and ride type
- **Multiple Payment Methods** (Cash, Card, Digital Wallet, Razorpay)
- **Ride History** with detailed information and ratings
- **Automatic Payment Processing** with Razorpay integration

### 📍 Real-time Features
- **Live Driver Location Tracking** via WebSocket
- **Real-time Ride Status Updates**
- **Driver-Rider Communication** through in-app messaging
- **Push Notifications** for ride updates, payment confirmations, and driver notifications
- **ETA Updates** with live traffic consideration
- **Instant Notifications** for ride acceptance, arrivals, and completion

### 🗺️ Maps & Navigation
- **Interactive Maps** powered by Google Maps
- **Route Optimization** with turn-by-turn navigation
- **Pickup/Dropoff Location Selection**
- **Nearby Drivers Display** with real-time positioning

## 🛠️ Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: PostgreSQL with direct connections
- **Real-time**: WebSocket server for live tracking
- **Authentication**: JWT-based session management
- **Maps**: Google Maps API
- **State Management**: React Context API
- **Navigation**: React Navigation v6

## 🚀 Quick Start

### ⚡ Automated Setup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd RideHailingApp

# Run the automated setup script
./scripts/quick-start.sh
```

### 📖 Manual Setup
For detailed setup instructions, see **[SETUP.md](./SETUP.md)**

## 📋 Prerequisites

- **Node.js** (v18.0.0 or higher)
- **PostgreSQL** (v14+ with PostGIS extension)  
- **Redis** (v7.0 or higher)
- **Expo CLI** and **EAS CLI**
- **Mobile development environment** (Xcode/Android Studio)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd RideHailingApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

1. Create a PostgreSQL database named `ridehailing`
2. Update your database credentials in the environment file

### 4. Environment Configuration

Copy `.env.example` to `.env` and update the values:

```env
# Database Configuration
EXPO_PUBLIC_DB_HOST=localhost
EXPO_PUBLIC_DB_PORT=5432
EXPO_PUBLIC_DB_NAME=ridehailing
EXPO_PUBLIC_DB_USER=postgres
EXPO_PUBLIC_DB_PASSWORD=your_password_here

# WebSocket Server Configuration
EXPO_PUBLIC_WS_URL=ws://localhost:8080

# JWT Configuration
EXPO_PUBLIC_JWT_SECRET=your_very_secure_jwt_secret_key_here

# Google Maps API Key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 5. Initialize Database

The app will automatically create the necessary tables on first run. You can also manually run the initialization:

```bash
# Run the app once to initialize the database
npm start
```

### 6. Start the WebSocket Server

```bash
cd websocket-server
npm install
npm start
```

### 7. Start the React Native App

```bash
npm start
```

## 📊 Database Schema

The application uses the following PostgreSQL tables:

- **users** - User accounts (riders and drivers)
- **drivers** - Extended driver information and vehicle details
- **rides** - Ride requests and trip information
- **ride_tracking** - Real-time location tracking data
- **user_sessions** - JWT session management

## 🏗️ Architecture

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   │   ├── auth/          # Authentication screens
│   │   └── main/          # Main app screens
│   ├── navigation/         # Navigation configuration
│   ├── context/           # React Context providers
│   ├── services/          # API and business logic
│   │   ├── database.ts    # PostgreSQL connection and queries
│   │   ├── authService.ts # Authentication service
│   │   ├── rideService.ts # Ride management service
│   │   └── websocketService.ts # Real-time communication
│   ├── hooks/             # Custom React hooks
│   │   └── useRealTimeTracking.ts # Real-time tracking hook
│   └── types/             # TypeScript type definitions
├── websocket-server/       # WebSocket server for real-time features
└── assets/                # Images and static assets
```

## 🔄 Real-time Features

### WebSocket Events

The app supports the following real-time events:

- `driver_location_update` - Live driver location updates
- `ride_status_update` - Ride status changes
- `ride_request` - New ride requests for drivers
- `ride_accepted` - Ride acceptance notifications
- `ride_cancelled` - Ride cancellation notifications
- `ride_message` - In-app messaging between riders and drivers

### Usage Example

```typescript
import { useRealTimeTracking } from '../hooks/useRealTimeTracking';

const RideScreen = ({ rideId }) => {
  const { trackingData, isConnected, startTracking } = useRealTimeTracking(rideId);
  
  useEffect(() => {
    startTracking(rideId);
  }, [rideId]);
  
  return (
    <View>
      {trackingData && (
        <Text>Driver Location: {trackingData.driverLocation}</Text>
      )}
    </View>
  );
};
```

## 🎨 UI/UX Features

- **Modern Design** with clean, intuitive interface
- **Dark/Light Theme Support**
- **Smooth Animations** using React Native Reanimated
- **Responsive Layout** for different screen sizes
- **Accessibility Support** with proper labels and hints

## 🔒 Security Features

- **JWT Token Authentication** with secure storage
- **Password Hashing** using bcrypt
- **SQL Injection Prevention** with parameterized queries
- **Rate Limiting** on API endpoints
- **Encrypted Data Storage** using AsyncStorage

## 🌍 Additional Features

- **Multi-language Support** (easily extendable)
- **Offline Mode** with local data caching
- **Push Notifications** for ride updates
- **Analytics Integration** for usage tracking
- **Driver Verification System**
- **Rating and Review System**

## 📱 Supported Platforms

- **iOS** (iPhone/iPad)
- **Android** (Phone/Tablet)
- **Web** (Progressive Web App)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email support@ridehailingapp.com or join our Slack channel.

---

Built with ❤️ using React Native and PostgreSQL