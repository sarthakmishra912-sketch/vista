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
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
  private apiKey = import.meta.env.VITE_API_KEY || 'your-api-key-here';

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
  async getDriverProfile(driverId: string): Promise<DriverProfile> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${this.baseUrl}/api/v1/driver/${driverId}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getStoredToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Driver profile fetch error:', error);
      
      // Mock response for development
      return {
        driver_id: driverId,
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
          today: 850,
          week: 5200,
          month: 18500,
          total: 75000
        }
      };
    }
  }

  // Update Driver Online Status
  async updateOnlineStatus(driverId: string, isOnline: boolean): Promise<boolean> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${this.baseUrl}/api/v1/driver/${driverId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.getStoredToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          online: isOnline,
          timestamp: new Date().toISOString(),
          location: {
            // TODO: Get actual location
            latitude: 28.6139,
            longitude: 77.2090
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Status update failed: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Driver status update error:', error);
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

  // Helper method to get stored token
  private getStoredToken(): string {
    return localStorage.getItem('raahi_driver_token') || '';
  }

  // Helper method to store token
  setStoredToken(token: string): void {
    localStorage.setItem('raahi_driver_token', token);
  }

  // Helper method to clear stored data
  clearStoredData(): void {
    localStorage.removeItem('raahi_driver_token');
    localStorage.removeItem('raahi_driver_email');
    localStorage.removeItem('raahi_driver_id');
  }
}

export const driverApi = new DriverApiService();
export type { DriverRegistrationData, DriverRegistrationResponse, DriverProfile };