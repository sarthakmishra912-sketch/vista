import { rideAPI, Ride } from './api';

export interface CreateRideRequest {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  pickupAddress: string;
  dropAddress: string;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'WALLET';
  scheduledTime?: string;
  vehicleType?: string;
}

export interface RideStatusUpdate {
  rideId: string;
  status: 'CONFIRMED' | 'DRIVER_ARRIVED' | 'RIDE_STARTED' | 'RIDE_COMPLETED' | 'CANCELLED';
  timestamp: string;
  driver?: {
    id: string;
    name: string;
    phone: string;
    vehicleNumber: string;
    vehicleModel: string;
    rating: number;
    profileImage?: string;
  };
}

export interface DriverLocationUpdate {
  rideId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

class RideService {
  private static instance: RideService;
  private currentRide: Ride | null = null;
  private userRides: Ride[] = [];
  private activeRides: Ride[] = [];
  private websocket: WebSocket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  private constructor() {}

  static getInstance(): RideService {
    if (!RideService.instance) {
      RideService.instance = new RideService();
    }
    return RideService.instance;
  }

  // WebSocket connection for real-time updates
  connectWebSocket(): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5001';
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.websocket.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connectWebSocket(), 5000);
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleWebSocketMessage(data: any): void {
    switch (data.type) {
      case 'ride-status-update':
        this.handleRideStatusUpdate(data);
        break;
      case 'driver-location-update':
        this.handleDriverLocationUpdate(data);
        break;
      case 'driver-assigned':
        this.handleDriverAssigned(data);
        break;
      case 'ride-cancelled':
        this.handleRideCancelled(data);
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  private handleRideStatusUpdate(data: RideStatusUpdate): void {
    this.emit('rideStatusUpdate', data);
    
    // Update current ride if it matches
    if (this.currentRide && this.currentRide.id === data.rideId) {
      this.currentRide.status = data.status;
      this.emit('currentRideUpdate', this.currentRide);
    }
  }

  private handleDriverLocationUpdate(data: DriverLocationUpdate): void {
    this.emit('driverLocationUpdate', data);
  }

  private handleDriverAssigned(data: any): void {
    this.emit('driverAssigned', data);
  }

  private handleRideCancelled(data: any): void {
    this.emit('rideCancelled', data);
  }

  // Event listener management
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Ride management methods
  async createRide(request: CreateRideRequest): Promise<Ride> {
    try {
      const response = await rideAPI.createRide(request);
      
      if (response.success && response.data) {
        this.currentRide = response.data;
        this.emit('rideCreated', response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create ride');
      }
    } catch (error) {
      console.error('Create ride error:', error);
      throw error;
    }
  }

  async getUserRides(page: number = 1, limit: number = 10): Promise<{
    rides: Ride[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await rideAPI.getUserRides(page, limit);
      
      if (response.success && response.data) {
        this.userRides = response.data.rides;
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get user rides');
      }
    } catch (error) {
      console.error('Get user rides error:', error);
      throw error;
    }
  }

  async getRideById(rideId: string): Promise<Ride> {
    try {
      const response = await rideAPI.getRideById(rideId);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get ride');
      }
    } catch (error) {
      console.error('Get ride by ID error:', error);
      throw error;
    }
  }

  async updateRideStatus(
    rideId: string,
    status: 'CONFIRMED' | 'DRIVER_ARRIVED' | 'RIDE_STARTED' | 'RIDE_COMPLETED' | 'CANCELLED',
    cancellationReason?: string
  ): Promise<Ride> {
    try {
      const response = await rideAPI.updateRideStatus(rideId, status, cancellationReason);
      
      if (response.success && response.data) {
        this.emit('rideStatusUpdated', response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update ride status');
      }
    } catch (error) {
      console.error('Update ride status error:', error);
      throw error;
    }
  }

  async cancelRide(rideId: string, reason?: string): Promise<Ride> {
    try {
      const response = await rideAPI.cancelRide(rideId, reason);
      
      if (response.success && response.data) {
        this.emit('rideCancelled', response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to cancel ride');
      }
    } catch (error) {
      console.error('Cancel ride error:', error);
      throw error;
    }
  }

  async updateDriverLocation(
    rideId: string,
    lat: number,
    lng: number,
    heading?: number,
    speed?: number
  ): Promise<void> {
    try {
      const response = await rideAPI.updateDriverLocation(rideId, lat, lng, heading, speed);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update driver location');
      }
    } catch (error) {
      console.error('Update driver location error:', error);
      throw error;
    }
  }

  // Join ride room for real-time updates
  joinRideRoom(rideId: string): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'join-ride',
        rideId
      }));
    }
  }

  // Leave ride room
  leaveRideRoom(rideId: string): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'leave-ride',
        rideId
      }));
    }
  }

  // Getters
  getCurrentRide(): Ride | null {
    return this.currentRide;
  }

  getUserRidesCache(): Ride[] {
    return this.userRides;
  }

  getActiveRides(): Ride[] {
    return this.activeRides;
  }

  // Cleanup
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.eventListeners.clear();
  }
}

export const rideService = RideService.getInstance();
export default rideService;
