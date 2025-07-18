import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Ride, RideStatus } from '../types';
import { useAuth } from '../context/AuthContext';

export const useRealTimeRides = (filters?: { status?: RideStatus; userType?: 'rider' | 'driver' }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchInitialRides = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('rides')
          .select(`
            *,
            rider:rider_id(id, name, phone),
            driver:driver_id(id, name, phone, rating, vehicle_info)
          `)
          .order('created_at', { ascending: false });

        // Apply filters based on user type
        if (filters?.userType === 'driver') {
          if (filters?.status) {
            query = query.eq('status', filters.status);
          }
          // For drivers, show rides they can accept or are assigned to
          query = query.or(`driver_id.eq.${user.id},status.eq.requested`);
        } else {
          // For riders, show only their rides
          query = query.eq('rider_id', user.id);
          if (filters?.status) {
            query = query.eq('status', filters.status);
          }
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setRides(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialRides();

    // Set up real-time subscription
    const subscription = supabase
      .channel('rides_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
        },
        (payload) => {
          const newRide = payload.new as Ride;
          const oldRide = payload.old as Ride;

          switch (payload.eventType) {
            case 'INSERT':
              // Only add rides relevant to this user
              if (
                (filters?.userType === 'driver' && newRide.status === 'requested') ||
                (filters?.userType !== 'driver' && newRide.rider_id === user.id)
              ) {
                setRides(prev => [newRide, ...prev]);
              }
              break;

            case 'UPDATE':
              setRides(prev =>
                prev.map(ride =>
                  ride.id === newRide.id ? { ...ride, ...newRide } : ride
                )
              );
              break;

            case 'DELETE':
              setRides(prev => prev.filter(ride => ride.id !== oldRide.id));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, filters]);

  return { rides, loading, error, refetch: () => setLoading(true) };
};

export const useActiveRide = () => {
  const { user } = useAuth();
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchActiveRide = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rides')
          .select(`
            *,
            rider:rider_id(id, name, phone),
            driver:driver_id(id, name, phone, rating, vehicle_info)
          `)
          .or(`rider_id.eq.${user.id},driver_id.eq.${user.id}`)
          .in('status', ['accepted', 'arriving', 'in_progress'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setActiveRide(data);
      } catch (err) {
        console.error('Error fetching active ride:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveRide();

    // Set up real-time subscription for active ride
    const subscription = supabase
      .channel('active_ride_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: `rider_id=eq.${user.id},driver_id=eq.${user.id}`,
        },
        (payload) => {
          const ride = payload.new as Ride;
          
          if (['accepted', 'arriving', 'in_progress'].includes(ride.status)) {
            setActiveRide(ride);
          } else if (['completed', 'cancelled'].includes(ride.status)) {
            setActiveRide(null);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { activeRide, loading };
};