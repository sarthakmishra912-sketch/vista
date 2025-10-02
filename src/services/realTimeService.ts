// Real-time WebSocket service for ride requests and updates
import { io, Socket } from 'socket.io-client';

class RealTimeService {
  private socket: Socket | null = null;
  private isConnected = false;

  // Initialize WebSocket connection
  connect(): void {
    if (this.socket && this.isConnected) {
      console.log('🚀 WebSocket already connected');
      return;
    }

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    console.log('🚀 Connecting to WebSocket server:', serverUrl);

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('✅ WebSocket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('❌ WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.isConnected = false;
    });
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WebSocket disconnected');
    }
  }

  // Join driver room for receiving ride requests
  joinDriverRoom(driverId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('join-driver', driverId);
    console.log('🚗 Joined driver room:', driverId);
  }

  // Leave driver room
  leaveDriverRoom(driverId: string): void {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('leave-driver', driverId);
    console.log('🚗 Left driver room:', driverId);
  }

  // Join ride room for passenger updates
  joinRideRoom(rideId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('join-ride', rideId);
    console.log('🚖 Joined ride room:', rideId);
  }

  // Leave ride room
  leaveRideRoom(rideId: string): void {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('leave-ride', rideId);
    console.log('🚖 Left ride room:', rideId);
  }

  // Accept a ride request
  acceptRideRequest(rideId: string, driverId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('accept-ride-request', { rideId, driverId });
    console.log('✅ Accepted ride request:', rideId);
  }

  // Reject a ride request
  rejectRideRequest(rideId: string, driverId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('reject-ride-request', { rideId, driverId });
    console.log('❌ Rejected ride request:', rideId);
  }

  // Notify passenger that driver has arrived
  notifyPassengerArrival(rideId: string, driverId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('driver-arrived', { rideId, driverId });
    console.log('🚗 Notified passenger of arrival:', rideId);
  }

  // Listen for new ride requests (for drivers)
  onNewRideRequest(callback: (rideRequest: any) => void): void {
    if (!this.socket) {
      console.error('❌ WebSocket not initialized');
      return;
    }

    this.socket.on('new-ride-request', (rideRequest) => {
      console.log('🚨 NEW RIDE REQUEST RECEIVED:', rideRequest);
      callback(rideRequest);
    });
  }

  // Listen for ride acceptance (for passengers)
  onRideAccepted(callback: (data: any) => void): void {
    if (!this.socket) {
      console.error('❌ WebSocket not initialized');
      return;
    }

    this.socket.on('ride-accepted', (data) => {
      console.log('✅ RIDE ACCEPTED:', data);
      callback(data);
    });
  }

  // Listen for ride taken notifications (for other drivers)
  onRideTaken(callback: (data: any) => void): void {
    if (!this.socket) {
      console.error('❌ WebSocket not initialized');
      return;
    }

    this.socket.on('ride-taken', (data) => {
      console.log('🚫 RIDE TAKEN BY ANOTHER DRIVER:', data);
      callback(data);
    });
  }

  // Listen for ride status updates
  onRideStatusUpdate(callback: (data: any) => void): void {
    if (!this.socket) {
      console.error('❌ WebSocket not initialized');
      return;
    }

    this.socket.on('ride-status-update', (data) => {
      console.log('📱 RIDE STATUS UPDATE:', data);
      callback(data);
    });
  }

  // Remove all listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      console.log('🧹 Removed all WebSocket listeners');
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const realTimeService = new RealTimeService();
export default realTimeService;