import { DatabaseUtils, db } from './database';
import { Location } from '../types';

// Find nearby drivers using PostGIS function
export const findNearbyDriversPostGIS = async (
  pickupLocation: Location,
  radiusKm: number = 15
) => {
  try {
    const query = `SELECT * FROM find_nearby_drivers($1, $2, $3)`;
    const result = await db.query(query, [
      pickupLocation.latitude,
      pickupLocation.longitude,
      radiusKm,
    ]);

    return { data: result.rows || [], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Calculate route information using PostGIS
export const calculateRouteInfoPostGIS = async (
  pickupLocation: Location,
  destinationLocation: Location
) => {
  try {
    const query = `SELECT * FROM calculate_route_info($1, $2, $3, $4)`;
    const result = await db.query(query, [
      pickupLocation.latitude,
      pickupLocation.longitude,
      destinationLocation.latitude,
      destinationLocation.longitude,
    ]);

    return { data: result.rows?.[0] || null, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update driver location using PostGIS function
export const updateDriverLocationPostGIS = async (
  driverId: string,
  location: Location,
  accuracy?: number,
  speed?: number,
  heading?: number
) => {
  try {
    const query = `SELECT update_driver_location_postgis($1, $2, $3, $4, $5, $6)`;
    const result = await db.query(query, [
      driverId,
      location.latitude,
      location.longitude,
      accuracy,
      speed,
      heading,
    ]);

    return { data: result.rows[0], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get surge multiplier for a location
export const getSurgeMultiplier = async (location: Location) => {
  try {
    const query = `SELECT get_surge_multiplier($1, $2)`;
    const result = await db.query(query, [
      location.latitude,
      location.longitude,
    ]);

    return { data: result.rows[0]?.get_surge_multiplier || 1.0, error: null };
  } catch (error: any) {
    return { data: 1.0, error: error.message };
  }
};

// Create ride with PostGIS geometry
export const createRidePostGIS = async (rideData: {
  rider_id: string;
  pickup_location: Location;
  pickup_address?: string;
  destination_location: Location;
  destination_address?: string;
  ride_type: 'economy' | 'comfort' | 'premium' | 'xl';
  payment_method: 'cash' | 'card' | 'digital_wallet';
  fare: number;
  distance: number;
  estimated_duration: number;
}) => {
  try {
    // Convert Location objects to PostGIS points
    const insertData = {
      rider_id: rideData.rider_id,
      pickup_location: `POINT(${rideData.pickup_location.longitude} ${rideData.pickup_location.latitude})`,
      pickup_address: rideData.pickup_address,
      destination_location: `POINT(${rideData.destination_location.longitude} ${rideData.destination_location.latitude})`,
      destination_address: rideData.destination_address,
      ride_type: rideData.ride_type,
      payment_method: rideData.payment_method,
      fare: rideData.fare,
      distance: rideData.distance,
      estimated_duration: rideData.estimated_duration,
      status: 'requested',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('rides')
      .insert([insertData])
      .select(`
        *,
        rider:rider_id(id, name, phone)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get rides with PostGIS location data
export const getRidesWithLocationPostGIS = async (
  userId: string,
  userType: 'rider' | 'driver',
  status?: string
) => {
  try {
    let query = supabase
      .from('rides')
      .select(`
        *,
        ST_X(pickup_location) as pickup_lng,
        ST_Y(pickup_location) as pickup_lat,
        ST_X(destination_location) as dest_lng,
        ST_Y(destination_location) as dest_lat,
        rider:rider_id(id, name, phone),
        driver:driver_id(id, name, phone, rating)
      `)
      .order('created_at', { ascending: false });

    if (userType === 'rider') {
      query = query.eq('rider_id', userId);
    } else {
      query = query.or(`driver_id.eq.${userId},status.eq.requested`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to include location objects
    const transformedData = data?.map(ride => ({
      ...ride,
      pickup_location: {
        latitude: ride.pickup_lat,
        longitude: ride.pickup_lng,
        address: ride.pickup_address,
      },
      destination_location: {
        latitude: ride.dest_lat,
        longitude: ride.dest_lng,
        address: ride.destination_address,
      },
    }));

    return { data: transformedData || [], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Get nearby available rides for drivers with PostGIS
export const getNearbyRidesForDriver = async (
  driverLocation: Location,
  radiusKm: number = 15
) => {
  try {
    const { data, error } = await supabase.rpc('sql', {
      query: `
        SELECT 
          r.*,
          ST_X(r.pickup_location) as pickup_lng,
          ST_Y(r.pickup_location) as pickup_lat,
          ST_X(r.destination_location) as dest_lng,
          ST_Y(r.destination_location) as dest_lat,
          ROUND(
            ST_Distance(
              ST_GeogFromWGS84(r.pickup_location),
              ST_GeogFromWGS84(ST_MakePoint($3, $4))
            )::DECIMAL / 1000, 2
          ) as distance_km,
          u.name as rider_name,
          u.phone as rider_phone
        FROM rides r
        JOIN users u ON r.rider_id = u.id
        WHERE r.status = 'requested'
          AND r.driver_id IS NULL
          AND ST_DWithin(
            ST_GeogFromWGS84(r.pickup_location),
            ST_GeogFromWGS84(ST_MakePoint($3, $4)),
            $2 * 1000
          )
        ORDER BY distance_km ASC
      `,
      params: [radiusKm, driverLocation.longitude, driverLocation.latitude],
    });

    if (error) throw error;

    // Transform the data
    const transformedData = data?.map((ride: any) => ({
      ...ride,
      pickup_location: {
        latitude: ride.pickup_lat,
        longitude: ride.pickup_lng,
        address: ride.pickup_address,
      },
      destination_location: {
        latitude: ride.dest_lat,
        longitude: ride.dest_lng,
        address: ride.destination_address,
      },
      rider: {
        name: ride.rider_name,
        phone: ride.rider_phone,
      },
    }));

    return { data: transformedData || [], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Update ride tracking with PostGIS
export const updateRideTracking = async (
  rideId: string,
  driverLocation: Location,
  etaToPickup?: number,
  etaToDestination?: number,
  distanceToPickup?: number,
  distanceToDestination?: number
) => {
  try {
    const { data, error } = await supabase
      .from('ride_tracking')
      .insert([
        {
          ride_id: rideId,
          driver_location: `POINT(${driverLocation.longitude} ${driverLocation.latitude})`,
          eta_to_pickup: etaToPickup,
          eta_to_destination: etaToDestination,
          distance_to_pickup: distanceToPickup,
          distance_to_destination: distanceToDestination,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get ride tracking history
export const getRideTracking = async (rideId: string, limit: number = 50) => {
  try {
    const { data, error } = await supabase
      .from('ride_tracking')
      .select(`
        *,
        ST_X(driver_location) as driver_lng,
        ST_Y(driver_location) as driver_lat
      `)
      .eq('ride_id', rideId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform the data
    const transformedData = data?.map(tracking => ({
      ...tracking,
      driver_location: tracking.driver_lng && tracking.driver_lat ? {
        latitude: tracking.driver_lat,
        longitude: tracking.driver_lng,
      } : null,
    }));

    return { data: transformedData || [], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Add saved place with PostGIS
export const addSavedPlace = async (
  userId: string,
  name: string,
  address: string,
  location: Location,
  placeType: string = 'custom'
) => {
  try {
    const { data, error } = await supabase
      .from('saved_places')
      .insert([
        {
          user_id: userId,
          name,
          address,
          location: `POINT(${location.longitude} ${location.latitude})`,
          place_type: placeType,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get saved places with PostGIS
export const getSavedPlaces = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_places')
      .select(`
        *,
        ST_X(location) as lng,
        ST_Y(location) as lat
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data
    const transformedData = data?.map(place => ({
      ...place,
      location: {
        latitude: place.lat,
        longitude: place.lng,
      },
    }));

    return { data: transformedData || [], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};