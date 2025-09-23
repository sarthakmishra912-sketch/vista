import React, { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { pricingService } from '../services/pricingService';
import { geocodingService, GeocodingResult, PlaceSuggestion } from '../services/geocodingService';
import svgPaths from "../imports/svg-u42y27j2nw";
import arrowSvgPaths from "../imports/svg-4olgt74d78";
import imgFrame from "figma:asset/4e95da5f9e6ec1d32f897fbff5c28b62b3c1d8ed.png";
import imgFrame1 from "figma:asset/516e77515feb8b0da14eb9d08100d04603ad8beb.png";
import imgFrame2 from "figma:asset/ccab72f0e9bf12b4ad08c152b84cbd87b9bb0945.png";
import imgFrame3 from "figma:asset/e22810488a2dea398cea28b8afe2e029a45b5b57.png";
import imgImage from "figma:asset/176ba6c12ab7f022834992fb78872f1e9feeb9a4.png";





// Dummy addresses for Delhi NCR
const DUMMY_ADDRESSES = [
  "Connaught Place, New Delhi",
  "DLF Cyber City, Gurgaon",
  "Sector 18, Noida",
  "Karol Bagh, New Delhi",
  "Rajouri Garden, New Delhi",
  "India Gate, New Delhi",
  "Red Fort, Delhi",
  "Lotus Temple, New Delhi",
  "Select City Walk Mall, Saket",
  "DLF Mall of India, Noida",
  "Ambience Mall, Gurgaon",
  "Khan Market, New Delhi",
  "Chandni Chowk, Old Delhi",
  "Nehru Place, New Delhi",
  "Greater Kailash, New Delhi",
  "Vasant Kunj, New Delhi",
  "Dwarka, New Delhi",
  "Rohini, New Delhi",
  "Lajpat Nagar, New Delhi",
  "Janakpuri, New Delhi",
  "Pitampura, New Delhi",
  "Sarita Vihar, New Delhi",
  "Okhla, New Delhi",
  "Mayur Vihar, New Delhi",
  "Shalimar Bagh, New Delhi",
  "Sector 15, Gurgaon",
  "Sector 29, Gurgaon",
  "Sector 44, Gurgaon",
  "Golf Course Road, Gurgaon",
  "MG Road, Gurgaon",
  "Sector 62, Noida",
  "Sector 137, Noida",
  "Greater Noida West",
  "Knowledge Park, Greater Noida",
  "Pari Chowk, Greater Noida"
];

function LocationDropdown({ addresses, onSelect, isVisible, searchTerm = "" }) {
  if (!isVisible) return null;
  
  const filteredAddresses = addresses.filter(address =>
    address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-[#e0e0e0] rounded-lg shadow-lg max-h-[200px] overflow-y-auto scrollbar-hide z-50 mt-1">
      {filteredAddresses.length > 0 ? (
        filteredAddresses.slice(0, 8).map((address, index) => (
          <button
            key={index}
            onClick={() => onSelect(address)}
            className="w-full text-left px-4 py-3 hover:bg-[#f8f8f8] transition-colors border-b border-[#f0f0f0] last:border-b-0"
          >
            <div className="font-['Poppins:Regular',_sans-serif] text-[#333333] text-[16px]">
              {address}
            </div>
          </button>
        ))
      ) : (
        <div className="px-4 py-3 text-[#999999] font-['Poppins:Regular',_sans-serif] text-[16px]">
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
    <div className="absolute bg-[#ffffff] box-border content-stretch flex gap-4 items-end justify-start left-[20px] right-[20px] px-[30px] py-[25px] rounded-[25px] top-[20px] shadow-lg z-30 location-input-container">
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
              placeholder="U Block, DLF Phase 3, Sector 24, Gur..."
              className="font-['Poppins:Regular',_sans-serif] text-[#656565] text-[18px] bg-transparent border-none outline-none w-full placeholder:text-[#656565]"
            />
            {isLocationChanging && activeInput === 'pickup' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#CF923D] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {isLocationChanging && activeInput === 'pickup' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite] rounded"></div>
            )}
            <LocationDropdown
              addresses={suggestedLocations.length > 0 ? suggestedLocations : DUMMY_ADDRESSES}
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
              type="text"
              value={dropLocation}
              onChange={(e) => onDropChange(e.target.value)}
              onFocus={handleDropFocus}
              placeholder="Home"
              className="font-['Poppins:Regular',_sans-serif] text-[#656565] text-[18px] bg-transparent border-none outline-none w-full placeholder:text-[#656565]"
            />
            {isLocationChanging && activeInput === 'drop' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#CF923D] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {isLocationChanging && activeInput === 'drop' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite] rounded"></div>
            )}
            <LocationDropdown
              addresses={suggestedLocations.length > 0 ? suggestedLocations : DUMMY_ADDRESSES}
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

function PaymentSlider({ onPay }) {
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
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
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
    <div className="absolute bottom-0 left-0 right-0 bg-[#ffffff] h-[160px] shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)]">
      <div className="relative h-full flex items-center justify-center px-8">
        <div 
          ref={sliderRef}
          className="bg-black rounded-full h-[80px] w-full relative overflow-hidden select-none"
        >
          {/* Background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
            <span className="font-['Poppins:Medium',_sans-serif] text-[#ffffff] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[32px] text-center">
              {isSliding ? 'Booking...' : 'Slide to book ride'}
            </span>
          </div>
          
          {/* Draggable circle */}
          <div 
            className={`absolute top-[10px] bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
              isDragging ? 'scale-110' : 'scale-100'
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
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Double Arrow SVG */}
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
              <path d={arrowSvgPaths.pae95500} fill="black" />
              <path d={arrowSvgPaths.p1cf54280} fill="black" />
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
  const [pickupLocation, setPickupLocation] = useState("YourPickup Location");
  const [dropLocation, setDropLocation] = useState("Destination");
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [driverCount, setDriverCount] = useState(1);
  const [needExtraDrivers, setNeedExtraDrivers] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartTop, setDragStartTop] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // API Integration State
  const [pricingData, setPricingData] = useState<any>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
  const [pickupCoords, setPickupCoords] = useState({ lat: 28.6139, lng: 77.2090 });
  const [dropCoords, setDropCoords] = useState({ lat: 28.5355, lng: 77.3910 });
  
  // Location change state
  const [isLocationChanging, setIsLocationChanging] = useState(false);
  const [locationChangeTimeout, setLocationChangeTimeout] = useState<NodeJS.Timeout | null>(null);
  const [suggestedLocations, setSuggestedLocations] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeInput, setActiveInput] = useState<'pickup' | 'drop' | null>(null);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);

  // Geocoding function using Google Maps API
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const result = await geocodingService.geocodeAddress(address);
      if (result) {
        return { lat: result.lat, lng: result.lng };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to find location. Please try a different address.');
      return null;
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

  // Search for location suggestions using Google Places API
  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestedLocations([]);
      setShowSuggestions(false);
      return;
    }
    
    try {
      const suggestions = await geocodingService.getPlaceSuggestions(query);
      setSuggestedLocations(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Location search error:', error);
      // Fallback to dummy addresses if Google Places fails
      const filtered = DUMMY_ADDRESSES.filter(addr => 
        addr.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setSuggestedLocations(filtered);
      setShowSuggestions(true);
    }
  };

  // Handle location change with debouncing
  const handleLocationChange = (type: 'pickup' | 'drop', value: string) => {
    if (type === 'pickup') {
      setPickupLocation(value);
    } else {
      setDropLocation(value);
    }
    
    setActiveInput(type);
    setIsLocationChanging(true);
    
    // Clear existing timeout
    if (locationChangeTimeout) {
      clearTimeout(locationChangeTimeout);
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(async () => {
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
    if (!pickupCoords.lat || !dropCoords.lat) return;
    
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

  // Fetch pricing when coordinates change
  useEffect(() => {
    fetchPricingData();
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

  return (
    <div className="relative size-full min-h-screen bg-white">
      {/* Background Map */}
      <div className="absolute inset-0">
        <div 
          className="bg-center bg-cover bg-no-repeat w-full h-[70%]" 
          style={{ backgroundImage: `url('${imgImage}')` }} 
        />
        
        {/* Map Route Overlay */}
        <div className="absolute top-[200px] left-[60px] right-[60px] h-[300px] pointer-events-none">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 527 383">
            <path d={svgPaths.p109e7880} stroke="black" strokeWidth="3" />
          </svg>
          
          {/* Location Markers */}
          <div className="absolute top-[20%] left-[10%]">
            <svg className="w-8 h-8" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
              <path d={svgPaths.p354bd900} stroke="#CF923D" strokeWidth="6" />
            </svg>
          </div>
          
          <div className="absolute bottom-[20%] right-[20%]">
            <svg className="w-7 h-9" fill="none" preserveAspectRatio="none" viewBox="0 0 28 37">
              <path d={svgPaths.p23784500} fill="black" />
            </svg>
          </div>
        </div>
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
        className="absolute bg-[#ffffff] left-0 right-0 rounded-t-[30px] px-6 overflow-y-scroll scrollbar-hide transition-all duration-300 ease-out shadow-[0px_-4px_20px_rgba(0,0,0,0.15)]"
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
                  Select Ride
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
                1st driver drops you 2nd driver delivers your car.
              </p>
            </div>
          </div>

          {/* Vehicle Options */}
          <div className="space-y-4 pb-8">
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
                  onSelect={() => setSelectedVehicle(index)}
                />
                
                {/* Driver Count Selector - Show after first vehicle (Bike Rescue) */}
                {index === 0 && (
                  <div className="mt-6">
                    <DriverCountSelector
                      count={driverCount}
                      onIncrease={() => setDriverCount(prev => prev + 1)}
                      onDecrease={() => setDriverCount(prev => Math.max(1, prev - 1))}
                      onToggleExtra={() => setNeedExtraDrivers(prev => !prev)}
                      needExtraDrivers={needExtraDrivers}
                      isEnabled={selectedVehicle === 0} // Only enabled when Bike Rescue is selected
                    />
                  </div>
                )}
              </div>
            ))
            )}
            
            {/* Extra spacing for scroll content */}
            <div className="h-20 flex items-center justify-center">
              <p className="text-[#999] text-sm font-['Poppins:Regular',_sans-serif]">
                Scroll up to see more content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Slider */}
      <PaymentSlider onPay={handlePay} />
    </div>
  );
}