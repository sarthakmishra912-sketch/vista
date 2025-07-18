import { useState, useEffect } from 'react';
import { DatabaseUtils, RealtimeManager } from '../services/database';
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
        let ridesData: any[] = [];

        if (filters?.userType === 'driver') {
          // For drivers, get rides they can accept or are assigned to
          let whereCondition: any = {};
          
          if (filters?.status) {
            whereCondition.status = filters.status;
          }

          // Get driver's assigned rides
          const driverRides = await DatabaseUtils.select(
            'rides',
            `*, 
             (SELECT json_build_object('id', u.id, 'name', u.name, 'phone', u.phone) 
              FROM users u WHERE u.id = rides.rider_id) as rider,
             (SELECT json_build_object('id', u.id, 'name', u.name, 'phone', u.phone, 'rating', d.rating) 
              FROM users u LEFT JOIN drivers d ON u.id = d.id WHERE u.id = rides.driver_id) as driver`,
            { driver_id: user.id, ...whereCondition },
            'created_at DESC'
          );

          // Get available rides (if no specific status filter or status is 'requested')
          if (!filters?.status || filters.status === 'requested') {
            const availableRides = await DatabaseUtils.select(
              'rides',
              `*, 
               (SELECT json_build_object('id', u.id, 'name', u.name, 'phone', u.phone) 
                FROM users u WHERE u.id = rides.rider_id) as rider,
               null as driver`,
              { status: 'requested' },
              'created_at DESC'
            );
            ridesData = [...driverRides, ...availableRides];
          } else {
            ridesData = driverRides;
          }
        } else {
          // For riders, show only their rides
          let whereCondition: any = { rider_id: user.id };
          
          if (filters?.status) {
            whereCondition.status = filters.status;
          }

          ridesData = await DatabaseUtils.select(
            'rides',
            `*, 
             (SELECT json_build_object('id', u.id, 'name', u.name, 'phone', u.phone) 
              FROM users u WHERE u.id = rides.rider_id) as rider,
             (SELECT json_build_object('id', u.id, 'name', u.name, 'phone', u.phone, 'rating', d.rating) 
              FROM users u LEFT JOIN drivers d ON u.id = d.id WHERE u.id = rides.driver_id) as driver`,
            whereCondition,
            'created_at DESC'
          );
        }

        setRides(ridesData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialRides();

    // Set up real-time subscription
    const subscriptionFilter = filters?.userType === 'driver' ? 
      undefined : // Drivers need to see all ride updates
      { rider_id: user.id }; // Riders only see their own rides

    const unsubscribe = RealtimeManager.subscribe(
      'rides',
      (payload) => {
        console.log('Real-time ride update:', payload);
        
        setRides(prevRides => {
          // Check if this update is relevant for the current user
          if (filters?.userType === 'rider' && payload.rider_id !== user.id) {
            return prevRides; // Not relevant for this rider
          }

          if (filters?.userType === 'driver' && 
              payload.driver_id !== user.id && 
              payload.status !== 'requested') {
            return prevRides; // Not relevant for this driver
          }

          const existingIndex = prevRides.findIndex(ride => ride.id === payload.id);
          
          if (existingIndex >= 0) {
            // Update existing ride
            const updated = [...prevRides];
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...payload,
            };
            return updated;
          } else {
            // Add new ride (if it matches filters)
            if (filters?.status && payload.status !== filters.status) {
              return prevRides; // Doesn't match status filter
            }
            return [payload, ...prevRides];
          }
        });
      },
      subscriptionFilter
    );

    return () => {
      unsubscribe();
    };
  }, [user, filters?.status, filters?.userType]);

  return { rides, loading, error };
};

// Hook for active ride (rider or driver's current ride)
export const useActiveRide = () => {
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchActiveRide = async () => {
      try {
        setLoading(true);
        
        // For riders, get ride that's not completed or cancelled
        const whereCondition = user.user_type === 'rider' ? 
          { rider_id: user.id } : 
          { driver_id: user.id };

        const activeRides = await DatabaseUtils.select(
          'rides',
          `*, 
           (SELECT json_build_object('id', u.id, 'name', u.name, 'phone', u.phone) 
            FROM users u WHERE u.id = rides.rider_id) as rider,
           (SELECT json_build_object('id', u.id, 'name', u.name, 'phone', u.phone, 'rating', d.rating) 
            FROM users u LEFT JOIN drivers d ON u.id = d.id WHERE u.id = rides.driver_id) as driver`,
          whereCondition,
          'created_at DESC',
          1
        );

        // Filter for active statuses
        const activeStatuses = ['requested', 'accepted', 'arriving', 'in_progress'];
        const currentActiveRide = activeRides.find(ride => 
          activeStatuses.includes(ride.status)
        );

        setActiveRide(currentActiveRide || null);
      } catch (error) {
        console.error('Error fetching active ride:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveRide();

    // Subscribe to updates for active ride
    const unsubscribe = RealtimeManager.subscribe(
      'rides',
      (payload) => {
        if ((user.user_type === 'rider' && payload.rider_id === user.id) ||
            (user.user_type === 'driver' && payload.driver_id === user.id)) {
          
          const activeStatuses = ['requested', 'accepted', 'arriving', 'in_progress'];
          
          if (activeStatuses.includes(payload.status)) {
            setActiveRide(payload);
          } else {
            setActiveRide(null); // Ride completed or cancelled
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return { activeRide, loading };
};