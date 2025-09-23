import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PricingResponse } from '../services/api';
import { pricingService, PricingRequest } from '../services/pricingService';

interface PricingContextType {
  pricing: PricingResponse | null;
  isLoading: boolean;
  error: string | null;
  calculateFare: (request: PricingRequest) => Promise<void>;
  getNearbyDrivers: (lat: number, lng: number, radius?: number) => Promise<any[]>;
  getSurgeAreas: () => Promise<any[]>;
  getPricingRules: () => Promise<any>;
  clearPricing: () => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

interface PricingProviderProps {
  children: ReactNode;
}

export const PricingProvider: React.FC<PricingProviderProps> = ({ children }) => {
  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateFare = async (request: PricingRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const pricing = await pricingService.calculateFare(request);
      setPricing(pricing);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate fare');
      console.error('Pricing calculation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getNearbyDrivers = async (lat: number, lng: number, radius: number = 5) => {
    try {
      return await pricingService.getNearbyDrivers(lat, lng, radius);
    } catch (err) {
      console.error('Get nearby drivers failed:', err);
      throw err;
    }
  };

  const getSurgeAreas = async () => {
    try {
      return await pricingService.getSurgeAreas();
    } catch (err) {
      console.error('Get surge areas failed:', err);
      throw err;
    }
  };

  const getPricingRules = async () => {
    try {
      return await pricingService.getPricingRules();
    } catch (err) {
      console.error('Get pricing rules failed:', err);
      throw err;
    }
  };

  const clearPricing = () => {
    setPricing(null);
    setError(null);
  };

  const value: PricingContextType = {
    pricing,
    isLoading,
    error,
    calculateFare,
    getNearbyDrivers,
    getSurgeAreas,
    getPricingRules,
    clearPricing,
  };

  return (
    <PricingContext.Provider value={value}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = (): PricingContextType => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};
