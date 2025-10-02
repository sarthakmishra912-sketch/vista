// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email?: string;
  phone: string;
  firstName: string;
  lastName?: string;
  profileImage?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface PricingResponse {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  peakHourMultiplier: number;
  totalFare: number;
  distance: number;
  estimatedDuration: number;
  breakdown: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    surgeAmount: number;
    peakHourAmount: number;
    subtotal: number;
    total: number;
  };
}

export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  pickupAddress: string;
  dropAddress: string;
  distance: number;
  duration: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  totalFare: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  driver?: {
    id: string;
    firstName: string;
    lastName?: string;
    profileImage?: string;
    rating: number;
    vehicleNumber: string;
    vehicleModel: string;
    phone: string;
  };
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.accessToken = localStorage.getItem('accessToken');
    
    // For development: Always ensure we have a passenger token
    if (!this.accessToken || this.accessToken.startsWith('mock-driver-token-')) {
      this.setMockToken();
    }
  }

  // Set mock token for development
  private setMockToken() {
    // Clear any existing driver tokens
    if (localStorage.getItem('accessToken')?.startsWith('mock-driver-token-')) {
      localStorage.removeItem('accessToken');
      console.log('🧹 Cleared conflicting driver token');
    }
    
    const mockToken = 'mock-passenger-token-' + Date.now();
    this.accessToken = mockToken;
    localStorage.setItem('accessToken', mockToken);
    console.log('🚖 Set mock passenger token for development:', mockToken);
  }

  // Set access token
  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  // Clear access token
  clearAccessToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Get refresh token
  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Make HTTP request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const requestId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    // Log API call start
    console.log(`[${requestId}] 🚀 API CALL STARTED`, {
      method: options.method || 'GET',
      url,
      endpoint,
      hasAuth: !!this.accessToken,
      body: options.body ? JSON.parse(options.body as string) : undefined
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      // Log API call success
      console.log(`[${requestId}] API CALL SUCCESS`, {
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        responseSize: JSON.stringify(data).length,
        success: data.success
      });

      // Handle token refresh
      if (response.status === 401 && this.getRefreshToken()) {
        console.log(`[${requestId}] TOKEN REFRESH ATTEMPT`);
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          console.log(`[${requestId}] 🔄 TOKEN REFRESH SUCCESS - RETRYING REQUEST`);
          // Retry the original request
          const retryHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers,
            Authorization: `Bearer ${this.accessToken}`,
          };
          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
          });
          const retryData = await retryResponse.json();
          const retryDuration = Date.now() - startTime;
          
          console.log(`[${requestId}] RETRY API CALL SUCCESS`, {
            status: retryResponse.status,
            duration: `${retryDuration}ms`,
            success: retryData.success
          });
          
          return retryData;
        } else {
          console.log(`[${requestId}] TOKEN REFRESH FAILED`);
        }
      }

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] API CALL FAILED`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`,
        url,
        method: options.method || 'GET'
      });
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.data.accessToken) {
        this.setAccessToken(data.data.accessToken);
        return true;
      } else {
        this.clearAccessToken();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAccessToken();
      return false;
    }
  }

  // Authentication APIs
  async sendOTP(phone: string, countryCode: string = '+91'): Promise<ApiResponse> {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, countryCode }),
    });
  }

  async verifyOTP(
    phone: string,
    otp: string,
    countryCode: string = '+91'
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, countryCode }),
    });
  }

  async authenticateWithGoogle(idToken: string): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async authenticateWithTruecaller(
    phone: string,
    truecallerToken: string
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return this.request('/auth/truecaller', {
      method: 'POST',
      body: JSON.stringify({ phone, truecallerToken }),
    });
  }

  async logout(): Promise<ApiResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return { success: true };

    const response = await this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    this.clearAccessToken();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/me');
  }

  async updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Pricing APIs
  async calculateFare(request: {
    pickupLat: number;
    pickupLng: number;
    dropLat: number;
    dropLng: number;
    vehicleType?: string;
    scheduledTime?: string;
  }): Promise<ApiResponse<PricingResponse>> {
    return this.request('/pricing/calculate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getNearbyDrivers(
    lat: number,
    lng: number,
    radius: number = 5
  ): Promise<ApiResponse<{ drivers: any[]; count: number; radius: number }>> {
    return this.request(`/pricing/nearby-drivers?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  async getSurgeAreas(): Promise<ApiResponse<{ surgeAreas: any[]; count: number }>> {
    return this.request('/pricing/surge-areas');
  }

  async getPricingRules(): Promise<ApiResponse<any>> {
    return this.request('/pricing/rules');
  }

  // Ride APIs
  async createRide(request: {
    pickupLat: number;
    pickupLng: number;
    dropLat: number;
    dropLng: number;
    pickupAddress: string;
    dropAddress: string;
    paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'WALLET';
    scheduledTime?: string;
    vehicleType?: string;
  }): Promise<ApiResponse<Ride>> {
    console.log('CREATE RIDE API CALL', {
      pickupLocation: `${request.pickupLat}, ${request.pickupLng}`,
      dropLocation: `${request.dropLat}, ${request.dropLng}`,
      pickupAddress: request.pickupAddress,
      dropAddress: request.dropAddress,
      paymentMethod: request.paymentMethod,
      vehicleType: request.vehicleType,
      scheduledTime: request.scheduledTime
    });

    const response = await this.request('/rides', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (response.success && response.data) {
      console.log('🎯 CREATE RIDE SUCCESS', {
        rideId: response.data.id,
        status: response.data.status,
        totalFare: response.data.totalFare,
        distance: response.data.distance,
        duration: response.data.duration
      });
    } else {
      console.log('🎯 CREATE RIDE FAILED', {
        message: response.message,
        errors: response.errors
      });
    }

    return response;
  }

  async getUserRides(page: number = 1, limit: number = 10): Promise<ApiResponse<{
    rides: Ride[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    return this.request(`/rides?page=${page}&limit=${limit}`);
  }

  async getRideById(rideId: string): Promise<ApiResponse<Ride>> {
    return this.request(`/rides/${rideId}`);
  }

  async updateRideStatus(
    rideId: string,
    status: 'CONFIRMED' | 'DRIVER_ARRIVED' | 'RIDE_STARTED' | 'RIDE_COMPLETED' | 'CANCELLED',
    cancellationReason?: string
  ): Promise<ApiResponse<Ride>> {
    return this.request(`/rides/${rideId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, cancellationReason }),
    });
  }

  async cancelRide(rideId: string, reason?: string): Promise<ApiResponse<Ride>> {
    return this.request(`/rides/${rideId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async updateDriverLocation(
    rideId: string,
    lat: number,
    lng: number,
    heading?: number,
    speed?: number
  ): Promise<ApiResponse> {
    return this.request(`/rides/${rideId}/track`, {
      method: 'POST',
      body: JSON.stringify({ lat, lng, heading, speed }),
    });
  }

  // Real-time APIs
  async getStats(): Promise<ApiResponse<any>> {
    return this.request('/realtime/stats');
  }

  async getLocationStats(lat: number, lng: number, radius: number): Promise<ApiResponse<any>> {
    return this.request(`/realtime/location-stats?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  async getDriverHeatmap(): Promise<ApiResponse<any>> {
    return this.request('/realtime/driver-heatmap');
  }

  async getDemandHotspots(): Promise<ApiResponse<any>> {
    return this.request('/realtime/demand-hotspots');
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual API functions for convenience
export const authAPI = {
  sendOTP: (phone: string, countryCode?: string) => apiClient.sendOTP(phone, countryCode),
  verifyOTP: (phone: string, otp: string, countryCode?: string) => 
    apiClient.verifyOTP(phone, otp, countryCode),
  authenticateWithGoogle: (idToken: string) => apiClient.authenticateWithGoogle(idToken),
  authenticateWithTruecaller: (phone: string, truecallerToken: string) => 
    apiClient.authenticateWithTruecaller(phone, truecallerToken),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  updateProfile: (updates: any) => apiClient.updateProfile(updates),
};

export const pricingAPI = {
  calculateFare: (request: any) => apiClient.calculateFare(request),
  getNearbyDrivers: (lat: number, lng: number, radius?: number) => 
    apiClient.getNearbyDrivers(lat, lng, radius),
  getSurgeAreas: () => apiClient.getSurgeAreas(),
  getPricingRules: () => apiClient.getPricingRules(),
};

export const rideAPI = {
  createRide: (request: any) => apiClient.createRide(request),
  getUserRides: (page?: number, limit?: number) => apiClient.getUserRides(page, limit),
  getRideById: (rideId: string) => apiClient.getRideById(rideId),
  updateRideStatus: (rideId: string, status: any, cancellationReason?: string) => 
    apiClient.updateRideStatus(rideId, status, cancellationReason),
  cancelRide: (rideId: string, reason?: string) => apiClient.cancelRide(rideId, reason),
  updateDriverLocation: (rideId: string, lat: number, lng: number, heading?: number, speed?: number) => 
    apiClient.updateDriverLocation(rideId, lat, lng, heading, speed),
};
