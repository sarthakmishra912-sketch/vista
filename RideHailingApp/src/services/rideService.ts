import { supabase } from './supabase';
import { Ride, Location, RideStatus } from '../types';

// Create a new ride request
export const createRide = async (rideData: {
  rider_id: string;
  pickup_location: Location;
  destination_location: Location;
  ride_type: 'economy' | 'comfort' | 'premium' | 'xl';
  payment_method: 'cash' | 'card' | 'digital_wallet';
  fare: number;
  distance: number;
  estimated_duration: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .insert([
        {
          ...rideData,
          status: 'requested',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get rides for a specific user
export const getUserRides = async (userId: string, status?: RideStatus) => {
  try {
    let query = supabase
      .from('rides')
      .select('*')
      .eq('rider_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get a specific ride by ID
export const getRideById = async (rideId: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        driver:driver_id (
          id,
          name,
          rating,
          vehicle_info
        )
      `)
      .eq('id', rideId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update ride status
export const updateRideStatus = async (rideId: string, status: RideStatus, driverId?: string) => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (driverId) {
      updateData.driver_id = driverId;
    }

    if (status === 'accepted') {
      updateData.accepted_at = new Date().toISOString();
    } else if (status === 'in_progress') {
      updateData.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('rides')
      .update(updateData)
      .eq('id', rideId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Rate a completed ride
export const rateRide = async (rideId: string, rating: number, notes?: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .update({
        rating,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', rideId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get available drivers near a location
export const getNearbyDrivers = async (location: Location, radius: number = 10) => {
  try {
    // In a real implementation, you would use PostGIS for geospatial queries
    // For now, we'll do a simple query and filter in memory
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_available', true)
      .eq('is_verified', true);

    if (error) throw error;

    // Filter drivers by distance (simplified calculation)
    const nearbyDrivers = data?.filter(driver => {
      if (!driver.current_location) return false;
      
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        driver.current_location.latitude,
        driver.current_location.longitude
      );
      
      return distance <= radius;
    });

    return { data: nearbyDrivers, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update driver location
export const updateDriverLocation = async (driverId: string, location: Location) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({
        current_location: location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', driverId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Set driver availability
export const setDriverAvailability = async (driverId: string, isAvailable: boolean) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({
        is_available: isAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq('id', driverId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Helper function to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};