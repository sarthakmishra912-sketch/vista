// Driver Onboarding API Service
// Contains all driver onboarding-specific API calls

export interface OnboardingStatus {
  driver_id: string;
  onboarding_status: string;
  current_step: string;
  is_verified: boolean;
  documents_submitted: boolean;
  documents_verified: boolean;
  can_start_rides: boolean;
  verification_notes?: string;
  pending_documents?: Array<{
    type: string;
    uploaded_at: string;
  }>;
}

export interface DocumentUploadResponse {
  success: boolean;
  data: {
    document_id: string;
    document_type: string;
    document_url: string;
    uploaded_at: string;
    next_step: string;
  };
}

class DriverOnboardingApiService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  // Set access token
  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  /**
   * Start driver onboarding process
   */
  async startOnboarding(): Promise<{ success: boolean; data: any }> {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] 🚗 START ONBOARDING API CALL`);

    try {
      const response = await fetch(`${this.baseUrl}/driver/onboarding/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`[${requestId}] ✅ START ONBOARDING SUCCESS`, data.data);
        return data;
      } else {
        throw new Error(data.message || 'Failed to start onboarding');
      }
    } catch (error) {
      console.error(`[${requestId}] ❌ START ONBOARDING ERROR`, error);
      throw error;
    }
  }

  /**
   * Update language preference
   */
  async updateLanguage(language: string): Promise<{ success: boolean; data: any }> {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] 🌐 UPDATE LANGUAGE API CALL`, { language });

    try {
      const response = await fetch(`${this.baseUrl}/driver/onboarding/language`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`[${requestId}] ✅ UPDATE LANGUAGE SUCCESS`);
        return data;
      } else {
        throw new Error(data.message || 'Failed to update language');
      }
    } catch (error) {
      console.error(`[${requestId}] ❌ UPDATE LANGUAGE ERROR`, error);
      throw error;
    }
  }

  /**
   * Update vehicle selection
   */
  async updateVehicle(vehicleType: string, serviceTypes: string[]): Promise<{ success: boolean; data: any }> {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] 🚗 UPDATE VEHICLE API CALL`, { vehicleType, serviceTypes });

    try {
      const response = await fetch(`${this.baseUrl}/driver/onboarding/vehicle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vehicleType, serviceTypes }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`[${requestId}] ✅ UPDATE VEHICLE SUCCESS`);
        return data;
      } else {
        throw new Error(data.message || 'Failed to update vehicle');
      }
    } catch (error) {
      console.error(`[${requestId}] ❌ UPDATE VEHICLE ERROR`, error);
      throw error;
    }
  }

  /**
   * Upload document
   */
  async uploadDocument(file: File, documentType: string): Promise<DocumentUploadResponse> {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] 📄 UPLOAD DOCUMENT API CALL`, { documentType, fileName: file.name });

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const response = await fetch(`${this.baseUrl}/driver/onboarding/document/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`[${requestId}] ✅ UPLOAD DOCUMENT SUCCESS`, data.data);
        return data;
      } else {
        throw new Error(data.message || 'Failed to upload document');
      }
    } catch (error) {
      console.error(`[${requestId}] ❌ UPLOAD DOCUMENT ERROR`, error);
      throw error;
    }
  }

  /**
   * Submit all documents for verification
   */
  async submitDocuments(): Promise<{ success: boolean; data: any }> {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] 📋 SUBMIT DOCUMENTS API CALL`);

    try {
      const response = await fetch(`${this.baseUrl}/driver/onboarding/documents/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`[${requestId}] ✅ SUBMIT DOCUMENTS SUCCESS`);
        return data;
      } else {
        throw new Error(data.message || 'Failed to submit documents');
      }
    } catch (error) {
      console.error(`[${requestId}] ❌ SUBMIT DOCUMENTS ERROR`, error);
      throw error;
    }
  }

  /**
   * Get onboarding status
   */
  async getOnboardingStatus(): Promise<OnboardingStatus> {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] 📊 GET ONBOARDING STATUS API CALL`);

    try {
      const response = await fetch(`${this.baseUrl}/driver/onboarding/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`[${requestId}] ✅ GET ONBOARDING STATUS SUCCESS`, data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get onboarding status');
      }
    } catch (error) {
      console.error(`[${requestId}] ❌ GET ONBOARDING STATUS ERROR`, error);
      throw error;
    }
  }

  /**
   * Verify driver (Admin only)
   */
  async verifyDriver(driverId: string, approved: boolean, notes?: string): Promise<{ success: boolean; data: any }> {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] ✅ VERIFY DRIVER API CALL`, { driverId, approved });

    try {
      const response = await fetch(`${this.baseUrl}/driver/onboarding/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driverId, approved, notes }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`[${requestId}] ✅ VERIFY DRIVER SUCCESS`);
        return data;
      } else {
        throw new Error(data.message || 'Failed to verify driver');
      }
    } catch (error) {
      console.error(`[${requestId}] ❌ VERIFY DRIVER ERROR`, error);
      throw error;
    }
  }
}

export const driverOnboardingApi = new DriverOnboardingApiService();
