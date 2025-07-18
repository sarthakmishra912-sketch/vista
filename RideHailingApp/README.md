# RideApp - Ride Hailing Application

A modern ride-hailing application built with React Native (Expo) and Supabase, featuring a beautiful UI and comprehensive ride management system.

## Features

### 🚗 Core Features
- **User Authentication**: Sign up/sign in with email and password
- **User Types**: Support for both riders and drivers
- **Interactive Maps**: Real-time location tracking and route visualization
- **Ride Booking**: Book rides with different vehicle types (Economy, Comfort, Premium, XL)
- **Ride History**: View past rides with detailed information
- **Rating System**: Rate completed rides
- **Real-time Updates**: Live ride status updates
- **Payment Integration**: Support for multiple payment methods

### 🎨 UI/UX Features
- **Modern Design**: Clean, intuitive interface with beautiful animations
- **Dark/Light Mode Support**: Adaptive design (ready for implementation)
- **Responsive Layout**: Works seamlessly on different screen sizes
- **Accessibility**: Built with accessibility best practices
- **Smooth Navigation**: Fluid transitions between screens

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Offline Support**: Works with limited connectivity
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance Optimized**: Fast loading and smooth interactions
- **Secure**: Authentication and data protection with Supabase

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Supabase Account** (free tier available)
- **Google Maps API Key** (for maps functionality)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd RideHailingApp
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy the SQL schema below and run it in the Supabase SQL editor

### 3. Configure Environment Variables

Update the `.env` file with your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Run the Application

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Supabase Database Schema

Run this SQL in your Supabase SQL editor to set up the database:

```sql
-- Enable the uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type AS ENUM ('rider', 'driver');
CREATE TYPE ride_status AS ENUM ('requested', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled');
CREATE TYPE vehicle_type AS ENUM ('economy', 'comfort', 'premium', 'xl');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'digital_wallet');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  user_type user_type NOT NULL DEFAULT 'rider',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle information
CREATE TABLE vehicle_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR NOT NULL,
  license_plate VARCHAR NOT NULL UNIQUE,
  vehicle_type vehicle_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers table (extends users for drivers)
CREATE TABLE drivers (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  vehicle_info_id UUID REFERENCES vehicle_info(id),
  license_number VARCHAR NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT FALSE,
  current_location JSONB, -- {latitude: number, longitude: number, address?: string}
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rides table
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES users(id),
  driver_id UUID REFERENCES drivers(id),
  pickup_location JSONB NOT NULL, -- {latitude: number, longitude: number, address?: string, name?: string}
  destination_location JSONB NOT NULL, -- {latitude: number, longitude: number, address?: string, name?: string}
  status ride_status NOT NULL DEFAULT 'requested',
  fare DECIMAL(10,2) NOT NULL,
  distance DECIMAL(10,2) NOT NULL, -- in kilometers
  estimated_duration INTEGER NOT NULL, -- in minutes
  ride_type vehicle_type NOT NULL,
  payment_method payment_method NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved places for users
CREATE TABLE saved_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  place_type VARCHAR DEFAULT 'custom', -- 'home', 'work', 'custom'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods for users
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type payment_method NOT NULL,
  last_four VARCHAR(4),
  is_default BOOLEAN DEFAULT FALSE,
  metadata JSONB, -- Store payment provider specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ride ratings and reviews
CREATE TABLE ride_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_rides_rider_id ON rides(rider_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created_at ON rides(created_at);
CREATE INDEX idx_drivers_is_available ON drivers(is_available);
CREATE INDEX idx_drivers_location ON drivers USING GIN(current_location);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_reviews ENABLE ROW LEVEL SECURITY;

-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Drivers can view their own data and riders can view assigned drivers
CREATE POLICY "Drivers can view own data" ON drivers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Drivers can update own data" ON drivers FOR UPDATE USING (auth.uid() = id);

-- Rides policies
CREATE POLICY "Users can view own rides" ON rides FOR SELECT USING (
  auth.uid() = rider_id OR auth.uid() = driver_id
);
CREATE POLICY "Riders can create rides" ON rides FOR INSERT WITH CHECK (auth.uid() = rider_id);
CREATE POLICY "Drivers can update assigned rides" ON rides FOR UPDATE USING (auth.uid() = driver_id);

-- Saved places policies
CREATE POLICY "Users can manage own saved places" ON saved_places FOR ALL USING (auth.uid() = user_id);

-- Payment methods policies
CREATE POLICY "Users can manage own payment methods" ON payment_methods FOR ALL USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Users can view reviews" ON ride_reviews FOR SELECT USING (
  auth.uid() = reviewer_id OR auth.uid() = reviewee_id
);
CREATE POLICY "Users can create reviews" ON ride_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Project Structure

```
RideHailingApp/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── auth/          # Authentication screens
│   │   └── main/          # Main app screens
│   ├── services/          # API and external services
│   │   ├── supabase.ts    # Supabase client configuration
│   │   └── rideService.ts # Ride management functions
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── assets/                # Images, fonts, etc.
├── .env                   # Environment variables
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── README.md             # This file
```

## Key Technologies

- **React Native** (via Expo) - Cross-platform mobile development
- **TypeScript** - Type safety and better developer experience
- **Supabase** - Backend as a Service (authentication, database, real-time)
- **React Navigation** - Navigation between screens
- **React Native Maps** - Interactive maps and location services
- **Expo Location** - Device location services
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch gesture handling

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run eject` - Eject from Expo (not recommended)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@rideapp.com or join our Slack channel.

## Roadmap

- [ ] Real-time driver tracking
- [ ] Push notifications
- [ ] In-app messaging between riders and drivers
- [ ] Advanced payment integrations (Stripe, PayPal)
- [ ] Driver earnings dashboard
- [ ] Admin panel for ride management
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline mode improvements
- [ ] Advanced analytics and reporting

---

Built with ❤️ using React Native and Supabase