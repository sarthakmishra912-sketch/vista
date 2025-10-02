// Driver API Service
// Contains all driver-specific API calls

interface DriverRegistrationData {
  email: string;
  password?: string;
  device_info?: {
    platform: string;
    user_agent: string;
    app_version?: string;
  };
}

interface DriverRegistrationResponse {
  success: boolean;
  driver_id: string;
  token: string;
  onboarding_status: 'pending' | 'documents_required' | 'verification_pending' | 'approved' | 'rejected';
  message: string;
}

interface DriverLoginData {
  email: string;
  password: string;
}

interface DriverProfile {
  driver_id: string;
  email: string;
  name?: string;
  phone?: string;
  license_number?: string;
  is_online?: boolean;
  vehicle_info?: {
    make: string;
    model: string;
    year: number;
    license_plate: string;
    color: string;
  };
  documents?: {
    license_verified: boolean;
    insurance_verified: boolean;
    vehicle_registration_verified: boolean;
  };
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  total_trips: number;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
}

class DriverApiService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    
    // For development: Always ensure we have a driver token
    if (!this.accessToken || this.accessToken.startsWith('mock-passenger-token-')) {
      this.setMockToken();
    }
  }

  // Set mock token for development
  private setMockToken() {
    // Clear any existing passenger tokens
    if (localStorage.getItem('accessToken')?.startsWith('mock-passenger-token-')) {
      localStorage.removeItem('accessToken');
      console.log('🧹 Cleared conflicting passenger token');
    }
    
    const mockToken = 'mock-driver-token-' + Date.now();
    this.accessToken = mockToken;
    localStorage.setItem('accessToken', mockToken);
    console.log('🚗 Set mock driver token for development:', mockToken);
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

  // Driver Registration
  async registerDriver(data: DriverRegistrationData): Promise<DriverRegistrationResponse> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${this.baseUrl}/api/v1/driver/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Platform': 'web',
        },
        body: JSON.stringify({
          ...data,
          device_info: {
            platform: 'web',
            user_agent: navigator.userAgent,
            app_version: '1.0.0',
            ...data.device_info
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Driver registration error:', error);
      
      // Mock response for development
      return {
        success: true,
        driver_id: `driver_${Date.now()}`,
        token: `mock_token_${Date.now()}`,
        onboarding_status: 'documents_required',
        message: 'Registration successful. Please upload required documents.'
      };
    }
  }

  // Driver Login
  async loginDriver(data: DriverLoginData): Promise<DriverRegistrationResponse> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${this.baseUrl}/api/v1/driver/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Driver login error:', error);
      
      // Mock response for development
      return {
        success: true,
        driver_id: `driver_existing_${Date.now()}`,
        token: `mock_token_${Date.now()}`,
        onboarding_status: 'approved',
        message: 'Login successful'
      };
    }
  }

  // Get Driver Profile
  async getDriverProfile(): Promise<DriverProfile> {
    const requestId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    
    console.log(`[${requestId}] 🚗 GET DRIVER PROFILE API CALL STARTED`);

    try {
      const response = await fetch(`${this.baseUrl}/driver/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (response.ok && data.success) {
        console.log(`[${requestId}] 🚗 GET DRIVER PROFILE SUCCESS`, {
          driverId: data.data.driver_id,
          rating: data.data.rating,
          totalTrips: data.data.total_trips,
          todayEarnings: data.data.earnings.today,
          duration: `${duration}ms`
        });
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch driver profile');
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] 🚗 GET DRIVER PROFILE ERROR`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      });
      
      // Fallback to mock data for development
      return {
        driver_id: 'mock-driver-id',
        email: 'driver@raahi.com',
        name: 'John Driver',
        phone: '+91 98765 43210',
        license_number: 'DL123456789',
        vehicle_info: {
          make: 'Maruti',
          model: 'Swift',
          year: 2022,
          license_plate: 'DL 01 AB 1234',
          color: 'White'
        },
        documents: {
          license_verified: true,
          insurance_verified: true,
          vehicle_registration_verified: true
        },
        status: 'active',
        rating: 4.8,
        total_trips: 142,
        earnings: {
          today: 2450,
          week: 15200,
          month: 48500,
          total: 125000
        }
      };
    }
  }

  // Update Driver Online Status
  async updateOnlineStatus(isOnline: boolean, location?: { latitude: number; longitude: number }): Promise<boolean> {
    const requestId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    
    console.log(`[${requestId}] 🚗 UPDATE DRIVER STATUS API CALL STARTED`, {
      online: isOnline,
      location
    });

    try {
      const response = await fetch(`${this.baseUrl}/driver/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          online: isOnline,
          location: location || {
            latitude: 28.6139,
            longitude: 77.2090
          }
        }),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (response.ok && data.success) {
        console.log(`[${requestId}] 🚗 UPDATE DRIVER STATUS SUCCESS`, {
          online: isOnline,
          message: data.message,
          duration: `${duration}ms`
        });
        return true;
      } else {
        throw new Error(data.message || 'Status update failed');
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] 🚗 UPDATE DRIVER STATUS ERROR`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      });
      return false;
    }
  }

  // Request Driver Support
  async requestSupport(driverId: string, issueType: string, description: string): Promise<boolean> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${this.baseUrl}/api/v1/driver/support`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getStoredToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driver_id: driverId,
          issue_type: issueType,
          description: description,
          timestamp: new Date().toISOString(),
          priority: 'medium'
        }),
      });

      if (!response.ok) {
        throw new Error(`Support request failed: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Driver support request error:', error);
      return false;
    }
  }

  // Get Driver Earnings
  async getDriverEarnings(): Promise<any> {
    const requestId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    
    console.log(`[${requestId}] 🚗 GET DRIVER EARNINGS API CALL STARTED`);

    try {
      const response = await fetch(`${this.baseUrl}/driver/earnings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (response.ok && data.success) {
        console.log(`[${requestId}] 🚗 GET DRIVER EARNINGS SUCCESS`, {
          todayEarnings: data.data.today.amount,
          todayTrips: data.data.today.trips,
          totalEarnings: data.data.total.amount,
          duration: `${duration}ms`
        });
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch driver earnings');
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] 🚗 GET DRIVER EARNINGS ERROR`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      });
      
      // Fallback to mock data
      return {
        today: { amount: 2450, trips: 8, hours_online: 6.5, average_per_trip: 306.25 },
        week: { amount: 15200, trips: 45, hours_online: 42, average_per_trip: 337.78 },
        month: { amount: 48500, trips: 142, hours_online: 168, average_per_trip: 341.55 },
        total: { amount: 125000, trips: 350, hours_online: 420, average_per_trip: 357.14 }
      };
    }
  }

  // Get Driver Trips
  async getDriverTrips(page: number = 1, limit: number = 10): Promise<any> {
    const requestId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    
    console.log(`[${requestId}] 🚗 GET DRIVER TRIPS API CALL STARTED`, {
      page,
      limit
    });

    try {
      const response = await fetch(`${this.baseUrl}/driver/trips?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (response.ok && data.success) {
        console.log(`[${requestId}] 🚗 GET DRIVER TRIPS SUCCESS`, {
          tripsReturned: data.data.trips.length,
          totalTrips: data.data.pagination.total,
          page,
          duration: `${duration}ms`
        });
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch driver trips');
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] 🚗 GET DRIVER TRIPS ERROR`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      });
      
      // Fallback to mock data
      return {
        trips: [],
        pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      };
    }
  }
}

export const driverApi = new DriverApiService();
export type { DriverRegistrationData, DriverRegistrationResponse, DriverProfile };