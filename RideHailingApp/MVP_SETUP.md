# RideApp MVP Setup Guide

## 🗄️ Database Setup with PostGIS

### 1. Enable PostGIS Extension in Supabase

```sql
-- Enable PostGIS extension for geospatial operations
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verify installation
SELECT PostGIS_Version();
```

### 2. Updated Database Schema with Geospatial Support

```sql
-- Drop existing tables to recreate with PostGIS
DROP TABLE IF EXISTS ride_reviews, rides, drivers, saved_places, payment_methods, vehicle_info, users CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

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

-- Drivers table with PostGIS location
CREATE TABLE drivers (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  vehicle_info_id UUID REFERENCES vehicle_info(id),
  license_number VARCHAR NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT FALSE,
  current_location GEOMETRY(POINT, 4326), -- PostGIS Point with WGS84 coordinate system
  location_updated_at TIMESTAMP WITH TIME ZONE,
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_rides INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rides table with PostGIS locations
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES users(id),
  driver_id UUID REFERENCES drivers(id),
  pickup_location GEOMETRY(POINT, 4326) NOT NULL,
  pickup_address TEXT,
  destination_location GEOMETRY(POINT, 4326) NOT NULL,
  destination_address TEXT,
  status ride_status NOT NULL DEFAULT 'requested',
  fare DECIMAL(10,2) NOT NULL,
  distance DECIMAL(10,3) NOT NULL, -- in kilometers with 3 decimal precision
  estimated_duration INTEGER NOT NULL, -- in minutes
  actual_duration INTEGER, -- actual trip time in minutes
  ride_type vehicle_type NOT NULL,
  payment_method payment_method NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  driver_notes TEXT,
  route_polyline TEXT, -- Encoded polyline for route visualization
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved places with PostGIS
CREATE TABLE saved_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  location GEOMETRY(POINT, 4326) NOT NULL,
  place_type VARCHAR DEFAULT 'custom', -- 'home', 'work', 'custom'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type payment_method NOT NULL,
  last_four VARCHAR(4),
  is_default BOOLEAN DEFAULT FALSE,
  stripe_payment_method_id VARCHAR, -- For Stripe integration
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ride reviews
CREATE TABLE ride_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver location history for analytics
CREATE TABLE driver_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  location GEOMETRY(POINT, 4326) NOT NULL,
  accuracy DECIMAL(8,2), -- GPS accuracy in meters
  speed DECIMAL(5,2), -- Speed in km/h
  heading DECIMAL(5,2), -- Direction in degrees
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ride tracking for real-time updates
CREATE TABLE ride_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id),
  driver_location GEOMETRY(POINT, 4326),
  eta_to_pickup INTEGER, -- ETA in minutes
  eta_to_destination INTEGER, -- ETA in minutes
  distance_to_pickup DECIMAL(8,3), -- Distance in km
  distance_to_destination DECIMAL(8,3), -- Distance in km
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Surge pricing areas
CREATE TABLE surge_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  area GEOMETRY(POLYGON, 4326) NOT NULL,
  multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  is_active BOOLEAN DEFAULT TRUE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial indexes for performance
CREATE INDEX idx_drivers_location ON drivers USING GIST(current_location);
CREATE INDEX idx_rides_pickup_location ON rides USING GIST(pickup_location);
CREATE INDEX idx_rides_destination_location ON rides USING GIST(destination_location);
CREATE INDEX idx_saved_places_location ON saved_places USING GIST(location);
CREATE INDEX idx_driver_locations_location ON driver_locations USING GIST(location);
CREATE INDEX idx_driver_locations_created_at ON driver_locations(created_at);
CREATE INDEX idx_surge_areas_area ON surge_areas USING GIST(area);

-- Create regular indexes
CREATE INDEX idx_rides_rider_id ON rides(rider_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created_at ON rides(created_at);
CREATE INDEX idx_drivers_is_available ON drivers(is_available);
CREATE INDEX idx_drivers_is_verified ON drivers(is_verified);
CREATE INDEX idx_ride_tracking_ride_id ON ride_tracking(ride_id);
CREATE INDEX idx_ride_tracking_created_at ON ride_tracking(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_tracking ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Drivers policies
CREATE POLICY "Drivers can view own data" ON drivers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Drivers can update own data" ON drivers FOR UPDATE USING (auth.uid() = id);

-- Rides policies
CREATE POLICY "Users can view own rides" ON rides FOR SELECT USING (
  auth.uid() = rider_id OR auth.uid() = driver_id
);
CREATE POLICY "Riders can create rides" ON rides FOR INSERT WITH CHECK (auth.uid() = rider_id);
CREATE POLICY "Drivers can update assigned rides" ON rides FOR UPDATE USING (auth.uid() = driver_id);

-- Driver locations policy
CREATE POLICY "Drivers can manage own locations" ON driver_locations FOR ALL USING (auth.uid() = driver_id);

-- Ride tracking policy  
CREATE POLICY "Users can view tracking for their rides" ON ride_tracking FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM rides 
    WHERE rides.id = ride_tracking.ride_id 
    AND (rides.rider_id = auth.uid() OR rides.driver_id = auth.uid())
  )
);

-- Other policies (same as before)
CREATE POLICY "Users can manage own saved places" ON saved_places FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own payment methods" ON payment_methods FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view reviews" ON ride_reviews FOR SELECT USING (
  auth.uid() = reviewer_id OR auth.uid() = reviewee_id
);
CREATE POLICY "Users can create reviews" ON ride_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Helper functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Geospatial utility functions
CREATE OR REPLACE FUNCTION find_nearby_drivers(
  pickup_lat DECIMAL,
  pickup_lng DECIMAL,
  radius_km DECIMAL DEFAULT 10
)
RETURNS TABLE (
  driver_id UUID,
  distance_km DECIMAL,
  location_lat DECIMAL,
  location_lng DECIMAL,
  driver_name TEXT,
  vehicle_info JSONB,
  rating DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    ROUND(
      ST_Distance(
        ST_GeogFromWGS84(d.current_location),
        ST_GeogFromWGS84(ST_MakePoint(pickup_lng, pickup_lat))
      )::DECIMAL / 1000, 2
    ) as distance_km,
    ST_Y(d.current_location) as location_lat,
    ST_X(d.current_location) as location_lng,
    u.name as driver_name,
    to_jsonb(v.*) as vehicle_info,
    d.rating
  FROM drivers d
  JOIN users u ON d.id = u.id
  LEFT JOIN vehicle_info v ON d.vehicle_info_id = v.id
  WHERE d.is_available = true 
    AND d.is_verified = true
    AND d.current_location IS NOT NULL
    AND ST_DWithin(
      ST_GeogFromWGS84(d.current_location),
      ST_GeogFromWGS84(ST_MakePoint(pickup_lng, pickup_lat)),
      radius_km * 1000
    )
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate route distance and duration
CREATE OR REPLACE FUNCTION calculate_route_info(
  pickup_lat DECIMAL,
  pickup_lng DECIMAL,
  dest_lat DECIMAL,
  dest_lng DECIMAL
)
RETURNS TABLE (
  distance_km DECIMAL,
  duration_minutes INTEGER,
  estimated_fare DECIMAL
) AS $$
DECLARE
  base_fare DECIMAL := 5.00;
  per_km_rate DECIMAL := 2.50;
  per_minute_rate DECIMAL := 0.30;
  calculated_distance DECIMAL;
  calculated_duration INTEGER;
BEGIN
  -- Calculate straight-line distance (in real app, use routing service)
  calculated_distance := ROUND(
    ST_Distance(
      ST_GeogFromWGS84(ST_MakePoint(pickup_lng, pickup_lat)),
      ST_GeogFromWGS84(ST_MakePoint(dest_lng, dest_lat))
    )::DECIMAL / 1000, 2
  );
  
  -- Estimate duration (rough calculation, use routing service in production)
  calculated_duration := GREATEST(5, ROUND(calculated_distance * 2.5)::INTEGER);
  
  RETURN QUERY SELECT
    calculated_distance,
    calculated_duration,
    ROUND(base_fare + (calculated_distance * per_km_rate) + (calculated_duration * per_minute_rate), 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update driver location with PostGIS
CREATE OR REPLACE FUNCTION update_driver_location_postgis(
  driver_uuid UUID,
  lat DECIMAL,
  lng DECIMAL,
  accuracy DECIMAL DEFAULT NULL,
  speed DECIMAL DEFAULT NULL,
  heading DECIMAL DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update current location in drivers table
  UPDATE drivers 
  SET 
    current_location = ST_MakePoint(lng, lat),
    location_updated_at = NOW(),
    updated_at = NOW()
  WHERE id = driver_uuid;
  
  -- Insert into location history
  INSERT INTO driver_locations (driver_id, location, accuracy, speed, heading)
  VALUES (driver_uuid, ST_MakePoint(lng, lat), accuracy, speed, heading);
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get surge multiplier for a location
CREATE OR REPLACE FUNCTION get_surge_multiplier(
  lat DECIMAL,
  lng DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  multiplier DECIMAL := 1.00;
BEGIN
  SELECT s.multiplier INTO multiplier
  FROM surge_areas s
  WHERE s.is_active = true
    AND (s.start_time IS NULL OR s.start_time <= NOW())
    AND (s.end_time IS NULL OR s.end_time >= NOW())
    AND ST_Contains(s.area, ST_MakePoint(lng, lat))
  ORDER BY s.multiplier DESC
  LIMIT 1;
  
  RETURN COALESCE(multiplier, 1.00);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔧 Environment Variables for MVP

Update your `.env` file:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Services
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# External APIs for MVP
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
EXPO_PUBLIC_HERE_API_KEY=your_here_api_key_here

# Push Notifications
EXPO_PUBLIC_EXPO_PROJECT_ID=your_expo_project_id
EXPO_PUSH_TOKEN=your_expo_push_token

# App Configuration
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_MIN_IOS_VERSION=13.0
EXPO_PUBLIC_MIN_ANDROID_VERSION=21

# Business Logic
EXPO_PUBLIC_BASE_FARE=5.00
EXPO_PUBLIC_PER_KM_RATE=2.50
EXPO_PUBLIC_PER_MINUTE_RATE=0.30
EXPO_PUBLIC_DRIVER_COMMISSION=0.80
EXPO_PUBLIC_MAX_PICKUP_RADIUS=15
EXPO_PUBLIC_RIDE_TIMEOUT_MINUTES=5
```

## 📱 Additional Dependencies for MVP

```bash
npm install @expo/vector-icons @react-native-async-storage/async-storage expo-notifications expo-device expo-constants @react-native-community/netinfo expo-background-fetch expo-task-manager expo-linking expo-web-browser react-native-animatable react-native-modal react-native-super-grid @react-native-picker/picker react-native-phone-number-input react-native-image-picker expo-image-manipulator expo-file-system expo-sharing expo-print react-native-chart-kit react-native-svg react-native-calendars react-native-ratings @react-native-community/slider
```

## 🚀 MVP Feature Checklist

### Core Features ✅
- [x] User Authentication (Rider/Driver)
- [x] Real-time Location Tracking
- [x] Ride Booking & Matching
- [x] PostGIS Geospatial Queries
- [x] Status Management
- [x] Navigation Integration

### Production Ready Features 🔄
- [ ] Push Notifications
- [ ] Payment Processing (Stripe)
- [ ] Route Optimization
- [ ] Surge Pricing
- [ ] Driver Earnings Dashboard
- [ ] Admin Panel
- [ ] Analytics & Reporting
- [ ] Background Location Tracking
- [ ] Offline Support
- [ ] Performance Monitoring

## 🔔 MVP Deployment Requirements

### 1. Supabase Pro Plan
- PostGIS support
- Real-time subscriptions
- Custom domains
- Enhanced security

### 2. External Services
- **Google Maps Platform**: Maps, Places, Directions API
- **Mapbox** (alternative): Vector maps, navigation
- **Expo Push Notifications**: Real-time alerts
- **Stripe**: Payment processing
- **Sentry**: Error monitoring
- **Analytics**: User behavior tracking

### 3. App Store Requirements
- Privacy policy
- Terms of service
- App icons and screenshots
- App descriptions
- Age ratings
- Permission explanations

## 🏗️ MVP Architecture

```
Frontend (React Native + Expo)
├── Authentication & User Management
├── Real-time Location Services
├── Interactive Maps (Google/Mapbox)
├── Push Notifications
├── Payment Integration
└── Offline Capabilities

Backend (Supabase + PostGIS)
├── PostGIS Geospatial Database
├── Real-time Subscriptions
├── Row Level Security
├── Edge Functions
├── Storage for Images
└── Analytics Data

External Services
├── Google Maps Platform
├── Stripe Payments
├── Expo Push Notifications
├── Route Optimization APIs
└── SMS/Email Services
```

This MVP setup provides all the foundational elements needed for a production-ready ride-hailing app with proper geospatial capabilities using PostGIS!