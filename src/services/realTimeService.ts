import { apiClient } from './api';

export interface RealTimeStats {
  totalDrivers: number;
  onlineDrivers: number;
  activeRides: number;
  completedRidesToday: number;
  averageWaitTime: number;
  surgeAreas: number;
}

export interface LocationStats {
  lat: number;
  lng: number;
  radius: number;
  availableDrivers: number;
  activeRides: number;
  demandRatio: number;
  averageFare: number;
}

export interface DriverHeatmapData {
  lat: number;
  lng: number;
  count: number;
}

export interface DemandHotspot {
  lat: number;
  lng: number;
  demand: number;
}

class RealTimeService {
  private static instance: RealTimeService;
  private websocket: WebSocket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private constructor() {}

  static getInstance(): RealTimeService {
    if (!RealTimeService.instance) {
      RealTimeService.instance = new RealTimeService();
    }
    return RealTimeService.instance;
  }

  // WebSocket connection
  connect(): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5001';
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log('Real-time WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.websocket.onclose = () => {
      console.log('Real-time WebSocket disconnected');
      this.attemptReconnect();
    };

    this.websocket.onerror = (error) => {
      console.error('Real-time WebSocket error:', error);
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private handleMessage(data: any): void {
    switch (data.type) {
      case 'ride-status-update':
        this.emit('rideStatusUpdate', data);
        break;
      case 'driver-location-update':
        this.emit('driverLocationUpdate', data);
        break;
      case 'driver-assigned':
        this.emit('driverAssigned', data);
        break;
      case 'ride-cancelled':
        this.emit('rideCancelled', data);
        break;
      default:
        console.log('Unknown real-time message type:', data.type);
    }
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

  // API methods
  async getRealTimeStats(): Promise<RealTimeStats> {
    try {
      const response = await apiClient.getStats();
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get real-time stats');
      }
    } catch (error) {
      console.error('Get real-time stats error:', error);
      throw error;
    }
  }

  async getLocationStats(
    lat: number,
    lng: number,
    radius: number = 5
  ): Promise<LocationStats> {
    try {
      const response = await apiClient.getLocationStats(lat, lng, radius);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get location stats');
      }
    } catch (error) {
      console.error('Get location stats error:', error);
      throw error;
    }
  }

  async getDriverHeatmapData(): Promise<DriverHeatmapData[]> {
    try {
      const response = await apiClient.getDriverHeatmap();
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get driver heatmap data');
      }
    } catch (error) {
      console.error('Get driver heatmap error:', error);
      throw error;
    }
  }

  async getDemandHotspots(): Promise<DemandHotspot[]> {
    try {
      const response = await apiClient.getDemandHotspots();
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get demand hotspots');
      }
    } catch (error) {
      console.error('Get demand hotspots error:', error);
      throw error;
    }
  }

  // WebSocket methods
  joinRideRoom(rideId: string): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'join-ride',
        rideId
      }));
    }
  }

  leaveRideRoom(rideId: string): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'leave-ride',
        rideId
      }));
    }
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

export const realTimeService = RealTimeService.getInstance();
export default realTimeService;
