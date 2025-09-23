import { useState, useEffect } from "react";
import { toast } from "sonner";
import svgPaths from "../imports/svg-wh69x1kzst";
import imgUber0213C7Cd81E2 from "figma:asset/0c4e8a4be75e7d129875490702ea90e0ae00c34d.png";
import imgImage from "figma:asset/176ba6c12ab7f022834992fb78872f1e9feeb9a4.png";

function LoadingAnimation({ dots }) {
  return null;
}

function VehicleIcon() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Search Pulse Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-32 h-32 border-2 border-blue-300 rounded-full animate-ping opacity-30"></div>
        <div className="absolute w-40 h-40 border-2 border-blue-300 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute w-48 h-48 border-2 border-blue-300 rounded-full animate-ping opacity-10" style={{ animationDelay: '1.4s' }}></div>
      </div>

      {/* Vehicle Icon Container - matches Figma design */}
      <div className="relative w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full shadow-lg flex items-center justify-center animate-gentle-bounce">
        {/* 3D Car Icon */}
        <div className="relative">
          {/* Car shadow for 3D effect */}
          <div className="absolute top-2 left-1 w-16 h-8 bg-gray-300 rounded-lg opacity-20 transform skew-x-12"></div>
          
          {/* Main car body */}
          <svg 
            className="w-16 h-10 relative z-10" 
            fill="none" 
            viewBox="0 0 64 40"
          >
            {/* Car body - white with subtle shadow */}
            <path 
              d="M8 25 L8 18 Q8 15 11 15 L53 15 Q56 15 56 18 L56 25 L56 30 Q56 33 53 33 L11 33 Q8 33 8 30 Z" 
              fill="white" 
              stroke="#e0e0e0" 
              strokeWidth="1"
            />
            
            {/* Car roof/windshield */}
            <path 
              d="M15 18 L15 8 Q15 6 17 6 L47 6 Q49 6 49 8 L49 18 Z" 
              fill="white" 
              stroke="#e0e0e0" 
              strokeWidth="1"
            />
            
            {/* Front and rear windows */}
            <rect x="18" y="9" width="8" height="7" rx="1" fill="#87CEEB" opacity="0.3" />
            <rect x="38" y="9" width="8" height="7" rx="1" fill="#87CEEB" opacity="0.3" />
            
            {/* Wheels */}
            <circle cx="18" cy="32" r="4" fill="#2a2a2a" />
            <circle cx="46" cy="32" r="4" fill="#2a2a2a" />
            <circle cx="18" cy="32" r="2" fill="#666" />
            <circle cx="46" cy="32" r="2" fill="#666" />
            
            {/* Car details - bumper, lights */}
            <rect x="8" y="22" width="3" height="3" rx="1" fill="#ffeb3b" />
            <rect x="53" y="22" width="3" height="3" rx="1" fill="#f44336" />
            
            {/* Grille */}
            <rect x="11" y="20" width="6" height="3" rx="1" fill="#e0e0e0" />
          </svg>
        </div>

        {/* Floating animation indicator */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

export default function BookingLoaderScreen({
  selectedVehicle,
  pickupLocation,
  dropLocation,
  onDriverFound,
  onCancel,
}) {
  /*
    🚀 API INTEGRATION - BOOKING LOADER SCREEN:
    
    1. Driver Matching WebSocket:
       - WebSocket: ws://your-api.com/driver-search/{ride_id}
       - Real-time updates on driver search status
       - Receive driver acceptance/rejection notifications
       - Handle connection drops and reconnection
       
    2. Driver Search API:
       - API: POST /api/rides/{ride_id}/find-drivers
       - Algorithm matches based on: location, rating, vehicle type
       - Broadcasts ride request to nearby drivers
       - Implements timeout and fallback strategies
       
    3. Search Optimization:
       - Gradually expand search radius if no drivers found
       - Dynamic pricing suggestions to attract drivers
       - Machine learning for better driver-rider matching
       - ETA-based driver prioritization
       
    4. Push Notifications:
       - Notify user when driver is found
       - Send updates about search progress
       - Handle app in background scenarios
       - Use firebase_messaging package
       
    5. Real-time Analytics:
       - Track search duration and success rates
       - Monitor driver response times
       - A/B test different search algorithms
       - Performance metrics for optimization
       
    6. Cancellation Handling:
       - API: POST /api/rides/{ride_id}/cancel
       - Notify drivers about cancellation
       - Handle refunds if payment was processed
       - Update driver availability status
       
    7. Fallback Strategies:
       - Suggest alternative vehicle types
       - Recommend nearby pickup points
       - Show estimated wait times
       - Offer scheduled ride options
  */
  const [searchDots, setSearchDots] = useState(0);
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setSearchDots((prev) => (prev + 1) % 3);
    }, 500);

    // Track search time
    const timeInterval = setInterval(() => {
      setSearchTime((prev) => prev + 1);
    }, 1000);

    // Simulate driver found after 8-15 seconds
    const driverFoundTimer = setTimeout(
      () => {
        toast.success("Driver found!", {
          description: "Your driver is on the way",
          duration: 3000,
        });

        if (onDriverFound) {
          onDriverFound({
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            vehicle: "KA 01 AB 1234",
            rating: 4.8,
            eta: "5 mins",
          });
        }
      },
      Math.random() * 7000 + 8000,
    ); // 8-15 seconds

    return () => {
      clearInterval(dotsInterval);
      clearInterval(timeInterval);
      clearTimeout(driverFoundTimer);
    };
  }, [onDriverFound]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden isolate">
      {/* Map Background Layer - Locked to background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gray-100">
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('${imgUber0213C7Cd81E2}')`,
            }}
          />
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-80"
            style={{ backgroundImage: `url('${imgImage}')` }}
          />
        </div>
      </div>

      {/* UI Layer Container */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Main Content */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[25px] p-6 shadow-[0px_-10px_35px_0px_rgba(0,0,0,0.15)] z-40 pointer-events-auto">
        {/* Loading Status */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h2 className="font-['Poppins:Medium',_sans-serif] text-[28px] text-[#11211e]">
              Looking for nearby drivers
            </h2>
          </div>
          <p className="text-[#606060] text-[16px]">
            Search time: {formatTime(searchTime)}
          </p>
        </div>

        {/* Vehicle Icon */}
        <div className="flex justify-center mb-8">
          <VehicleIcon />
        </div>

        {/* Trip Details */}
        <div className="space-y-6 mb-8">
          {/* Pickup Location */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-[#cf923d] rounded-full mt-1 flex-shrink-0"></div>
            <div>
              <h3 className="font-['Poppins:Medium',_sans-serif] text-[18px] text-[#11211e] mb-1">
                Pickup Location
              </h3>
              <p className="text-[#606060] text-[14px]">
                {pickupLocation ||
                  "Kaikondrahalli, Bengaluru, Karnataka"}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-[#11211e] rounded-sm mt-1 flex-shrink-0"></div>
            <div>
              <h3 className="font-['Poppins:Medium',_sans-serif] text-[18px] text-[#11211e] mb-1">
                Destination
              </h3>
              <p className="text-[#606060] text-[14px]">
                {dropLocation ||
                  "Third Wave Coffee, 17th Cross Rd, PWD Quarters, 1st Sector, HSR Layout, Bengaluru, Karnataka"}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#e0e0e0]">
            <div className="w-4 h-4 bg-[#11211e] flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white"></div>
              </div>
            </div>
            <div>
              <h3 className="font-['Poppins:Bold',_sans-serif] text-[20px] text-[#11211e]">
                ₹{selectedVehicle?.price || "193.20"}
              </h3>
              <p className="text-[#606060] text-[14px]">
                {selectedVehicle?.paymentMethod || "Cash Cash"}
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full py-4 px-6 bg-[#f5f5f5] text-[#11211e] rounded-xl hover:bg-[#e8e8e8] transition-colors font-['Poppins:Medium',_sans-serif] text-[16px] flex items-center justify-center text-center"
        >
          Cancel Booking
        </button>
        </div>
      </div>
    </div>
  );
}