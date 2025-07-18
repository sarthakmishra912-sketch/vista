import { supabase } from './supabase';

// Note: For production, you would use Stripe SDK for React Native
// This is a simplified version showing the structure

export interface PaymentMethod {
  id: string;
  type: 'cash' | 'card' | 'digital_wallet';
  last_four?: string;
  brand?: string;
  is_default: boolean;
  stripe_payment_method_id?: string;
  metadata?: any;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  client_secret?: string;
}

// Get user's saved payment methods
export const getPaymentMethods = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Add new payment method
export const addPaymentMethod = async (
  userId: string,
  paymentMethodData: {
    type: 'cash' | 'card' | 'digital_wallet';
    last_four?: string;
    brand?: string;
    stripe_payment_method_id?: string;
    metadata?: any;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([
        {
          user_id: userId,
          ...paymentMethodData,
          is_default: false,
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

// Set default payment method
export const setDefaultPaymentMethod = async (
  userId: string,
  paymentMethodId: string
) => {
  try {
    // First, unset all current defaults
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Then set the new default
    const { data, error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Remove payment method
export const removePaymentMethod = async (
  userId: string,
  paymentMethodId: string
) => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Calculate ride fare with surge pricing
export const calculateFareWithSurge = async (
  distance: number,
  duration: number,
  rideType: 'economy' | 'comfort' | 'premium' | 'xl',
  pickupLocation: { latitude: number; longitude: number }
) => {
  try {
    // Get surge multiplier
    const { data: surgeMultiplier } = await supabase.rpc('get_surge_multiplier', {
      lat: pickupLocation.latitude,
      lng: pickupLocation.longitude,
    });

    // Base fare structure
    const fareStructure = {
      economy: { base: 5.0, perKm: 2.0, perMinute: 0.25 },
      comfort: { base: 7.0, perKm: 2.5, perMinute: 0.35 },
      premium: { base: 10.0, perKm: 3.5, perMinute: 0.50 },
      xl: { base: 8.0, perKm: 3.0, perMinute: 0.40 },
    };

    const rates = fareStructure[rideType];
    const baseFare = rates.base + (distance * rates.perKm) + (duration * rates.perMinute);
    const surgePrice = baseFare * (surgeMultiplier || 1.0);
    
    return {
      baseFare: Math.round(baseFare * 100) / 100,
      surgeMultiplier: surgeMultiplier || 1.0,
      finalFare: Math.round(surgePrice * 100) / 100,
      breakdown: {
        baseRate: rates.base,
        distanceFare: distance * rates.perKm,
        timeFare: duration * rates.perMinute,
        surgeCharge: surgePrice - baseFare,
      },
    };
  } catch (error: any) {
    return {
      baseFare: 0,
      surgeMultiplier: 1.0,
      finalFare: 0,
      error: error.message,
    };
  }
};

// Create payment intent for Stripe (server-side function needed)
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  rideId: string,
  customerId?: string
): Promise<{ data: PaymentIntent | null; error: string | null }> => {
  try {
    // This would typically call a Supabase Edge Function or your backend
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        rideId,
        customerId,
        metadata: {
          ride_id: rideId,
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Confirm payment
export const confirmPayment = async (
  paymentIntentId: string,
  paymentMethodId: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase.functions.invoke('confirm-payment', {
      body: {
        paymentIntentId,
        paymentMethodId,
      },
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Process cash payment
export const processCashPayment = async (
  rideId: string,
  amount: number,
  driverId: string
) => {
  try {
    // Update ride with payment info
    const { data, error } = await supabase
      .from('rides')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        payment_status: 'completed',
        payment_method: 'cash',
        fare: amount,
      })
      .eq('id', rideId)
      .select()
      .single();

    if (error) throw error;

    // Update driver earnings
    await updateDriverEarnings(driverId, amount);

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update driver earnings
export const updateDriverEarnings = async (
  driverId: string,
  fareAmount: number
) => {
  try {
    const commission = 0.8; // Driver gets 80%
    const driverEarning = fareAmount * commission;

    const { data, error } = await supabase
      .from('drivers')
      .update({
        total_earnings: supabase.raw(`total_earnings + ${driverEarning}`),
        total_rides: supabase.raw('total_rides + 1'),
      })
      .eq('id', driverId);

    if (error) throw error;
    return { success: true, earning: driverEarning, error: null };
  } catch (error: any) {
    return { success: false, earning: 0, error: error.message };
  }
};

// Get driver earnings summary
export const getDriverEarnings = async (
  driverId: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    let query = supabase
      .from('rides')
      .select('fare, completed_at, distance, estimated_duration')
      .eq('driver_id', driverId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (startDate) {
      query = query.gte('completed_at', startDate);
    }
    if (endDate) {
      query = query.lte('completed_at', endDate);
    }

    const { data: rides, error } = await query;

    if (error) throw error;

    const totalFare = rides?.reduce((sum, ride) => sum + (ride.fare || 0), 0) || 0;
    const driverCommission = 0.8;
    const driverEarnings = totalFare * driverCommission;
    const totalRides = rides?.length || 0;
    const totalDistance = rides?.reduce((sum, ride) => sum + (ride.distance || 0), 0) || 0;
    const totalDuration = rides?.reduce((sum, ride) => sum + (ride.estimated_duration || 0), 0) || 0;

    return {
      data: {
        totalEarnings: Math.round(driverEarnings * 100) / 100,
        totalFare,
        commission: driverCommission,
        totalRides,
        totalDistance: Math.round(totalDistance * 100) / 100,
        totalDuration,
        averageRating: 0, // Would calculate from reviews
        rides: rides || [],
      },
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message,
    };
  }
};

// Process ride refund
export const processRefund = async (
  rideId: string,
  amount: number,
  reason: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('process-refund', {
      body: {
        rideId,
        amount: Math.round(amount * 100), // Convert to cents
        reason,
      },
    });

    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
};

// Get payment history
export const getPaymentHistory = async (
  userId: string,
  limit: number = 50
) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select(`
        id,
        fare,
        payment_method,
        payment_status,
        completed_at,
        pickup_address,
        destination_address,
        status
      `)
      .eq('rider_id', userId)
      .in('status', ['completed', 'cancelled'])
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Validate payment method
export const validatePaymentMethod = (paymentMethod: PaymentMethod): boolean => {
  if (paymentMethod.type === 'cash') {
    return true;
  }
  
  if (paymentMethod.type === 'card') {
    return !!(paymentMethod.stripe_payment_method_id && paymentMethod.last_four);
  }
  
  if (paymentMethod.type === 'digital_wallet') {
    return !!(paymentMethod.stripe_payment_method_id);
  }
  
  return false;
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};