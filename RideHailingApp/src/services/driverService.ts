import { supabase } from './supabase';
import { Location, Ride } from '../types';
import { 
  updateDriverLocationPostGIS, 
  findNearbyDriversPostGIS, 
  getNearbyRidesForDriver 
} from './postgisService';
import { 
  notifyRider, 
  notifyNearbyDrivers, 
  createRideNotifications 
} from './notificationService';

// Accept a ride request
export const acceptRide = async (rideId: string, driverId: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .update({
        driver_id: driverId,
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', rideId)
      .eq('status', 'requested') // Only accept if still requested
      .select(`
        *,
        rider:rider_id(id, name, phone),
        driver:driver_id(id, name, phone, rating, vehicle_info)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update ride status (arriving, in_progress, completed)
export const updateRideStatus = async (rideId: string, status: 'arriving' | 'in_progress' | 'completed') => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'in_progress') {
      updateData.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('rides')
      .update(updateData)
      .eq('id', rideId)
      .select(`
        *,
        rider:rider_id(id, name, phone),
        driver:driver_id(id, name, phone, rating, vehicle_info)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Cancel ride (driver can cancel if not started)
export const cancelRide = async (rideId: string, reason?: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        notes: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', rideId)
      .in('status', ['accepted', 'arriving']) // Can only cancel before in_progress
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get available rides for driver using PostGIS
export const getAvailableRides = async (driverLocation: Location, radius: number = 10) => {
  try {
    return await getNearbyRidesForDriver(driverLocation, radius);
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Update driver availability status
export const updateDriverAvailability = async (driverId: string, isAvailable: boolean) => {
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

// Update driver location using PostGIS
export const updateDriverLocation = async (driverId: string, location: Location) => {
  try {
    return await updateDriverLocationPostGIS(driverId, location);
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get driver's current ride
export const getDriverCurrentRide = async (driverId: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        rider:rider_id(id, name, phone)
      `)
      .eq('driver_id', driverId)
      .in('status', ['accepted', 'arriving', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get driver profile with vehicle info
export const getDriverProfile = async (driverId: string) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        user:id(name, email, phone, avatar_url),
        vehicle:vehicle_info_id(*)
      `)
      .eq('id', driverId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Calculate trip earnings
export const calculateTripEarnings = async (driverId: string, startDate?: string, endDate?: string) => {
  try {
    let query = supabase
      .from('rides')
      .select('fare, created_at')
      .eq('driver_id', driverId)
      .eq('status', 'completed');

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    const totalEarnings = data?.reduce((sum, ride) => sum + parseFloat(ride.fare.toString()), 0) || 0;
    const totalRides = data?.length || 0;

    return {
      data: {
        totalEarnings,
        totalRides,
        averageEarnings: totalRides > 0 ? totalEarnings / totalRides : 0,
        rides: data,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Helper function to calculate distance
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