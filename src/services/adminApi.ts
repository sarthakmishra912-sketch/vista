import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface AdminDriver {
  driver_id: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
  };
  onboarding_status: string;
  vehicle_info: {
    type: string | null;
    model: string | null;
    number: string | null;
    color: string | null;
    year: number | null;
  };
  documents: DriverDocument[];
  documents_summary: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
    all_verified: boolean;
  };
  submitted_at: string | null;
  verified_at: string | null;
  preferred_language: string | null;
  service_types: string[];
  verification_notes: string | null;
  is_verified: boolean;
}

interface DriverDocument {
  id: string;
  type: string;
  url: string;
  name: string | null;
  size: number | null;
  is_verified: boolean;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  uploaded_at: string;
}

interface PendingDriversResponse {
  success: boolean;
  data: {
    drivers: AdminDriver[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      has_more: boolean;
    };
  };
}

interface DriverDetailsResponse {
  success: boolean;
  data: AdminDriver & {
    rating: number | null;
    total_trips: number;
    is_available: boolean;
    current_latitude: number | null;
    current_longitude: number | null;
  };
}

interface VerifyDocumentResponse {
  success: boolean;
  message: string;
  data: {
    document_id: string;
    document_type: string;
    is_verified: boolean;
    verified_at: string | null;
    rejection_reason: string | null;
    driver_status: {
      all_documents_verified: boolean;
      onboarding_status: string;
      is_verified: boolean;
      can_start_rides: boolean;
    };
  };
}

interface StatisticsResponse {
  success: boolean;
  data: {
    drivers: {
      total: number;
      verified: number;
      pending_verification: number;
      rejected: number;
    };
    documents: {
      total: number;
      verified: number;
      pending: number;
    };
  };
}

class AdminApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/admin`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('raahi_auth_token') || 'mock-driver-token-12345';
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Get all drivers pending document verification
   */
  async getPendingDrivers(params?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<PendingDriversResponse> {
    const response = await this.api.get('/drivers/pending', { params });
    return response.data;
  }

  /**
   * Get detailed driver information
   */
  async getDriverDetails(driverId: string): Promise<DriverDetailsResponse> {
    const response = await this.api.get(`/drivers/${driverId}`);
    return response.data;
  }

  /**
   * Verify or reject a specific document
   */
  async verifyDocument(
    documentId: string,
    approved: boolean,
    rejectionReason?: string
  ): Promise<VerifyDocumentResponse> {
    const response = await this.api.post(`/documents/${documentId}/verify`, {
      approved,
      rejection_reason: rejectionReason,
    });
    return response.data;
  }

  /**
   * Approve or reject all documents for a driver at once
   */
  async verifyAllDocuments(
    driverId: string,
    approved: boolean,
    notes?: string
  ): Promise<any> {
    const response = await this.api.post(`/drivers/${driverId}/verify-all`, {
      approved,
      notes,
    });
    return response.data;
  }

  /**
   * Get admin dashboard statistics
   */
  async getStatistics(): Promise<StatisticsResponse> {
    const response = await this.api.get('/statistics');
    return response.data;
  }
}

export const adminApi = new AdminApiService();
export type { AdminDriver, DriverDocument, PendingDriversResponse, VerifyDocumentResponse, StatisticsResponse };

