import React, { useState } from 'react';
import svgPaths from "../../imports/svg-8j8aca4rop";
import imgFrame from "figma:asset/7f47ed867f69a74c7c3460960b62538febb7f450.png";
import imgFrame1 from "figma:asset/4e95da5f9e6ec1d32f897fbff5c28b62b3c1d8ed.png";
import imgFrame2 from "figma:asset/476ff6f1a6a1f52a02c7ac15d243763b00d931ee.png";

interface DriverVehicleSelectionScreenProps {
  onContinue: (vehicleData: { 
    vehicleType: string; 
    serviceTypes: string[]; 
    expectedEarnings: { daily: number; hourly: number } 
  }) => void;
  onBack: () => void;
  onSupport: () => void;
  userEmail?: string | null;
}

interface VehicleOption {
  id: string;
  name: string;
  description: string;
  image: string;
  serviceTypes: { id: string; name: string; available: boolean }[];
  earnings: { daily: number; hourly: number };
  selected: boolean;
}

const vehicleOptions: VehicleOption[] = [
  {
    id: 'commercial_car',
    name: 'Commercial Car',
    description: 'You have a car that you wish to drive or employ others to drive',
    image: imgFrame,
    serviceTypes: [
      { id: 'fleet', name: 'Fleet', available: true },
      { id: 'trips', name: 'Trips', available: false }
    ],
    earnings: { daily: 3000, hourly: 375 },
    selected: false
  },
  {
    id: 'motorbike',
    name: 'Motorbike',
    description: 'You wish to drive a 2 wheeler to make Rescue Trips or Deliveries',
    image: imgFrame1,
    serviceTypes: [
      { id: 'rescue_trips', name: 'Rescue Trips', available: false },
      { id: 'delivery', name: 'Delivery', available: true }
    ],
    earnings: { daily: 2920, hourly: 290 },
    selected: false
  },
  {
    id: 'driver_only',
    name: 'Driver',
    description: 'You wish to drive a 2 wheeler to make Rescue Trips or Deliveries',
    image: imgFrame2,
    serviceTypes: [
      { id: 'rescue_trips', name: 'Rescue Trips', available: false },
      { id: 'delivery', name: 'Delivery', available: true }
    ],
    earnings: { daily: 2920, hourly: 0 }, // Driver only has daily rate
    selected: false
  }
];

export default function DriverVehicleSelectionScreen({ 
  onContinue, 
  onBack, 
  onSupport,
  userEmail 
}: DriverVehicleSelectionScreenProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('commercial_car');
  const [vehicles, setVehicles] = useState<VehicleOption[]>(
    vehicleOptions.map(v => ({ ...v, selected: v.id === 'commercial_car' }))
  );

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setVehicles(prev => 
      prev.map(v => ({ ...v, selected: v.id === vehicleId }))
    );
  };

  const handleContinue = async () => {
    const selectedVehicleData = vehicles.find(v => v.selected);
    if (!selectedVehicleData) return;

    const vehicleData = {
      vehicleType: selectedVehicleData.id,
      serviceTypes: selectedVehicleData.serviceTypes
        .filter(service => service.available)
        .map(service => service.id),
      expectedEarnings: selectedVehicleData.earnings
    };

    try {
      // TODO: Save vehicle selection to API
      // POST /api/driver/vehicle-selection
      // {
      //   driver_id: localStorage.getItem('raahi_driver_id'),
      //   vehicle_type: vehicleData.vehicleType,
      //   service_types: vehicleData.serviceTypes,
      //   expected_earnings: vehicleData.expectedEarnings,
      //   timestamp: new Date().toISOString()
      // }

      // For now, save to localStorage for development
      localStorage.setItem('raahi_driver_vehicle_type', vehicleData.vehicleType);
      localStorage.setItem('raahi_driver_service_types', JSON.stringify(vehicleData.serviceTypes));
      localStorage.setItem('raahi_driver_expected_earnings', JSON.stringify(vehicleData.expectedEarnings));

      onContinue(vehicleData);
    } catch (error) {
      console.error('Error saving vehicle selection:', error);
      // Still proceed with local storage data
      onContinue(vehicleData);
    }
  };

  const handleSupportClick = () => {
    // TODO: Implement driver support system for vehicle selection
    // Could open specific help for vehicle types and earning estimates
    onSupport();
  };

  const renderVehicleCard = (vehicle: VehicleOption) => (
    <div 
      key={vehicle.id}
      className={`bg-white relative rounded-2xl shrink-0 w-full cursor-pointer transition-all duration-200 ${
        vehicle.selected 
          ? 'border-2 border-[#38A35F] shadow-sm' 
          : 'border border-[#e5e5e5] hover:border-[#a09696] hover:shadow-sm'
      }`}
      onClick={() => handleVehicleSelect(vehicle.id)}
    >
      <div className="relative size-full">
        <div className="box-border flex flex-col gap-3 items-start justify-start p-4 relative w-full">
          
          {/* Header with service types and selection indicator */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <div className="flex gap-1.5 items-center justify-start relative shrink-0">
              {vehicle.serviceTypes.map((service) => (
                <div
                  key={service.id}
                  className={`box-border flex items-center justify-center px-2.5 py-1 relative rounded-lg shrink-0 ${
                    service.available 
                      ? service.id === 'fleet' 
                        ? 'bg-[#276ff1]' 
                        : 'bg-[#38a35f]'
                      : 'bg-[#9ca3af]'
                  }`}
                >
                  <div 
                    className="text-xs text-white font-medium"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {service.name}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Selection Indicator */}
            <div className="relative shrink-0 w-6 h-6">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                vehicle.selected 
                  ? 'border-[#38A35F] bg-[#38A35F]' 
                  : 'border-[#d1d5db] bg-white'
              }`}>
                {vehicle.selected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M20 6L9 17L4 12" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="flex gap-3 items-center justify-between relative shrink-0 w-full">
            <div className="flex-1 flex flex-col gap-1.5 items-start justify-start">
              
              {/* Vehicle Name */}
              <div 
                className="text-lg font-medium text-black"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {vehicle.name}
              </div>

              {/* Vehicle Description */}
              <div 
                className="text-sm text-[#6b7280] leading-snug"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {vehicle.id === 'commercial_car' ? (
                  <>
                    <span className="font-medium">Vehicle: </span>
                    <span>{vehicle.description}</span>
                  </>
                ) : (
                  vehicle.description
                )}
              </div>
            </div>

            {/* Vehicle Image */}
            <div className="shrink-0">
              <img 
                src={vehicle.image} 
                alt={vehicle.name}
                className={`${
                  vehicle.id === 'commercial_car' 
                    ? 'h-12 w-14' 
                    : vehicle.id === 'motorbike'
                    ? 'h-14 w-16'
                    : 'h-14 w-16'
                } object-contain`}
              />
            </div>
          </div>

          {/* Earnings Information */}
          <div className="flex gap-2 items-center justify-start relative shrink-0 w-full overflow-x-auto">
            {/* Daily Earnings */}
            <div className="bg-[rgba(56,163,95,0.08)] flex flex-col gap-0.5 items-start justify-center px-3 py-2 relative rounded-lg shrink-0 border border-[#e5e5e5] min-w-0">
              <div 
                className="text-xs text-[#4b5563] font-normal whitespace-nowrap"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Daily Earning
              </div>
              <div 
                className="text-sm font-semibold text-[#38a35f] whitespace-nowrap"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                ₹{vehicle.earnings.daily.toLocaleString()} / 8hrs
              </div>
            </div>

            {/* Hourly Earnings (if available) */}
            {vehicle.earnings.hourly > 0 && (
              <div className="bg-[rgba(56,163,95,0.08)] flex flex-col gap-0.5 items-start justify-center px-3 py-2 relative rounded-lg shrink-0 border border-[#e5e5e5] min-w-0">
                <div 
                  className="text-xs text-[#4b5563] font-normal whitespace-nowrap"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Hourly Earning
                </div>
                <div 
                  className="text-sm font-semibold text-[#38a35f] whitespace-nowrap"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  ₹{vehicle.earnings.hourly}/hr
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white relative min-h-screen w-full">
      <div className="relative h-full">
        <div className="box-border flex flex-col gap-6 items-start justify-start pb-20 pt-16 px-4 relative h-full min-h-screen">
          


          {/* Back button - positioned at top left above header */}
          <button
            onClick={onBack}
            className="absolute top-6 left-4 p-1.5 rounded-full z-20"
            style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#11211e" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>

          {/* Header with Raahi branding and Support */}
          <div 
            className="relative rounded-2xl shrink-0 w-full"
            style={{ backgroundColor: '#f6efd8' }}
          >
            <div className="flex flex-row items-center relative size-full">
              <div className="box-border flex items-center justify-between px-4 py-4 relative w-full">
                <div 
                  className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-2xl text-center text-nowrap"
                  style={{ 
                    fontFamily: 'Samarkan, sans-serif',
                    color: '#11211e'
                  }}
                >
                  <p className="leading-[normal] whitespace-pre">Raahi</p>
                </div>
                
                {/* Support Button */}
                <button
                  onClick={handleSupportClick}
                  className="box-border flex gap-1.5 h-8 items-center justify-center px-3 py-2 relative rounded-lg shrink-0"
                  style={{ backgroundColor: '#282828' }}
                >
                  <div 
                    className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-sm text-nowrap"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '500',
                      color: 'white'
                    }}
                  >
                    <p className="leading-[normal] whitespace-pre">Support</p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-4 items-start justify-start relative shrink-0 w-full">
            
            {/* Title Section */}
            <div className="relative shrink-0 w-full px-2">
              <div 
                className="relative shrink-0 w-full text-xl font-medium mb-1"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#080a24'
                }}
              >
                Choose how you want to earn with Raahi
              </div>
              <div 
                className="relative shrink-0 w-full text-sm"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '400',
                  color: '#6b7280'
                }}
              >
                Decide when, where and how you want to earn.
              </div>
            </div>

            {/* Vehicle Options */}
            <div className="flex flex-col gap-3 max-h-[65vh] items-start justify-start overflow-x-clip overflow-y-auto relative shrink-0 w-full scrollbar-hide">
              {vehicles.map(vehicle => renderVehicleCard(vehicle))}
            </div>
          </div>

          {/* Continue Button - Fixed at bottom */}
          <div className="absolute box-border flex flex-col items-start justify-start left-0 px-4 py-4 shadow-[0px_-2px_10px_0px_rgba(0,0,0,0.1)] bottom-0 w-full bg-white">
            <button
              onClick={handleContinue}
              disabled={!selectedVehicle}
              className="relative rounded-2xl shrink-0 w-full disabled:opacity-50 transition-opacity py-3 px-6"
              style={{ backgroundColor: '#282828' }}
            >
              <div 
                className="text-base font-medium text-white text-center"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Continue
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}