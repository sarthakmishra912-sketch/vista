import React, { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { pricingService } from '../services/pricingService';
import { geocodingService, GeocodingResult, PlaceSuggestion } from '../services/geocodingService';
import { realTimeService } from '../services/realTimeService';
import svgPaths from "../imports/svg-u42y27j2nw";
import arrowSvgPaths from "../imports/svg-4olgt74d78";
import imgFrame from "figma:asset/4e95da5f9e6ec1d32f897fbff5c28b62b3c1d8ed.png";
import imgFrame1 from "figma:asset/516e77515feb8b0da14eb9d08100d04603ad8beb.png";
import imgFrame2 from "figma:asset/ccab72f0e9bf12b4ad08c152b84cbd87b9bb0945.png";
import imgFrame3 from "figma:asset/e22810488a2dea398cea28b8afe2e029a45b5b57.png";
import imgImage from "figma:asset/176ba6c12ab7f022834992fb78872f1e9feeb9a4.png";





// Enhanced addresses for Delhi NCR (works without Google Places API billing)
const ENHANCED_DUMMY_ADDRESSES = [
  // Delhi locations
  "Connaught Place, New Delhi",
  "India Gate, New Delhi", 
  "Red Fort, New Delhi",
  "Chandni Chowk, New Delhi",
  "Karol Bagh, New Delhi",
  "Lajpat Nagar, New Delhi",
  "Rajouri Garden, New Delhi",
  "Paharganj, New Delhi",
  "Khan Market, New Delhi",
  "South Extension, New Delhi",
  "Hauz Khas, New Delhi",
  "Malviya Nagar, New Delhi",
  "Saket, New Delhi",
  "Vasant Kunj, New Delhi",
  "Dwarka, New Delhi",
  "Rohini, New Delhi",
  "Janakpuri, New Delhi",
  "Pitampura, New Delhi",
  "Sarita Vihar, New Delhi",
  "Okhla, New Delhi",
  "Mayur Vihar, New Delhi",
  "Shalimar Bagh, New Delhi",
  "Nehru Place, New Delhi",
  "Greater Kailash, New Delhi",
  "Lotus Temple, New Delhi",
  
  // Gurgaon locations
  "DLF Cyber City, Gurgaon",
  "DLF Phase 1, Gurgaon",
  "DLF Phase 2, Gurgaon", 
  "DLF Phase 3, Gurgaon",
  "Sector 29, Gurgaon",
  "Sector 14, Gurgaon",
  "MG Road, Gurgaon",
  "Cyber Hub, Gurgaon",
  "Sector 17, Gurgaon",
  "Sector 15, Gurgaon",
  "Sector 21, Gurgaon",
  "Sector 25, Gurgaon",
  "Sector 44, Gurgaon",
  "Golf Course Road, Gurgaon",
  "Ambience Mall, Gurgaon",
  
  // Noida locations
  "Sector 18, Noida",
  "Sector 62, Noida",
  "Sector 137, Noida",
  "Greater Noida West",
  "Knowledge Park, Greater Noida",
  "Pari Chowk, Greater Noida",
  "Sector 15, Noida",
  "Sector 16, Noida",
  "Sector 63, Noida",
  "Sector 125, Noida",
  "DLF Mall of India, Noida",
  
  // Airports
  "Indira Gandhi International Airport, New Delhi",
  "Delhi Airport Terminal 1",
  "Delhi Airport Terminal 2", 
  "Delhi Airport Terminal 3",
  
  // Railway Stations
  "New Delhi Railway Station",
  "Old Delhi Railway Station",
  "Nizamuddin Railway Station",
  "Anand Vihar Railway Station",
  
  // Metro Stations
  "Rajiv Chowk Metro Station",
  "Central Secretariat Metro Station",
  "Kashmere Gate Metro Station",
  "Dilshad Garden Metro Station",
  "Vaishali Metro Station",
  "Botanical Garden Metro Station",
  
  // Malls
  "Select City Walk Mall, Saket",
  "DLF Mall of India, Noida",
  "Ambience Mall, Gurgaon"
];

// Known address coordinates for better accuracy (works without Geocoding API)
const KNOWN_ADDRESSES = {
  "Connaught Place, New Delhi": { lat: 28.6315, lng: 77.2167 },
  "India Gate, New Delhi": { lat: 28.6129, lng: 77.2295 },
  "Red Fort, New Delhi": { lat: 28.6562, lng: 77.2410 },
  "Chandni Chowk, New Delhi": { lat: 28.6517, lng: 77.2312 },
  "Karol Bagh, New Delhi": { lat: 28.6517, lng: 77.1909 },
  "Lajpat Nagar, New Delhi": { lat: 28.5679, lng: 77.2431 },
  "Rajouri Garden, New Delhi": { lat: 28.6408, lng: 77.1206 },
  "DLF Cyber City, Gurgaon": { lat: 28.5022, lng: 77.0958 },
  "DLF Phase 1, Gurgaon": { lat: 28.5022, lng: 77.0958 },
  "DLF Phase 2, Gurgaon": { lat: 28.5022, lng: 77.0958 },
  "DLF Phase 3, Gurgaon": { lat: 28.5022, lng: 77.0958 },
  "Sector 18, Noida": { lat: 28.6139, lng: 77.2090 },
  "Sector 62, Noida": { lat: 28.6139, lng: 77.2090 },
  "Indira Gandhi International Airport, New Delhi": { lat: 28.5562, lng: 77.1000 },
  "New Delhi Railway Station": { lat: 28.6428, lng: 77.2207 },
  "Rajiv Chowk Metro Station": { lat: 28.6315, lng: 77.2167 }
};

function LocationDropdown({ addresses, onSelect, isVisible, searchTerm = "" }) {
  if (!isVisible) {
    return null;
  }
  
  // For Google Places suggestions, we don't need to filter since they're already filtered
  const displayAddresses = addresses.slice(0, 8);
  
  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-[#e0e0e0] rounded-lg shadow-lg max-h-[200px] overflow-y-auto scrollbar-hide z-50 mt-1">
      {displayAddresses.length > 0 ? (
        displayAddresses.map((address, index) => (
          <button
            key={index}
            onClick={() => onSelect(address)}
            className="w-full text-left px-4 py-3 hover:bg-[#f8f8f8] transition-colors border-b border-[#f0f0f0] last:border-b-0 flex items-center gap-3"
          >
            <div className="w-5 h-5 text-[#CF923D] flex-shrink-0">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="font-['Poppins:Regular',_sans-serif] text-[#333333] text-[16px] flex-1">
              {address}
            </div>
          </button>
        ))
      ) : (
        <div className="px-4 py-3 text-[#999999] font-['Poppins:Regular',_sans-serif] text-[16px] flex items-center gap-3">
          <div className="w-5 h-5 text-[#999999] flex-shrink-0">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          No addresses found
        </div>
      )}
    </div>
  );
}

// Shimmer effect component
function ShimmerEffect({ className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded"></div>
    </div>
  );
}

// Shimmer vehicle card component
function ShimmerVehicleCard() {
  return (
    <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <ShimmerEffect className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <ShimmerEffect className="h-4 w-24 rounded" />
            <ShimmerEffect className="h-3 w-32 rounded" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <ShimmerEffect className="h-5 w-16 rounded ml-auto" />
          <ShimmerEffect className="h-3 w-20 rounded ml-auto" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <ShimmerEffect className="h-3 w-24 rounded" />
        <ShimmerEffect className="h-3 w-16 rounded" />
      </div>
    </div>
  );
}

function LocationInputs({ 
  pickupLocation, 
  dropLocation, 
  onPickupChange, 
  onDropChange, 
  onBack,
  suggestedLocations,
  showSuggestions,
  activeInput,
  onLocationSelect,
  isLocationChanging,
  onGetCurrentLocation,
  isGettingCurrentLocation
}) {
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);
  
  const handlePickupFocus = () => {
    setShowPickupDropdown(true);
    setShowDropDropdown(false);
  };
  
  const handleDropFocus = () => {
    setShowDropDropdown(true);
    setShowPickupDropdown(false);
  };
  
  const handlePickupSelect = (address) => {
    onLocationSelect('pickup', address);
    setShowPickupDropdown(false);
  };

  const handleDropSelect = (address) => {
    onLocationSelect('drop', address);
    setShowDropDropdown(false);
  };
  
  const handleClickOutside = (e) => {
    // Close dropdowns when clicking outside
    if (!e.target.closest('.location-input-container')) {
      setShowPickupDropdown(false);
      setShowDropDropdown(false);
    }
  };
  
  // Add click outside listener
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  return (
    <div className="absolute bg-[#ffffff] box-border content-stretch flex gap-4 items-end justify-start left-[20px] right-[20px] px-[30px] py-[25px] rounded-[25px] top-[20px] shadow-lg z-50 location-input-container">
      <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0 w-full">

        
        {/* Pickup Location */}
        <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full">
          <div className="relative shrink-0 size-[24px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
              <path d={svgPaths.p600e630} fill="white" />
              <path d={svgPaths.p30556c80} stroke="#CF923D" strokeWidth="6" />
            </svg>
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => onPickupChange(e.target.value)}
              onFocus={handlePickupFocus}
              placeholder="Enter pickup location or use current location"
              className="font-['Poppins:Regular',_sans-serif] text-[#656565] text-[18px] bg-transparent border-none outline-none w-full placeholder:text-[#656565] pr-12"
            />
            
            {/* Current Location Button */}
            <button
              onClick={() => onGetCurrentLocation && onGetCurrentLocation('pickup')}
              disabled={isGettingCurrentLocation}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#CF923D] rounded-full flex items-center justify-center hover:bg-[#B8822A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Use current location"
            >
              {isGettingCurrentLocation ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
            
            {isLocationChanging && activeInput === 'pickup' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite] rounded"></div>
            )}
            <LocationDropdown
              addresses={suggestedLocations.length > 0 ? suggestedLocations : ENHANCED_DUMMY_ADDRESSES}
              onSelect={handlePickupSelect}
              isVisible={showPickupDropdown && showSuggestions}
              searchTerm={pickupLocation}
            />
          </div>
        </div>
        
        {/* Separator Line */}
        <div className="h-[1px] bg-[#EDEDED] w-full"></div>
        
        {/* Drop Location */}
        <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full">
          <div className="h-[30px] w-[24px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 37">
              <path d={svgPaths.p23784500} fill="black" />
            </svg>
          </div>
          <div className="relative flex-1">
            <input
              id="destination-autocomplete-input"
              type="text"
              value={dropLocation}
              onChange={(e) => onDropChange(e.target.value)}
              onFocus={handleDropFocus}
              placeholder="Where to?"
              autoComplete="off"
              className="font-['Poppins:Regular',_sans-serif] text-[#656565] text-[18px] bg-transparent border-none outline-none w-full placeholder:text-[#656565]"
            />
            {isLocationChanging && activeInput === 'drop' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-4 h-4 border-2 border-[#CF923D] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <LocationDropdown
              addresses={suggestedLocations.length > 0 ? suggestedLocations : ENHANCED_DUMMY_ADDRESSES}
              onSelect={handleDropSelect}
              isVisible={showDropDropdown && showSuggestions}
              searchTerm={dropLocation}
            />
          </div>
        </div>
      </div>
      
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="shrink-0 w-10 h-10 bg-[#f5f5f5] rounded-full flex items-center justify-center hover:bg-[#e8e8e8] transition-colors active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

    </div>
  );
}

function VehicleOption({ 
  type, 
  title, 
  description, 
  price, 
  timeAway, 
  pickupTime, 
  image, 
  isSelected, 
  onSelect,
  isShimmer = false
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-2xl border-2 transition-all ${
        isSelected 
          ? 'border-[#cf923d] bg-[#cf923d]/5' 
          : 'border-[#505050] bg-white hover:border-[#cf923d]/50'
      }`}
    >
      <div className="space-y-4">
        {/* Vehicle Info */}
        <div className="flex items-start justify-between">
          <div className="flex gap-4 items-center">
            <div className="h-[70px] w-[80px] shrink-0">
              <div 
                className="bg-[position:50%_50%,_53.92%_34.31%] bg-no-repeat bg-size-[cover,113.76%_121.18%] h-full w-full" 
                style={{ backgroundImage: image }} 
              />
            </div>
            <div className="text-left">
              <div className="font-['Poppins:Medium',_sans-serif] text-[#000000] text-[20px] mb-1">
                {title}
              </div>
              <div className="font-['Poppins:Regular',_sans-serif] text-[#656565] text-[14px]">
                {description}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-['Poppins:Regular',_sans-serif] text-[#000000] text-[24px]">
              {isShimmer ? (
                <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-6 w-20 rounded ml-auto"></div>
              ) : (
                price
              )}
            </div>
            <div className="font-['Poppins:Regular',_sans-serif] text-[#000000] text-[12px]">
              {isShimmer ? (
                <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-3 w-16 rounded ml-auto"></div>
              ) : (
                timeAway
              )}
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0]">
          <div className="font-['Poppins:Regular',_sans-serif] text-[#545454] text-[12px]">
            Pickup by {pickupTime}
          </div>
          <div className="bg-[#f1f1f1] flex gap-2 items-center px-3 py-1 rounded-full">
            <div className="bg-[#ec932d] rounded-full flex items-center justify-center size-[16px]">
              <span className="font-['Poppins:Regular',_sans-serif] text-[#ffffff] text-[10px]">i</span>
            </div>
            <span className="font-['Poppins:Regular',_sans-serif] text-[#424242] text-[11px]">
              Experienced and Authorized Drivers
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function DriverCountSelector({ count, onIncrease, onDecrease, onToggleExtra, needExtraDrivers, isEnabled = true }) {
  return (
    <div className={`rounded-[13px] p-4 space-y-3 transition-all ${
      isEnabled 
        ? 'bg-[#f7efe4]' 
        : 'bg-[#f5f5f5] opacity-60'
    }`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className={`font-['Poppins:Medium',_sans-serif] text-[16px] ${
            isEnabled ? 'text-[#292929]' : 'text-[#8a8a8a]'
          }`}>
            Select Number of Drivers
          </div>
          {isEnabled ? (
            <div className="flex items-center gap-3">
              <span className="font-['Poppins:Regular',_sans-serif] text-[12px] text-[#292929]">
                Don't Need extra Drivers?
              </span>
              <button
                onClick={onToggleExtra}
                className="h-[20px] w-[40px] rounded-full relative transition-colors bg-[#CF923D]"
              >
                <div className={`absolute w-[14px] h-[14px] rounded-full transition-all duration-200 bg-white top-[3px] ${
                  needExtraDrivers ? 'translate-x-[23px]' : 'translate-x-[3px]'
                }`} />
              </button>
            </div>
          ) : (
            <div className="text-[12px] text-[#8a8a8a] font-['Poppins:Regular',_sans-serif]">
              Only available for Bike Rescue
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={isEnabled && needExtraDrivers ? onDecrease : undefined}
            disabled={!isEnabled || !needExtraDrivers || count <= 1}
            className={`rounded-lg flex items-center justify-center size-[32px] font-['Poppins:Light',_sans-serif] text-[18px] transition-colors text-center ${
              isEnabled && needExtraDrivers
                ? 'bg-[#e5d8c5] hover:bg-[#ddd1be] disabled:opacity-50' 
                : 'bg-[#e0e0e0] text-[#8a8a8a] cursor-not-allowed'
            }`}
          >
            -
          </button>
          <div className={`border rounded-lg flex items-center justify-center size-[32px] font-['Poppins:Regular',_sans-serif] text-[18px] select-none pointer-events-none ${
            isEnabled && needExtraDrivers
              ? 'bg-[#ffffff] border-[rgba(0,0,0,0.61)] text-[#292929]' 
              : 'bg-[#f5f5f5] border-[rgba(0,0,0,0.3)] text-[#8a8a8a]'
          }`}>
            {count}
          </div>
          <button
            onClick={isEnabled && needExtraDrivers ? onIncrease : undefined}
            disabled={!isEnabled || !needExtraDrivers}
            className={`rounded-lg flex items-center justify-center size-[32px] font-['Poppins:Light',_sans-serif] text-[18px] transition-colors text-center ${
              isEnabled && needExtraDrivers
                ? 'bg-[#e5d8c5] hover:bg-[#ddd1be]' 
                : 'bg-[#e0e0e0] text-[#8a8a8a] cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentSlider({ onPay, isDisabled = false, customText = "Slide to book ride", isLoading = false, selectedVehicle = null }) {
  const [isSliding, setIsSliding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const SLIDE_THRESHOLD = 0.7; // 70% of slider width to trigger booking
  const CIRCLE_SIZE = 60; // Size of the draggable circle
  
  useEffect(() => {
    if (sliderRef.current) {
      // Account for padding on both sides: 10px left + 10px right = 20px total
      const padding = 20;
      setSliderWidth(sliderRef.current.offsetWidth - CIRCLE_SIZE - padding);
    }
  }, []);

  const handleMouseDown = (e) => {
    if (isDisabled) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (isDisabled) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isSliding || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const leftPadding = 10;
    const rawPosition = e.clientX - rect.left - leftPadding - CIRCLE_SIZE / 2;
    const newPosition = Math.max(0, Math.min(sliderWidth, rawPosition));
    setDragPosition(newPosition);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isSliding || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const leftPadding = 10;
    const rawPosition = touch.clientX - rect.left - leftPadding - CIRCLE_SIZE / 2;
    const newPosition = Math.max(0, Math.min(sliderWidth, rawPosition));
    setDragPosition(newPosition);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Check if user dragged far enough
    if (dragPosition >= sliderWidth * SLIDE_THRESHOLD) {
      // Success - trigger booking
      setIsSliding(true);
      setDragPosition(sliderWidth); // Snap to end
      
      setTimeout(() => {
        onPay();
        // Reset after booking
        setTimeout(() => {
          setIsSliding(false);
          setDragPosition(0);
        }, 500);
      }, 500);
    } else {
      // Snap back to start
      setDragPosition(0);
    }
  };

  // Global event listeners for mouse/touch
  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e) => handleMouseMove(e);
      const handleTouchMoveGlobal = (e) => handleTouchMove(e);
      
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMoveGlobal);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, dragPosition, sliderWidth]);
  
  return (
    <div className={`absolute bottom-0 left-0 right-0 h-[160px] shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)] z-50 ${
      isDisabled ? 'bg-gray-100' : 'bg-[#ffffff]'
    }`}>
      <div className="relative h-full flex items-center justify-center px-8">
        <div 
          ref={sliderRef}
          className={`rounded-full h-[80px] w-full relative overflow-hidden select-none ${
            isDisabled ? 'bg-gray-300' : 'bg-black'
          }`}
        >
          {/* Background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
                    <span className={`font-['Poppins:Medium',_sans-serif] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[32px] text-center ${
                      isDisabled ? 'text-gray-500' : 'text-[#ffffff]'
                    }`}>
                      {isSliding ? 'Booking...' : isLoading ? 'Loading vehicles...' : 'Slide to book ride'}
                    </span>
          </div>
          
          {/* Draggable circle - Always show but disabled when needed */}
          <div 
            className={`absolute top-[10px] rounded-full shadow-lg transition-all duration-200 ${
              isDisabled 
                ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                : isDragging 
                ? 'cursor-grabbing scale-110 bg-white' 
                : 'cursor-grab scale-100 bg-white'
            } ${isSliding ? 'cursor-not-allowed' : ''}`}
            style={{ 
              left: `${10 + dragPosition}px`,
              width: `${CIRCLE_SIZE}px`,
              height: `${CIRCLE_SIZE}px`,
              transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
            onMouseDown={isDisabled ? undefined : handleMouseDown}
            onTouchStart={isDisabled ? undefined : handleTouchStart}
          >
            {/* Double Arrow SVG - Always show */}
            <svg 
              className="w-14 h-14" 
              fill="none" 
              viewBox="0 0 120 120"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <path d={arrowSvgPaths.pae95500} fill={isDisabled ? '#9CA3AF' : 'black'} />
              <path d={arrowSvgPaths.p1cf54280} fill={isDisabled ? '#9CA3AF' : 'black'} />
            </svg>
          </div>
          
          {/* Progress indicator */}
          <div 
            className="absolute top-0 left-0 h-full bg-[#cf923d] rounded-full transition-all duration-200 opacity-30"
            style={{ 
              width: `${Math.max(0, (dragPosition / sliderWidth) * 100)}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Vehicle Selection Bottom Sheet Component
function VehicleBottomSheet({
  vehicles,
  isLoadingPricing,
  selectedVehicle,
  onSelectVehicle,
  driverCount,
  onIncreaseDrivers,
  onDecreaseDrivers,
  needExtraDrivers,
  onToggleExtraDrivers,
  onClose
}) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="px-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Choose Your Ride</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            🚗 Welcome! Select your preferred vehicle and we'll get you there safely.
          </p>
        </div>
        
        {/* Vehicle Options */}
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {isLoadingPricing ? (
            // Show shimmer effect while loading
            <>
              <ShimmerVehicleCard />
              <ShimmerVehicleCard />
            </>
          ) : (
            vehicles.map((vehicle, index) => (
              <div key={index}>
                <VehicleOption
                  {...vehicle}
                  isSelected={selectedVehicle === index}
                  onSelect={() => onSelectVehicle(index)}
                />
                
                {/* Driver Count Selector - Show after first vehicle (Bike Rescue) */}
                {index === 0 && (
                  <div className="mt-6">
                    <DriverCountSelector
                      count={driverCount}
                      onIncrease={onIncreaseDrivers}
                      onDecrease={onDecreaseDrivers}
                      onToggleExtra={onToggleExtraDrivers}
                      needExtraDrivers={needExtraDrivers}
                      isEnabled={selectedVehicle === 0} // Only enabled when Bike Rescue is selected
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Rescue Service Screen Component
function RescueScreen({
  pickupLocation,
  onBack,
  onRescueBooked
}) {
  const [driverCount, setDriverCount] = useState(1);
  const [dropLocation, setDropLocation] = useState('');
  const [dropCoords, setDropCoords] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [isLocationChanging, setIsLocationChanging] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  
  // Rescue vehicle state
  const [rescueVehicles, setRescueVehicles] = useState([]);
  const [isLoadingRescueVehicles, setIsLoadingRescueVehicles] = useState(false);
  const [selectedRescueVehicle, setSelectedRescueVehicle] = useState(0);
  
  // Google Maps references
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const dropMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);

  // Initialize Google Maps for Rescue screen
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || typeof google === 'undefined') return;

      console.log('🗺️ Initializing Google Maps for Rescue...');

      // Use Prayagraj as default center
      const mapCenter = { lat: 25.4358, lng: 81.8463 };

      // Initialize map
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 13,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      googleMapRef.current = map;

      // Add pickup marker (current location)
      const pickupMarker = new (window as any).google.maps.Marker({
        position: mapCenter,
        map: map,
        title: 'Current Location',
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#CF923D',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
      });

      pickupMarkerRef.current = pickupMarker;

      console.log('✅ Google Maps initialized for Rescue');
    };

    // Wait for Google Maps to load
    if (typeof google !== 'undefined') {
      initMap();
    } else {
      const handleGoogleMapsLoaded = () => {
        console.log('🗺️ Google Maps loaded event received');
        initMap();
      };

      window.addEventListener('googleMapsLoaded', handleGoogleMapsLoaded);

      return () => {
        window.removeEventListener('googleMapsLoaded', handleGoogleMapsLoaded);
      };
    }
  }, []);

  // Handle location change
  const handleLocationChange = (value) => {
    setDropLocation(value);
    setActiveInput('drop');
    setIsLocationChanging(true);
    
    // Simple location search
    const filtered = ENHANCED_DUMMY_ADDRESSES.filter(addr =>
      addr.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestedLocations(filtered);
    setShowSuggestions(true);
  };

  // Handle location selection
  const handleLocationSelect = (address) => {
    setDropLocation(address);
    setShowSuggestions(false);
    setActiveInput(null);
    
    // Set coordinates for the selected address
    const coords = KNOWN_ADDRESSES[address] || { lat: 25.4358, lng: 81.8463 };
    setDropCoords(coords);
    
    // Load rescue vehicles after destination is selected
    loadRescueVehicles();
  };

  // Load rescue vehicles
  const loadRescueVehicles = async () => {
    setIsLoadingRescueVehicles(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const vehicles = [
        {
          title: 'Two-Wheeler Rescue',
          subtitle: 'Emergency vehicle assistance',
          icon: '🏍️',
          price: '₹150',
          time: '5-10 min',
          description: 'Professional rescue service with trained drivers',
          available: true
        },
        {
          title: 'Bike Rescue Plus',
          subtitle: 'Premium emergency assistance',
          icon: '🏍️',
          price: '₹200',
          time: '3-7 min',
          description: 'Fast response with advanced equipment',
          available: true
        }
      ];
      
      setRescueVehicles(vehicles);
      setIsLoadingRescueVehicles(false);
      console.log('🚨 Rescue vehicles loaded:', vehicles);
    }, 1000);
  };

  // Handle rescue booking
  const handleRescueBooking = () => {
    if (!dropLocation.trim()) {
      toast.error('Please enter destination');
      return;
    }

    if (rescueVehicles.length === 0) {
      toast.error('Please wait for vehicles to load');
      return;
    }

    const selectedVehicleData = rescueVehicles[selectedRescueVehicle];
    
    const bookingData = {
      pickupLocation,
      dropLocation,
      pickupCoords: { lat: 25.4358, lng: 81.8463 }, // Current location
      dropCoords: dropCoords || { lat: 25.4358, lng: 81.8463 },
      selectedVehicle: selectedRescueVehicle,
      selectedVehicleData,
      driverCount,
      vehicleType: 'BIKE',
      serviceType: 'RESCUE'
    };

    if (onRescueBooked) {
      onRescueBooked(bookingData);
    }
  };

  return (
    <div className="relative size-full min-h-screen bg-white">
      {/* Interactive Google Maps */}
      <div className="absolute inset-0">
        <div 
          ref={mapRef}
          className="w-full h-[70%]"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Location Inputs */}
      <LocationInputs
        pickupLocation={pickupLocation}
        dropLocation={dropLocation}
        onPickupChange={() => {}} // Disabled for rescue
        onDropChange={(value) => handleLocationChange(value)}
        onBack={onBack}
        suggestedLocations={suggestedLocations}
        showSuggestions={showSuggestions}
        activeInput={activeInput}
        onLocationSelect={(type, address) => handleLocationSelect(address)}
        isLocationChanging={isLocationChanging}
        onGetCurrentLocation={() => {}} // Disabled for rescue
        isGettingCurrentLocation={false}
      />

      {/* Main Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0px_-7px_35.3px_0px_rgba(0,0,0,0.15)] max-h-[60vh] overflow-y-auto">
        <div className="px-6 py-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Emergency Rescue</h2>
            <p className="text-gray-600">
              Emergency vehicle assistance - Available 24/7
            </p>
          </div>

          {/* Driver Count Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Number of Drivers</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDriverCount(Math.max(1, driverCount - 1))}
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-3xl font-bold text-gray-800">{driverCount}</span>
                <button
                  onClick={() => setDriverCount(Math.min(5, driverCount + 1))}
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600">{driverCount} driver{driverCount > 1 ? 's' : ''} needed</p>
            </div>
          </div>

          {/* Vehicle Options */}
          <div className="space-y-4 pb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Rescue Vehicle</h3>
              
              {!dropLocation || dropLocation.trim() === '' ? (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 text-center">
                    💡 Enter destination to see available rescue vehicles
                  </p>
                </div>
              ) : isLoadingRescueVehicles ? (
                <div className="space-y-3">
                  <div className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-xl"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {rescueVehicles.map((vehicle, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        selectedRescueVehicle === index 
                          ? 'bg-orange-50 border-orange-200' 
                          : 'bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                      }`}
                      onClick={() => setSelectedRescueVehicle(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">{vehicle.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{vehicle.title}</h4>
                          <p className="text-sm text-gray-600">{vehicle.subtitle}</p>
                          <p className="text-xs text-gray-500">{vehicle.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">{vehicle.price}</p>
                        <p className="text-sm text-gray-600">{vehicle.time}</p>
                        <p className="text-xs text-orange-600 font-medium">Available 24/7</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Slider */}
      <PaymentSlider 
        onPay={handleRescueBooking} 
        isDisabled={!dropLocation || dropLocation.trim() === '' || rescueVehicles.length === 0 || isLoadingRescueVehicles}
        isLoading={isLoadingRescueVehicles}
        customText="Request Emergency Rescue"
      />
    </div>
  );
}

export default function RideBookingScreen({ onRideBooked, onBack }) {
  /*
    🚀 API INTEGRATION - RIDE BOOKING SCREEN:
    
    1. Location Services:
       - Use geolocator package for GPS location
       - Request location permissions (when in use/always)
       - Get current location with accuracy settings
       - Handle location permission denied scenarios
       
    2. Map Integration:
       - Use Google Maps JavaScript API or Mapbox GL JS
       - Display real-time user location
       - Show nearby vehicles/drivers
       - Route planning and visualization
       
    3. Address Autocomplete:
       - API: GET /api/places/autocomplete?query={search_term}
       - Google Places API or custom location service
       - Recent/favorite locations from user history
       - Debounce search queries (300ms delay)
       
    4. Vehicle/Pricing API:
       - API: GET /api/vehicles/available?pickup_lat={lat}&pickup_lng={lng}
       - Real-time pricing based on demand
       - ETA calculation for each vehicle type
       - Surge pricing notifications
       
    5. Ride Booking API:
       - API: POST /api/rides/book
       - Payload: { pickup: object, destination: object, vehicle_type: string, payment_method: string }
       - Response: { ride_id: string, estimated_fare: number, driver_search_id: string }
       
    6. Real-time Updates:
       - WebSocket connection for driver availability
       - Live pricing updates based on demand
       - Traffic and route optimization
       - Weather-based surge pricing
       
    7. Payment Integration:
       - Multiple payment methods (UPI, cards, wallet, cash)
       - Razorpay, Paytm, or Stripe integration
       - Fare estimation with breakdown
       - Promotional codes and discounts
       
    8. Error Handling:
       - No drivers available in area
       - Location services disabled
       - Network connectivity issues
       - Payment failures and retry logic
  */
  const [pickupLocation, setPickupLocation] = useState("Detecting your location...");
  const [dropLocation, setDropLocation] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [suggestedLocations, setSuggestedLocations] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeInput, setActiveInput] = useState<'pickup' | 'drop' | null>(null);
  const [isLocationChanging, setIsLocationChanging] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  
  // Map references
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const dropMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  
  // Location coordinates - will be set to current location on load
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropCoords, setDropCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [driverCount, setDriverCount] = useState(1);
  const [needExtraDrivers, setNeedExtraDrivers] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // TEST: Simple useEffect
  console.log('📍📍📍 About to declare SIMPLE TEST useEffect');
  useEffect(() => {
    console.log('🎯🎯🎯 SIMPLE TEST useEffect FIRED!!!');
  }, []);
  
  // Initialize Google Maps and detect current location  
  console.log('📍📍📍 About to declare map useEffect');
  
  useEffect(() => {
    console.log('🚀🚀🚀 Map initialization useEffect FIRED!');
    
    // Simplified initialization - just log and try to create map
    console.log('mapRef.current:', mapRef.current);
    console.log('typeof google:', typeof google);
    
    if (!mapRef.current) {
      console.log('❌ No map container');
      return;
    }
    
    if (typeof google === 'undefined') {
      console.log('❌ Google not loaded');
      return;
    }
    
    if (googleMapRef.current) {
      console.log('✅ Map already exists');
      return;
    }

    console.log('🗺️ Creating Google Map...');
    
    const mapCenter = { lat: 25.4358, lng: 81.8463 };
    
    try {
      const map = new google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 13,
      });
      
      googleMapRef.current = map;
      console.log('✅✅✅ MAP CREATED SUCCESSFULLY!!!', map);
    } catch (error) {
      console.error('❌❌❌ Map creation error:', error);
    }
  }, []);

  // Update map markers and route when destination changes
  useEffect(() => {
    const map = googleMapRef.current;
    if (!map || !pickupCoords) return;

    console.log('🔄 Updating map with destination:', dropLocation);

    // Remove existing destination marker and route
    if (dropMarkerRef.current) {
      dropMarkerRef.current.setMap(null);
      dropMarkerRef.current = null;
    }
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }

    // Add new destination marker if destination exists
    if (dropLocation && dropLocation.trim() !== '' && dropCoords) {
      const dropMarker = new (window as any).google.maps.Marker({
        position: dropCoords,
        map: map,
        title: 'Destination',
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#000000',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
      });

      dropMarkerRef.current = dropMarker;

      // Draw route
      drawRoute(map, pickupCoords, dropCoords);

      // Fit map to show both markers
      const bounds = new (window as any).google.maps.LatLngBounds();
      bounds.extend(pickupCoords);
      bounds.extend(dropCoords);
      map.fitBounds(bounds, { top: 100, right: 50, bottom: 400, left: 50 }); // Extra bottom padding for vehicle sheet
      
      console.log('✅ Map updated with destination');
    } else {
      // Center on pickup only
      map.setCenter(pickupCoords);
      map.setZoom(15);
    }
  }, [dropLocation, dropCoords, pickupCoords]);

  // Function to draw route between two points
  const drawRoute = (map: any, start: any, end: any) => {
    if (!map || !start || !end) return;

    try {
      const directionsService = new (window as any).google.maps.DirectionsService();
      const directionsRenderer = new (window as any).google.maps.DirectionsRenderer({
        suppressMarkers: true, // We'll use our custom markers
        polylineOptions: {
          strokeColor: '#CF923D',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });

      directionsRenderer.setMap(map);
      routePolylineRef.current = directionsRenderer;

      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: (window as any).google.maps.TravelMode.DRIVING,
        },
        (result: any, status: any) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
            console.log('✅ Route drawn successfully');
          } else {
            console.warn('⚠️ Directions request failed:', status, '- Using fallback line');
            // Fallback: draw a simple line between points
            drawFallbackRoute(map, start, end);
          }
        }
      );
    } catch (error) {
      console.warn('⚠️ Directions API not available:', error);
      // Fallback: draw a simple line between points
      drawFallbackRoute(map, start, end);
    }
  };

  // Fallback route drawing when Directions API is not available
  const drawFallbackRoute = (map: any, start: any, end: any) => {
    try {
      const polyline = new (window as any).google.maps.Polyline({
        path: [start, end],
        geodesic: true,
        strokeColor: '#CF923D',
        strokeOpacity: 1.0,
        strokeWeight: 4,
      });
      
      polyline.setMap(map);
      routePolylineRef.current = polyline;
      console.log('✅ Fallback route drawn');
    } catch (error) {
      console.warn('⚠️ Could not draw fallback route:', error);
    }
  };

  // Update map when coordinates change
  useEffect(() => {
    if (googleMapRef.current && pickupMarkerRef.current && pickupCoords) {
      // Update pickup marker
      pickupMarkerRef.current.setPosition(pickupCoords);
      
      // Show destination marker and route when destination is entered
      if (dropLocation && dropLocation.trim() !== '' && dropCoords) {
        // Create drop marker if it doesn't exist
        if (!dropMarkerRef.current) {
          const dropMarker = new (window as any).google.maps.Marker({
            position: dropCoords,
            map: googleMapRef.current,
            title: 'Destination',
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#000000',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
            },
          });
          dropMarkerRef.current = dropMarker;
        } else {
          // Update existing drop marker
          dropMarkerRef.current.setPosition(dropCoords);
        }
        
        // Draw route between pickup and destination
        drawRoute(googleMapRef.current, pickupCoords, dropCoords);
        
        // Fit map to show both markers with proper bounds and padding
        const bounds = new (window as any).google.maps.LatLngBounds();
        bounds.extend(pickupCoords);
        bounds.extend(dropCoords);
        
        // Add padding to bounds for better view and focus between the two points
        const padding = 50; // pixels
        googleMapRef.current.fitBounds(bounds, { 
          top: padding, 
          right: padding, 
          bottom: padding, 
          left: padding 
        });
      } else {
        // Remove drop marker and route if destination is cleared
        if (dropMarkerRef.current) {
          dropMarkerRef.current.setMap(null);
          dropMarkerRef.current = null;
        }
        if (routePolylineRef.current) {
          routePolylineRef.current.setMap(null);
          routePolylineRef.current = null;
        }
        
        // Center map on pickup location only
        googleMapRef.current.setCenter(pickupCoords);
        googleMapRef.current.setZoom(15);
      }
    }
  }, [pickupCoords, dropCoords, dropLocation]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartTop, setDragStartTop] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // API Integration State
  const [pricingData, setPricingData] = useState<any>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
  const [locationChangeTimeout, setLocationChangeTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showVehicleSheet, setShowVehicleSheet] = useState(false);
  const [destinationSelected, setDestinationSelected] = useState(false);
  const [showRescueScreen, setShowRescueScreen] = useState(false);

  // Google Places Autocomplete ref
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Initialize Google Places Autocomplete on destination input
  useEffect(() => {
    const initAutocomplete = () => {
      const input = document.getElementById('destination-autocomplete-input') as HTMLInputElement;
      
      if (!input || typeof google === 'undefined' || !google.maps || !google.maps.places) {
        console.log('⏳ Waiting for Google Maps API...');
        return;
      }

      if (autocompleteRef.current) {
        console.log('✅ Autocomplete already initialized');
        return;
      }

      try {
        console.log('🔧 Initializing Google Places Autocomplete on destination input...');
        
        const autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'in' }
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          console.log('📍 Place selected from autocomplete:', place);
          
          if (place.geometry && place.formatted_address) {
            setDropLocation(place.formatted_address);
            setDropCoords({
              lat: place.geometry.location!.lat(),
              lng: place.geometry.location!.lng()
            });
            setDestinationSelected(true);
            setShowSuggestions(false);
            console.log('✅ Destination set:', place.formatted_address);
          }
        });

        autocompleteRef.current = autocomplete;
        console.log('✅ Google Places Autocomplete initialized successfully!');
      } catch (error) {
        console.error('❌ Error initializing autocomplete:', error);
      }
    };

    // Try to initialize immediately
    initAutocomplete();

    // Also listen for Google Maps loaded event
    const handleGoogleMapsLoaded = () => {
      console.log('🗺️ Google Maps loaded event received for autocomplete');
      initAutocomplete();
    };

    window.addEventListener('googleMapsLoaded', handleGoogleMapsLoaded);

    return () => {
      window.removeEventListener('googleMapsLoaded', handleGoogleMapsLoaded);
    };
  }, []);

  // INITIALIZE GOOGLE MAP - Simple and direct
  useEffect(() => {
    console.log('🗺️🗺️🗺️ MAP INIT useEffect RUNNING!');
    
    if (!mapRef.current) {
      console.log('No map container yet');
      return;
    }
    
    if (typeof google === 'undefined') {
      console.log('Google Maps not loaded yet');
      return;
    }
    
    if (googleMapRef.current) {
      console.log('Map already created');
      return;
    }
    
    console.log('Creating map NOW...');
    
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 25.4358, lng: 81.8463 },
      zoom: 13,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      fullscreenControl: true,
    });
    
    googleMapRef.current = map;
    
    // Add pickup marker
    const pickupMarker = new google.maps.Marker({
      position: { lat: 25.4358, lng: 81.8463 },
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#CF923D',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      },
    });
    
    pickupMarkerRef.current = pickupMarker;
    
    console.log('✅✅✅ MAP CREATED!', map);
  }, []);

  // Geocoding function using Google Maps API
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      // First try known addresses
      if (KNOWN_ADDRESSES[address]) {
        console.log('✅ Using known coordinates for:', address);
        return KNOWN_ADDRESSES[address];
      }
      
      // Try Google Geocoding API as fallback
      const result = await geocodingService.geocodeAddress(address);
      if (result) {
        return { lat: result.lat, lng: result.lng };
      }
      
      // Final fallback to current location or Prayagraj
      console.log('⚠️ Using fallback coordinates for:', address);
      if (pickupCoords) {
        return pickupCoords; // Use current location if available
      }
      return { lat: 25.4358, lng: 81.8463 }; // Prayagraj as final fallback
    } catch (error) {
      console.error('Geocoding error:', error);
      console.log('⚠️ Using fallback coordinates due to error');
      if (pickupCoords) {
        return pickupCoords; // Use current location if available
      }
      return { lat: 25.4358, lng: 81.8463 }; // Prayagraj as final fallback
    }
  };

  // Get current location
  const getCurrentLocation = async (type: 'pickup' | 'drop') => {
    setIsGettingCurrentLocation(true);
    try {
      const result = await geocodingService.getCurrentLocation();
      if (result) {
        const address = result.formattedAddress;
        if (type === 'pickup') {
          setPickupLocation(address);
          setPickupCoords({ lat: result.lat, lng: result.lng });
        } else {
          setDropLocation(address);
          setDropCoords({ lat: result.lat, lng: result.lng });
        }
        toast.success('Current location detected!');
      } else {
        toast.error('Unable to detect current location');
      }
    } catch (error) {
      console.error('Current location error:', error);
      toast.error('Failed to get current location. Please enable location permissions.');
    } finally {
      setIsGettingCurrentLocation(false);
    }
  };

  // Google Places API address search (backup for manual typing)
  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestedLocations([]);
      setShowSuggestions(false);
      return;
    }
    
    console.log('🔍 Searching locations:', query);
    
    try {
      // Ensure geocodingService is initialized
      if (!geocodingService.isInitialized) {
        await geocodingService.init();
      }
      
      // Use Google Places API
      const suggestions = await geocodingService.getPlaceSuggestions(query);
      
      if (suggestions && suggestions.length > 0) {
        const displaySuggestions = suggestions.map(suggestion => suggestion.description);
        console.log('✅ Found', displaySuggestions.length, 'suggestions');
        setSuggestedLocations(displaySuggestions);
        setShowSuggestions(true);
      } else {
        // Fallback to enhanced local search
        const filtered = ENHANCED_DUMMY_ADDRESSES.filter(addr => 
          addr.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);
        
        setSuggestedLocations(filtered);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      
      // Fallback to enhanced local search
      const filtered = ENHANCED_DUMMY_ADDRESSES.filter(addr =>
        addr.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      
      setSuggestedLocations(filtered);
      setShowSuggestions(true);
    }
  };

  // Handle Rescue service click
  const handleRescueClick = async () => {
    console.log('🚨 Rescue service requested');
    
    // Auto-fetch current location
    try {
      const currentLocation = await geocodingService.getCurrentLocation();
      if (currentLocation) {
        setPickupLocation(currentLocation.formattedAddress);
        setPickupCoords({ lat: currentLocation.lat, lng: currentLocation.lng });
        console.log('✅ Current location fetched for rescue:', currentLocation.formattedAddress);
      }
    } catch (error) {
      console.error('❌ Failed to fetch current location for rescue:', error);
      // Use fallback location
      setPickupLocation('Prayagraj, Uttar Pradesh');
      setPickupCoords({ lat: 25.4358, lng: 81.8463 });
    }
    
    // Show rescue screen
    setShowRescueScreen(true);
  };

  // Handle back from rescue screen
  const handleBackFromRescue = () => {
    setShowRescueScreen(false);
  };

  // Handle location change with debouncing
  const handleLocationChange = (type: 'pickup' | 'drop', value: string) => {
    console.log('🔄 handleLocationChange called:', { type, value, valueLength: value.length });
    
    if (type === 'pickup') {
      setPickupLocation(value);
      console.log('✅ Set pickup location:', value);
    } else {
      setDropLocation(value);
      // Reset destination selected when user starts typing
      setDestinationSelected(false);
      console.log('✅ Set drop location:', value);
    }
    
    setActiveInput(type);
    setIsLocationChanging(true);
    console.log('🔄 Starting debounced search in 500ms for:', value);
    
    // Clear existing timeout
    if (locationChangeTimeout) {
      clearTimeout(locationChangeTimeout);
      console.log('🔄 Cleared existing timeout');
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(async () => {
      console.log('⏰ Debounce timeout fired, calling searchLocations');
      await searchLocations(value);
      setIsLocationChanging(false);
    }, 500);
    
    setLocationChangeTimeout(timeout);
  };

  // Handle location selection from suggestions
  const handleLocationSelect = async (type: 'pickup' | 'drop', address: string) => {
    if (type === 'pickup') {
      setPickupLocation(address);
    } else {
      setDropLocation(address);
      // Mark destination as selected when user selects from dropdown
      setDestinationSelected(true);
    }
    
    setShowSuggestions(false);
    setActiveInput(null);
    
    // Geocode the selected address
    const coords = await geocodeAddress(address);
    if (coords) {
      if (type === 'pickup') {
        setPickupCoords(coords);
      } else {
        setDropCoords(coords);
      }
    }
  };

  // Fetch pricing data from API
  const fetchPricingData = async () => {
    // Check if coordinates are available and not null
    if (!pickupCoords || !dropCoords || !pickupCoords.lat || !dropCoords.lat) {
      console.log('⚠️ Cannot fetch pricing data: coordinates not available');
      return;
    }
    
    setIsLoadingPricing(true);
    try {
      const pricing = await pricingService.calculateFare({
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        dropLat: dropCoords.lat,
        dropLng: dropCoords.lng,
        vehicleType: 'SEDAN'
      });
      
      setPricingData(pricing);
      
      // Fetch nearby drivers
      const drivers = await pricingService.getNearbyDrivers(
        pickupCoords.lat,
        pickupCoords.lng,
        5
      );
      
      setNearbyDrivers(drivers);
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      toast.error('Failed to fetch pricing data');
    } finally {
      setIsLoadingPricing(false);
    }
  };

  // Show vehicle sheet when destination is actually selected (not just typed)
  useEffect(() => {
    if (destinationSelected && dropLocation && dropLocation.trim() !== '') {
      setShowVehicleSheet(true);
    } else {
      setShowVehicleSheet(false);
    }
  }, [destinationSelected, dropLocation]);

  // Fetch pricing when coordinates change (with debounce)
  useEffect(() => {
    // Clear any existing timeout
    if (locationChangeTimeout) {
      clearTimeout(locationChangeTimeout);
    }
    
    // Set a new timeout to debounce the API call
    const timeout = setTimeout(() => {
      fetchPricingData();
    }, 1000); // Wait 1 second after coordinates stop changing
    
    // Store timeout reference for cleanup
    setLocationChangeTimeout(timeout);
    
    // Cleanup function
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [pickupCoords, dropCoords]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (locationChangeTimeout) {
        clearTimeout(locationChangeTimeout);
      }
    };
  }, [locationChangeTimeout]);

  // Dynamic vehicles array with real pricing data
  const vehicles = [
    {
      type: 'bike',
      title: 'Bike Rescue',
      description: 'Pickup and drop you',
      price: pricingData ? `₹${pricingData.totalFare.toFixed(2)}` : (isLoadingPricing ? 'Calculating...' : '₹150.00'),
      timeAway: isLoadingPricing ? 'Calculating...' : (nearbyDrivers.length > 0 ? `${Math.floor(Math.random() * 5) + 1} mins away` : '2 mins away'),
      isShimmer: isLoadingPricing,
      pickupTime: new Date(Date.now() + 15 * 60000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      image: `url('${imgFrame}'), url('${imgFrame1}')`,
      isLoading: isLoadingPricing
    },
    {
      type: 'personal',
      title: 'Personal Driver',
      description: 'Pickup and drop you',
      price: pricingData ? `₹${(pricingData.totalFare * 1.5).toFixed(2)} / hr.` : (isLoadingPricing ? 'Calculating...' : '₹200.00 / hr.'),
      timeAway: isLoadingPricing ? 'Calculating...' : (nearbyDrivers.length > 0 ? `${Math.floor(Math.random() * 5) + 1} mins away` : '2 mins away'),
      isShimmer: isLoadingPricing,
      pickupTime: new Date(Date.now() + 15 * 60000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      image: `url('${imgFrame2}'), url('${imgFrame3}')`,
      isLoading: isLoadingPricing
    }
  ];

  // Handle scroll events to adjust panel position
  useEffect(() => {
    const handleScroll = () => {
      if (panelRef.current) {
        setScrollY(panelRef.current.scrollTop);
      }
    };

    const panel = panelRef.current;
    if (panel) {
      panel.addEventListener('scroll', handleScroll);
      return () => panel.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle drag functionality
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    
    // Get current panel position
    const baseTop = 380;
    const maxMovement = baseTop * 0.3;
    const minTop = baseTop - maxMovement;
    const scrollFactor = Math.min(scrollY / 100, 1);
    const currentTop = isExpanded ? 150 : (baseTop - (baseTop - minTop) * scrollFactor);
    setDragStartTop(currentTop);
    
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY;
    const newTop = Math.max(150, Math.min(380, dragStartTop + deltaY));
    
    // Auto-expand if dragged up enough
    if (newTop < 250) {
      setIsExpanded(true);
    } else if (newTop > 320) {
      setIsExpanded(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleDragMove(e);
      const handleTouchMove = (e) => handleDragMove(e);
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, dragStartY, dragStartTop]);

  // Calculate dynamic panel position and height based on scroll and expansion
  const getPanelStyle = () => {
    const baseTop = 380; // Start position (moved down from 240px)
    const maxMovement = baseTop * 0.3; // Only move 30% of the starting position
    const minTop = baseTop - maxMovement; // 380 - 114 = 266px
    
    if (isExpanded) {
      // Use the same position as maximum scroll position
      return {
        top: `${minTop}px`,
        height: `calc(100vh - ${minTop + 160}px)` // Account for payment slider
      };
    }
    
    const scrollFactor = Math.min(scrollY / 100, 1); // Normalize scroll to 0-1
    const dynamicTop = baseTop - (baseTop - minTop) * scrollFactor;
    
    return {
      top: `${dynamicTop}px`,
      height: `calc(100vh - ${dynamicTop + 160}px)` // Account for payment slider
    };
  };

  const handlePay = () => {
    const selectedVehicleData = vehicles[selectedVehicle];
    
    console.log("💳 Payment initiated");
    console.log("🚗 Selected vehicle:", selectedVehicleData);
    console.log("📍 Pickup:", pickupLocation);
    console.log("📍 Drop:", dropLocation);
    console.log("👥 Driver count:", driverCount);
    
    // Prepare booking data
    const bookingData = {
      selectedVehicle: {
        type: selectedVehicleData.title,
        price: selectedVehicleData.price.replace('₹', '').replace('.00', '').replace(' / hr.', ''),
        paymentMethod: 'Cash Cash'
      },
      pickupLocation: pickupLocation || 'Current Location',
      dropLocation: dropLocation || 'Select Destination',
      driverCount: selectedVehicleData.title === 'Bike Rescue' ? driverCount : 1,
      timestamp: new Date().toISOString()
    };
    
    // Call the parent callback to navigate to booking loader
    if (onRideBooked) {
      onRideBooked(bookingData);
    } else {
      toast.success("Ride booked successfully!", {
        description: `${selectedVehicleData.title} booking confirmed`,
        duration: 3000,
      });
    }
  };

  // Show Rescue screen if requested
  if (showRescueScreen) {
    return (
      <RescueScreen
        pickupLocation={pickupLocation}
        onBack={handleBackFromRescue}
        onRescueBooked={onRideBooked}
      />
    );
  }

  return (
    <div className="relative size-full min-h-screen bg-white overflow-hidden">
      {/* Interactive Google Maps */}
      <div className="absolute inset-0 z-0 bg-gray-200" style={{ height: '100vh', width: '100%' }}>
        <div 
          ref={mapRef}
          data-map-container="true"
          id="google-map-container"
          className="w-full h-full bg-blue-50"
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* Location Inputs */}
      <LocationInputs
        pickupLocation={pickupLocation}
        dropLocation={dropLocation}
        onPickupChange={(value) => handleLocationChange('pickup', value)}
        onDropChange={(value) => handleLocationChange('drop', value)}
        onBack={onBack}
        suggestedLocations={suggestedLocations}
        showSuggestions={showSuggestions}
        activeInput={activeInput}
        onLocationSelect={handleLocationSelect}
        isLocationChanging={isLocationChanging}
        onGetCurrentLocation={getCurrentLocation}
        isGettingCurrentLocation={isGettingCurrentLocation}
      />

      {/* Vehicle Selection Card */}
      <div 
        ref={panelRef}
        className="absolute bg-[#ffffff] left-0 right-0 rounded-t-[30px] px-6 overflow-y-scroll scrollbar-hide transition-all duration-300 ease-out shadow-[0px_-4px_20px_rgba(0,0,0,0.15)] z-40"
        style={getPanelStyle()}
      >
        <div className="space-y-6">
          {/* Sticky Header Container */}
          <div className="sticky top-0 bg-white z-20 -mx-6 px-6">
            {/* Drag Handle */}
            <div 
              className="py-3 cursor-grab active:cursor-grabbing"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div className="flex justify-center">
                <div className="w-12 h-1 bg-[#d0d0d0] rounded-full hover:bg-[#a0a0a0] transition-colors"></div>
              </div>
            </div>

            {/* Header */}
            <div className="pb-4 border-b border-[#f0f0f0] mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-['Poppins:Medium',_sans-serif] text-[#080a24] text-[28px]">
                  Choose Your Ride
                </h2>
                {isLoadingPricing && (
                  <div className="flex items-center gap-2 text-[#CF923D] text-[12px]">
                    <div className="w-3 h-3 border border-[#CF923D] border-t-transparent rounded-full animate-spin"></div>
                    <div className="flex items-center gap-1">
                      <span>Updating prices</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-[#CF923D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1 h-1 bg-[#CF923D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1 h-1 bg-[#CF923D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#656565] text-[16px]">
                🚗 Welcome! Select your preferred vehicle and we'll get you there safely.
              </p>
            </div>
          </div>

          {/* Raahi Services - Always shown */}
          <div className="space-y-4 pb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Check other Raahi Services</h3>
              <div className="space-y-3">
                  <div 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-200 border-2 border-transparent transition-all duration-200 active:scale-95"
                    onClick={handleRescueClick}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Rescue</h4>
                        <p className="text-sm text-gray-600">Emergency vehicle assistance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Available 24/7</p>
                      <p className="text-xs text-orange-600 font-medium">Tap to request</p>
                    </div>
                  </div>
              </div>
              {!dropLocation || dropLocation.trim() === '' ? (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Enter your destination to see available ride options
                  </p>
                </div>
              ) : isLoadingPricing ? (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    🔄 Loading vehicle options...
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Destination selected! Vehicle options will appear below
                  </p>
                </div>
              )}
            </div>
          </div>
            
          {/* Extra spacing for scroll content */}
          <div className="h-20 flex items-center justify-center">
            <p className="text-[#999] text-sm font-['Poppins:Regular',_sans-serif]">
              Scroll up to see more content
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle Selection Bottom Sheet */}
      {showVehicleSheet && (
        <VehicleBottomSheet
          vehicles={vehicles}
          isLoadingPricing={isLoadingPricing}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={setSelectedVehicle}
          driverCount={driverCount}
          onIncreaseDrivers={() => setDriverCount(prev => prev + 1)}
          onDecreaseDrivers={() => setDriverCount(prev => Math.max(1, prev - 1))}
          needExtraDrivers={needExtraDrivers}
          onToggleExtraDrivers={() => setNeedExtraDrivers(prev => !prev)}
          onClose={() => setShowVehicleSheet(false)}
        />
      )}

      {/* Payment Slider */}
      <PaymentSlider 
        onPay={handlePay} 
        isDisabled={!dropLocation || dropLocation.trim() === '' || isLoadingPricing || !showVehicleSheet || selectedVehicle === null}
        isLoading={isLoadingPricing}
        selectedVehicle={selectedVehicle}
      />
    </div>
  );
}