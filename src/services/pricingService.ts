import { pricingAPI, PricingResponse } from './api';

export interface PricingRequest {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  vehicleType?: string;
  scheduledTime?: string;
}

export interface NearbyDriver {
  id: string;
  firstName: string;
  lastName?: string;
  profileImage?: string;
  rating: number;
  vehicleNumber: string;
  vehicleModel: string;
  phone: string;
  distance: number;
  currentLatitude: number;
  currentLongitude: number;
}

export interface SurgeArea {
  id: string;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radius: number;
  multiplier: number;
}

export interface PricingRule {
  id: string;
  name: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  surgeMultiplier: number;
  peakHourMultiplier: number;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
}

class PricingService {
  private static instance: PricingService;
  private currentPricing: PricingResponse | null = null;
  private nearbyDrivers: NearbyDriver[] = [];
  private surgeAreas: SurgeArea[] = [];
  private pricingRules: PricingRule | null = null;

  private constructor() {}

  static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  async calculateFare(request: PricingRequest): Promise<PricingResponse> {
    try {
      const response = await pricingAPI.calculateFare(request);
      
      if (response.success && response.data) {
        this.currentPricing = response.data;
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to calculate fare');
      }
    } catch (error) {
      console.error('Calculate fare error:', error);
      throw error;
    }
  }

  async getNearbyDrivers(
    lat: number,
    lng: number,
    radius: number = 5
  ): Promise<NearbyDriver[]> {
    try {
      const response = await pricingAPI.getNearbyDrivers(lat, lng, radius);
      
      if (response.success && response.data) {
        this.nearbyDrivers = response.data.drivers;
        return response.data.drivers;
      } else {
        throw new Error(response.message || 'Failed to get nearby drivers');
      }
    } catch (error) {
      console.error('Get nearby drivers error:', error);
      throw error;
    }
  }

  async getSurgeAreas(): Promise<SurgeArea[]> {
    try {
      const response = await pricingAPI.getSurgeAreas();
      
      if (response.success && response.data) {
        this.surgeAreas = response.data.surgeAreas;
        return response.data.surgeAreas;
      } else {
        throw new Error(response.message || 'Failed to get surge areas');
      }
    } catch (error) {
      console.error('Get surge areas error:', error);
      throw error;
    }
  }

  async getPricingRules(): Promise<PricingRule> {
    try {
      const response = await pricingAPI.getPricingRules();
      
      if (response.success && response.data) {
        this.pricingRules = response.data;
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get pricing rules');
      }
    } catch (error) {
      console.error('Get pricing rules error:', error);
      throw error;
    }
  }

  getCurrentPricing(): PricingResponse | null {
    return this.currentPricing;
  }

  getNearbyDriversCache(): NearbyDriver[] {
    return this.nearbyDrivers;
  }

  getSurgeAreasCache(): SurgeArea[] {
    return this.surgeAreas;
  }

  getPricingRulesCache(): PricingRule | null {
    return this.pricingRules;
  }

  clearCache(): void {
    this.currentPricing = null;
    this.nearbyDrivers = [];
    this.surgeAreas = [];
    this.pricingRules = null;
  }

  // Real-time pricing updates
  async refreshPricing(request: PricingRequest): Promise<PricingResponse> {
    return this.calculateFare(request);
  }

  // Check if current pricing is still valid (not older than 5 minutes)
  isPricingValid(): boolean {
    if (!this.currentPricing) return false;
    
    // In a real implementation, you'd check the timestamp
    // For now, we'll assume pricing is valid for 5 minutes
    return true;
  }
}

export const pricingService = PricingService.getInstance();
export default pricingService;
