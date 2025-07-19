import { database } from './database';
import { postgisService } from './postgisService';
import { LocationCoordinate } from './mapsService';

export interface Driver {
  id: string;
  name: string;
  lat: number;
  lng: number;
  heading?: number;
  vehicle?: {
    type: string;
    color: string;
    plateNumber: string;
    model?: string;
    year?: number;
  };
  rating?: number;
  eta?: number;
  status: 'available' | 'busy' | 'offline' | 'on_ride';
  phone?: string;
  lastLocationUpdate?: Date;
  totalRides?: number;
  profilePhoto?: string;
  isVerified?: boolean;
  rideType?: string[];
}

export interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  timestamp: Date;
  accuracy?: number;
  speed?: number;
}

export interface DriverAvailability {
  driverId: string;
  status: Driver['status'];
  location?: LocationCoordinate;
  rideTypes: string[];
  lastSeen: Date;
}

class DriverService {
  private readonly LOCATION_UPDATE_INTERVAL = 10000; // 10 seconds
  private readonly MAX_DRIVER_DISTANCE = 10000; // 10km radius
  private readonly ETA_SPEED_KMH = 30; // Average speed for ETA calculation

  /**
   * Find nearby available drivers within a specified radius
   */
  async findNearbyDrivers(
    location: LocationCoordinate,
    radiusMeters: number = this.MAX_DRIVER_DISTANCE,
    rideType?: string
  ): Promise<Driver[]> {
    try {
      console.log(`🔍 Finding drivers near ${location.lat}, ${location.lng} within ${radiusMeters}m`);

      // Use PostGIS to find nearby drivers
      const nearbyDriverLocations = await postgisService.findNearbyDrivers(
        location,
        radiusMeters
      );

      if (nearbyDriverLocations.length === 0) {
        console.log('⚠️ No nearby drivers found, generating mock data for demo');
        return this.generateMockDrivers(location, 5);
      }

      // Get full driver details for each nearby driver
      const drivers: Driver[] = [];
      
      for (const driverLocation of nearbyDriverLocations) {
        try {
          const driverDetails = await this.getDriverById(driverLocation.driverId);
          if (driverDetails && driverDetails.status === 'available') {
            // Calculate ETA based on distance
            const distance = this.calculateDistance(
              location.lat,
              location.lng,
              driverLocation.latitude,
              driverLocation.longitude
            );
            
            const eta = this.calculateETA(distance, driverDetails.vehicle?.type);
            
            // Filter by ride type if specified
            if (rideType && driverDetails.rideType && 
                !driverDetails.rideType.includes(rideType)) {
              continue;
            }

            drivers.push({
              ...driverDetails,
              lat: driverLocation.latitude,
              lng: driverLocation.longitude,
              heading: driverLocation.heading,
              eta,
            });
          }
        } catch (error) {
          console.error(`Error fetching driver ${driverLocation.driverId}:`, error);
        }
      }

      // If we don't have enough real drivers, supplement with mock data
      if (drivers.length < 3) {
        const mockDrivers = this.generateMockDrivers(location, 5 - drivers.length);
        drivers.push(...mockDrivers);
      }

      // Sort by ETA (closest first)
      drivers.sort((a, b) => (a.eta || 0) - (b.eta || 0));

      console.log(`✅ Found ${drivers.length} nearby drivers`);
      return drivers;

    } catch (error) {
      console.error('❌ Error finding nearby drivers:', error);
      // Fallback to mock data in case of error
      return this.generateMockDrivers(location, 5);
    }
  }

  /**
   * Get driver details by ID
   */
  async getDriverById(driverId: string): Promise<Driver | null> {
    try {
      const query = `
        SELECT 
          d.id,
          d.name,
          d.phone,
          d.rating,
          d.status,
          d.total_rides,
          d.profile_photo,
          d.is_verified,
          d.created_at,
          v.type as vehicle_type,
          v.color as vehicle_color,
          v.plate_number,
          v.model as vehicle_model,
          v.year as vehicle_year,
          ARRAY_AGG(rt.ride_type) as ride_types
        FROM drivers d
        LEFT JOIN vehicles v ON d.id = v.driver_id
        LEFT JOIN driver_ride_types rt ON d.id = rt.driver_id
        WHERE d.id = $1
        GROUP BY d.id, v.type, v.color, v.plate_number, v.model, v.year
      `;

      const result = await database.query(query, [driverId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      
      return {
        id: row.id,
        name: row.name,
        lat: 0, // Will be set from location data
        lng: 0, // Will be set from location data
        phone: row.phone,
        rating: parseFloat(row.rating) || 0,
        status: row.status,
        totalRides: parseInt(row.total_rides) || 0,
        profilePhoto: row.profile_photo,
        isVerified: row.is_verified || false,
        vehicle: row.vehicle_type ? {
          type: row.vehicle_type,
          color: row.vehicle_color,
          plateNumber: row.plate_number,
          model: row.vehicle_model,
          year: row.vehicle_year,
        } : undefined,
        rideType: row.ride_types?.filter(Boolean) || ['economy'],
      };

    } catch (error) {
      console.error('Error fetching driver by ID:', error);
      return null;
    }
  }

  /**
   * Update driver location in real-time
   */
  async updateDriverLocation(
    driverId: string,
    location: LocationCoordinate,
    heading?: number,
    speed?: number
  ): Promise<void> {
    try {
      await postgisService.updateDriverLocation(driverId, location, heading);
      
      // Also update in driver_locations table for history
      const query = `
        INSERT INTO driver_locations (driver_id, latitude, longitude, heading, speed, timestamp)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (driver_id) 
        DO UPDATE SET 
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          heading = EXCLUDED.heading,
          speed = EXCLUDED.speed,
          timestamp = EXCLUDED.timestamp
      `;

      await database.query(query, [
        driverId,
        location.lat,
        location.lng,
        heading || null,
        speed || null,
      ]);

    } catch (error) {
      console.error('Error updating driver location:', error);
      throw error;
    }
  }

  /**
   * Get driver's current location
   */
  async getDriverLocation(driverId: string): Promise<DriverLocation | null> {
    try {
      const query = `
        SELECT driver_id, latitude, longitude, heading, speed, timestamp
        FROM driver_locations
        WHERE driver_id = $1
        ORDER BY timestamp DESC
        LIMIT 1
      `;

      const result = await database.query(query, [driverId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        driverId: row.driver_id,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        heading: row.heading ? parseFloat(row.heading) : undefined,
        speed: row.speed ? parseFloat(row.speed) : undefined,
        timestamp: new Date(row.timestamp),
      };

    } catch (error) {
      console.error('Error getting driver location:', error);
      return null;
    }
  }

  /**
   * Update driver availability status
   */
  async updateDriverStatus(
    driverId: string,
    status: Driver['status']
  ): Promise<void> {
    try {
      const query = `
        UPDATE drivers 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
      `;

      await database.query(query, [status, driverId]);

    } catch (error) {
      console.error('Error updating driver status:', error);
      throw error;
    }
  }

  /**
   * Get all available drivers in a city/region
   */
  async getAvailableDrivers(
    location?: LocationCoordinate,
    radiusMeters: number = 50000 // 50km for city-wide
  ): Promise<Driver[]> {
    try {
      if (location) {
        return this.findNearbyDrivers(location, radiusMeters);
      }

      // Get all available drivers without location filter
      const query = `
        SELECT 
          d.id,
          d.name,
          d.phone,
          d.rating,
          d.status,
          d.total_rides,
          d.profile_photo,
          d.is_verified,
          v.type as vehicle_type,
          v.color as vehicle_color,
          v.plate_number,
          v.model as vehicle_model,
          v.year as vehicle_year,
          dl.latitude,
          dl.longitude,
          dl.heading,
          dl.timestamp as last_location_update,
          ARRAY_AGG(rt.ride_type) as ride_types
        FROM drivers d
        LEFT JOIN vehicles v ON d.id = v.driver_id
        LEFT JOIN driver_locations dl ON d.id = dl.driver_id
        LEFT JOIN driver_ride_types rt ON d.id = rt.driver_id
        WHERE d.status = 'available'
          AND dl.timestamp > NOW() - INTERVAL '10 minutes'
        GROUP BY d.id, v.type, v.color, v.plate_number, v.model, v.year,
                 dl.latitude, dl.longitude, dl.heading, dl.timestamp
        ORDER BY dl.timestamp DESC
      `;

      const result = await database.query(query);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        lat: parseFloat(row.latitude) || 0,
        lng: parseFloat(row.longitude) || 0,
        heading: row.heading ? parseFloat(row.heading) : undefined,
        phone: row.phone,
        rating: parseFloat(row.rating) || 0,
        status: row.status,
        totalRides: parseInt(row.total_rides) || 0,
        profilePhoto: row.profile_photo,
        isVerified: row.is_verified || false,
        lastLocationUpdate: new Date(row.last_location_update),
        vehicle: row.vehicle_type ? {
          type: row.vehicle_type,
          color: row.vehicle_color,
          plateNumber: row.plate_number,
          model: row.vehicle_model,
          year: row.vehicle_year,
        } : undefined,
        rideType: row.ride_types?.filter(Boolean) || ['economy'],
      }));

    } catch (error) {
      console.error('Error getting available drivers:', error);
      return [];
    }
  }

  /**
   * Calculate ETA based on distance and vehicle type
   */
  private calculateETA(distanceKm: number, vehicleType: string = 'Sedan'): number {
    // Different speeds for different vehicle types
    let speedKmh = this.ETA_SPEED_KMH;
    let trafficFactor = 1.3;
    
    if (vehicleType === 'Bike') {
      speedKmh = 25; // Bikes are slightly slower but can navigate better
      trafficFactor = 1.1; // Less affected by traffic
    } else if (vehicleType === 'SUV') {
      speedKmh = 28; // SUVs slightly slower in city
      trafficFactor = 1.4; // More affected by traffic
    }
    
    // ETA in minutes, accounting for traffic and city driving
    const baseTime = (distanceKm / speedKmh) * 60;
    const minETA = vehicleType === 'Bike' ? 1 : 2; // Bikes can be faster for short distances
    
    return Math.max(minETA, Math.round(baseTime * trafficFactor));
  }

  /**
   * Calculate distance between two points in kilometers
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Generate mock drivers for demo purposes when no real drivers are available
   */
  private generateMockDrivers(center: LocationCoordinate, count: number): Driver[] {
    const mockNames = [
      'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Devi', 'Vikram Singh',
      'Anita Gupta', 'Ravi Verma', 'Kavita Joshi', 'Suresh Reddy', 'Meera Nair'
    ];

    const vehicleTypes = [
      { type: 'Sedan', models: ['Swift Dzire', 'Honda Amaze', 'Hyundai Aura'], rideTypes: ['economy', 'comfort'] },
      { type: 'Hatchback', models: ['Maruti Swift', 'Hyundai i20', 'Tata Altroz'], rideTypes: ['economy'] },
      { type: 'SUV', models: ['Mahindra Scorpio', 'Tata Safari', 'Hyundai Creta'], rideTypes: ['comfort', 'premium'] },
      { type: 'Premium', models: ['Honda City', 'Hyundai Verna', 'Skoda Rapid'], rideTypes: ['comfort', 'premium'] },
      { type: 'Bike', models: ['Hero Splendor', 'Honda Activa', 'TVS Jupiter', 'Bajaj Pulsar', 'Royal Enfield'], rideTypes: ['bike'] },
    ];

    const colors = ['White', 'Silver', 'Black', 'Blue', 'Red', 'Grey'];

    return Array.from({ length: count }, (_, index) => {
      const vehicle = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const model = vehicle.models[Math.floor(Math.random() * vehicle.models.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Generate location within 5km radius
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 0.05; // ~5km in degrees
      const lat = center.lat + distance * Math.cos(angle);
      const lng = center.lng + distance * Math.sin(angle);

      const plateNumber = `KA${String(Math.floor(Math.random() * 100)).padStart(2, '0')}${
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      }${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${
        String(Math.floor(Math.random() * 10000)).padStart(4, '0')
      }`;

      const distanceFromUser = this.calculateDistance(center.lat, center.lng, lat, lng);
      const eta = this.calculateETA(distanceFromUser, vehicle.type);

      return {
        id: `mock_driver_${index + 1}`,
        name: mockNames[index % mockNames.length],
        lat,
        lng,
        heading: Math.random() * 360,
        vehicle: {
          type: vehicle.type,
          color,
          plateNumber,
          model,
          year: 2018 + Math.floor(Math.random() * 6),
        },
        rating: 4.0 + Math.random() * 1.0, // 4.0 to 5.0
        eta,
        status: 'available' as const,
        totalRides: Math.floor(Math.random() * 1000) + 100,
        isVerified: Math.random() > 0.2, // 80% verified
        rideType: vehicle.rideTypes,
      };
    });
  }

  /**
   * Create tables if they don't exist (for development)
   */
  async initializeTables(): Promise<void> {
    try {
      // This would typically be in a migration script
      const createDriversTable = `
        CREATE TABLE IF NOT EXISTS drivers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(20) UNIQUE NOT NULL,
          email VARCHAR(255),
          rating DECIMAL(3,2) DEFAULT 5.0,
          status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('available', 'busy', 'offline', 'on_ride')),
          total_rides INTEGER DEFAULT 0,
          profile_photo TEXT,
          is_verified BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;

      const createVehiclesTable = `
        CREATE TABLE IF NOT EXISTS vehicles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          color VARCHAR(50),
          plate_number VARCHAR(20) UNIQUE NOT NULL,
          model VARCHAR(100),
          year INTEGER,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;

      const createDriverLocationsTable = `
        CREATE TABLE IF NOT EXISTS driver_locations (
          driver_id UUID PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(11, 8) NOT NULL,
          heading DECIMAL(5, 2),
          speed DECIMAL(5, 2),
          timestamp TIMESTAMP DEFAULT NOW()
        );
      `;

      const createDriverRideTypesTable = `
        CREATE TABLE IF NOT EXISTS driver_ride_types (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
          ride_type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(driver_id, ride_type)
        );
      `;

      await database.query(createDriversTable);
      await database.query(createVehiclesTable);
      await database.query(createDriverLocationsTable);
      await database.query(createDriverRideTypesTable);

      console.log('✅ Driver service tables initialized');

    } catch (error) {
      console.error('❌ Error initializing driver tables:', error);
    }
  }
}

export const driverService = new DriverService();