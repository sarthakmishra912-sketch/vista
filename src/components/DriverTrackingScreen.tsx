import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { rideService } from '../services/rideService';
import svgPaths from "../imports/svg-2aj2wlduut";
import imgFrame from "figma:asset/516e77515feb8b0da14eb9d08100d04603ad8beb.png";
import imgUber0213C7Cd81E2 from "figma:asset/0c4e8a4be75e7d129875490702ea90e0ae00c34d.png";
import imgUber0214Ed5498Cc from "figma:asset/8112b71db0207e4b1e1760bdd8a8e5bd9b137d81.png";
import imgRectangle8 from "figma:asset/71252cca4c888d88500481199a8e5e20a4996b73.png";
import imgImage from "figma:asset/176ba6c12ab7f022834992fb78872f1e9feeb9a4.png";

/*
  🚀 API INTEGRATION POINTS:
  
  1. Real-time Driver Location Updates:
     - Use WebSocket connection to track driver's GPS location
     - Update map markers and route in real-time
     - API: ws://your-api.com/driver-location/{ride_id}
  
  2. Live ETA Updates:
     - Calculate dynamic ETA based on traffic and driver location
     - API: GET /api/rides/{ride_id}/eta
  
  3. Driver Communication:
     - In-app messaging system between rider and driver
     - Push notifications for important updates
     - API: POST /api/rides/{ride_id}/messages
  
  4. Trip Status Updates:
     - Real-time trip status (approaching, arrived, started, etc.)
     - API: ws://your-api.com/trip-status/{ride_id}
  
  5. Emergency Features:
     - SOS button with location sharing
     - Emergency contacts notification
     - API: POST /api/rides/{ride_id}/emergency
*/

// Status bar component (removed for clean mobile experience)
function StatusIndicator() {
  return null; // Removed as per Raahi branding guidelines
}

function DriverCard({ driver, otp, pickupLocation, onCancel }) {
  /*
    🔄 API INTEGRATION:
    
    Driver Data Updates:
    - API: GET /api/drivers/{driver_id}
    - Updates: name, photo, vehicle details, rating
    - Real-time: WebSocket for status changes
    
    OTP Verification:
    - API: POST /api/rides/{ride_id}/verify-otp
    - Payload: { otp: string, ride_id: string }
    
    Rating System:
    - API: GET /api/drivers/{driver_id}/rating
    - Real-time rating updates from recent trips
    
    Messaging System:
    - API: POST /api/rides/{ride_id}/messages
    - WebSocket: ws://your-api.com/ride-chat/{ride_id}
    - Real-time message delivery and read receipts
  */
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      /*
        🚀 API INTEGRATION - SEND MESSAGE:
        
        1. Message API Call:
           - API: POST /api/rides/{ride_id}/messages
           - Payload: { message: string, sender: 'rider', timestamp: string }
           - Response: { message_id: string, delivered: boolean }
        
        2. Real-time Delivery:
           - WebSocket broadcast to driver
           - Push notification if driver app is in background
           - Message status updates (sent, delivered, read)
        
        3. Message Persistence:
           - Store in database for chat history
           - Sync across devices if user has multiple
           - Auto-delete after trip completion (privacy)
      */
      
      console.log("📨 Sending message to driver:", message);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add message to conversation
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'rider',
        timestamp: new Date().toISOString(),
        timeAgo: 'now'
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      toast.success("Message sent!", {
        description: "Driver will receive your message",
        duration: 2000,
      });
      
      setMessage(''); // Clear input after sending
      
      // Simulate driver response after a few seconds (only if this is the first message)
      if (messages.length === 0) {
        setTimeout(() => {
          const driverResponse = {
            id: Date.now() + 1,
            text: "I can see you! Coming to pickup in 2 minutes",
            sender: 'driver',
            timestamp: new Date().toISOString(),
            timeAgo: 'now'
          };
          
          setMessages(prev => [...prev, driverResponse]);
          
          toast.info("Driver replied", {
            description: "New message from your driver",
            duration: 3000,
          });
        }, 3000);
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      toast.error("Failed to send message", {
        description: "Please try again",
        duration: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="bg-white rounded-t-[25px] p-6 shadow-[0px_-10px_35px_0px_rgba(0,0,0,0.15)]">
      {/* Meet at pickup point header */}
      <div className="text-center mb-6">
        <h2 className="font-['Poppins:Medium',_sans-serif] text-[24px] text-[#11211e] mb-2">
          Meet at the pickup point
        </h2>
        <div className="bg-[#11211e] text-white px-4 py-2 rounded-full inline-flex items-center gap-2">
          <div className="w-2 h-2 bg-[#cf923d] rounded-full"></div>
          <span className="font-['Poppins:Medium',_sans-serif] text-[14px]">2 min</span>
        </div>
      </div>

      {/* Driver Details */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-[#f8f8f8] rounded-xl">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          <img 
            className="w-full h-full object-cover" 
            src={imgRectangle8} 
            alt={driver?.name || "Driver"} 
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-['Poppins:Medium',_sans-serif] text-[18px] text-[#11211e]">
              {realDriverData?.name || driver?.name || "Loading..."}
            </h3>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#cf923d">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="font-['Poppins:Medium',_sans-serif] text-[14px] text-[#11211e]">
                {realDriverData?.rating || driver?.rating || "4.9"}
              </span>
            </div>
          </div>
          
          <div className="text-[#11211e] font-['Poppins:Medium',_sans-serif] text-[16px] mb-1">
            {realDriverData?.vehicleNumber || driver?.vehicle || "Loading..."}
          </div>
          <div className="text-[#606060] text-[14px]">
            {realDriverData?.vehicleModel || driver?.vehicleModel || "Loading..."}
          </div>
        </div>
      </div>

      {/* Message History - Only show when there are messages */}
      {messages.length > 0 && (
        <div className="mb-4 max-h-32 overflow-y-auto scrollbar-hide bg-[#f8f8f8] rounded-xl p-3 animate-in slide-in-from-top-2 duration-300">
          <div className="text-center mb-2">
            <span className="text-[10px] text-[#888] font-['Poppins:Regular',_sans-serif]">
              Messages with driver
            </span>
          </div>
          <div className="space-y-2">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'rider' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`px-3 py-2 rounded-lg max-w-[70%] ${
                  msg.sender === 'rider' 
                    ? 'bg-[#cf923d] text-white rounded-br-sm' 
                    : 'bg-white text-[#11211e] rounded-bl-sm shadow-sm'
                }`}>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[12px]">{msg.text}</p>
                  <span className="text-[10px] opacity-75">{msg.timeAgo}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Message Input and OTP Row */}
      <div className={`flex gap-3 ${messages.length > 0 ? 'mb-6' : 'mb-6'}`}>
        <div className="flex-1 flex bg-[#f8f8f8] rounded-xl border border-[#e0e0e0] overflow-hidden">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message to driver..."
            className="flex-1 bg-transparent px-4 py-3 font-['Poppins:Regular',_sans-serif] text-[14px] text-[#11211e] placeholder:text-[#888] focus:outline-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && message.trim()) {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            className={`px-4 py-3 font-['Poppins:Medium',_sans-serif] text-[14px] transition-colors flex items-center justify-center ${
              message.trim() && !isSending
                ? 'text-[#cf923d] hover:bg-[#cf923d] hover:text-white'
                : 'text-[#ccc] cursor-not-allowed'
            }`}
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-[#cf923d] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
              </svg>
            )}
          </button>
        </div>
        
        <div className="bg-white border-2 border-[#a5a5a5] py-3 px-6 rounded-xl">
          <span className="font-['Poppins:Medium',_sans-serif] text-[16px]">
            <span className="text-[#cf923d]">OTP</span>
            <span className="text-[#333333]"> : </span>
            <span className="text-[#11211e]">{realOtp || otp || "2323"}</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <button 
          className="flex flex-col items-center justify-center gap-2 p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#e6f3ff] transition-colors text-center"
          onClick={() => {
            // TODO: Implement safety features
            // - Share live location with emergency contacts
            // - Display safety tips and emergency numbers
            // - API: POST /api/rides/{ride_id}/safety-check
            toast.info("Safety features activated", {
              description: "Location shared with emergency contacts",
              duration: 3000,
            });
          }}
        >
          <div className="w-8 h-8 bg-[#4285f4] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.9 16,12.4 16,13V16C16,17.1 15.1,18 14,18H10C8.9,18 8,17.1 8,16V13C8,12.4 8.6,11.9 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
            </svg>
          </div>
          <span className="font-['Poppins:Medium',_sans-serif] text-[12px] text-[#11211e]">Safety</span>
        </button>

        <button 
          className="flex flex-col items-center justify-center gap-2 p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#e6f3ff] transition-colors text-center"
          onClick={() => {
            // TODO: Implement trip sharing
            // - Generate shareable link with live tracking
            // - Send to selected contacts via SMS/WhatsApp
            // - API: POST /api/rides/{ride_id}/share
            toast.success("Trip sharing enabled", {
              description: "Live location link sent to contacts",
              duration: 3000,
            });
          }}
        >
          <div className="w-8 h-8 bg-[#4285f4] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
            </svg>
          </div>
          <span className="font-['Poppins:Medium',_sans-serif] text-[12px] text-[#11211e]">Share my trip</span>
        </button>

        <button 
          className="flex flex-col items-center justify-center gap-2 p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#e6f3ff] transition-colors text-center"
          onClick={() => {
            // TODO: Implement direct calling
            // - Use native phone app to call driver
            // - Log call duration for support purposes
            // - API: POST /api/rides/{ride_id}/call-log
            const phoneNumber = realDriverData?.phone || driver?.phone || "+91 98765 43210";
            toast.info("Calling driver...", {
              description: `Connecting to ${phoneNumber}`,
              duration: 2000,
            });
          }}
        >
          <div className="w-8 h-8 bg-[#4285f4] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
            </svg>
          </div>
          <span className="font-['Poppins:Medium',_sans-serif] text-[12px] text-[#11211e]">Call driver</span>
        </button>
      </div>

      {/* Cancel Ride Button */}
      <div className="mb-6">
        <button 
          className="w-full bg-[#ff4757] hover:bg-[#ff3742] active:bg-[#ff2636] text-white py-4 px-6 rounded-xl font-['Poppins:Medium',_sans-serif] text-[16px] transition-colors duration-200 shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center text-center"
          onClick={() => {
            /*
              🚀 API INTEGRATION - CANCEL RIDE:
              
              1. Ride Cancellation API:
                 - API: POST /api/rides/{ride_id}/cancel
                 - Payload: { reason: string, cancelled_by: 'rider' }
                 - Response: { success: boolean, cancellation_fee: number }
              
              2. Driver Notification:
                 - Send push notification to driver
                 - Update driver's availability status
                 - API: POST /api/notifications/driver/{driver_id}
              
              3. Payment Processing:
                 - Calculate cancellation fee based on timing
                 - Process refund if applicable
                 - API: POST /api/payments/cancel-ride
              
              4. Analytics & Tracking:
                 - Log cancellation reason for improvement
                 - Update user cancellation rate
                 - API: POST /api/analytics/ride-cancelled
            */
            
            // Show custom confirmation using toast
            toast.info("Cancel ride?", {
              description: "Cancellation charges may apply. Tap again within 3 seconds to confirm.",
              duration: 3000,
              action: {
                label: "Confirm Cancel",
                onClick: () => {
                  console.log("❌ User confirmed ride cancellation");
                  
                  toast.dismiss(); // Clear the confirmation toast
                  
                  toast.loading("Cancelling ride...", {
                    description: "Please wait while we process your cancellation",
                    duration: 2000,
                  });
                  
                  // Simulate API call delay
                  setTimeout(() => {
                    onCancel();
                  }, 2000);
                }
              }
            });
          }}
        >
          Cancel Ride
        </button>
      </div>

      {/* Pickup Location */}
      <div className="flex items-start gap-3 p-4 bg-[#f8f8f8] rounded-xl">
        <div className="w-4 h-4 bg-[#11211e] rounded-sm mt-1 flex-shrink-0"></div>
        <div>
          <h4 className="font-['Poppins:Medium',_sans-serif] text-[16px] text-[#11211e] mb-1">
            562/11-A
          </h4>
          <p className="text-[#606060] text-[14px]">
            {pickupLocation || "Kaikondrahalli, Bengaluru, Karnataka"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DriverTrackingScreen({
  driver,
  otp,
  pickupLocation,
  dropLocation,
  onTripComplete,
  onCancel,
}) {
  /*
    🗺️ API INTEGRATION - MAIN SCREEN:
    
    1. Map Integration:
       - Use Google Maps SDK or Mapbox
       - Real-time location updates via WebSocket
       - Route optimization and traffic data
       - API: GET /api/rides/{ride_id}/route
    
    2. Live Tracking:
       - Driver location updates every 5 seconds
       - API: ws://your-api.com/driver-location/{ride_id}
       - Passenger location sharing (optional)
    
    3. Trip Status Management:
       - Status: driver_assigned → approaching → arrived → trip_started → completed
       - API: GET /api/rides/{ride_id}/status
       - Push notifications for status changes
    
    4. Navigation Integration:
       - Open Google Maps for turn-by-turn navigation
       - Deep linking: https://maps.google.com/maps?daddr=lat,lng
    
    5. Payment Integration:
       - Real-time fare calculation
       - Multiple payment methods (UPI, cards, wallet)
       - API: POST /api/rides/{ride_id}/payment
  */

  const [tripStatus, setTripStatus] = useState('driver_assigned'); // driver_assigned, approaching, arrived, trip_started, completed
  const [eta, setEta] = useState('2 min');
  const [realDriverData, setRealDriverData] = useState<any>(null);
  const [isLoadingDriver, setIsLoadingDriver] = useState(false);
  const [rideId, setRideId] = useState<string | null>(null);
  const [realOtp, setRealOtp] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // Generate OTP for ride verification
  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Fetch real driver data from API
  const fetchDriverData = async () => {
    if (!rideId) return;
    
    setIsLoadingDriver(true);
    try {
      const rideData = await rideService.getRideById(rideId);
      if (rideData.driver) {
        setRealDriverData(rideData.driver);
      }
      
      // Generate OTP for this ride
      const otp = generateOTP();
      setRealOtp(otp);
    } catch (error) {
      console.error('Error fetching driver data:', error);
      toast.error('Failed to fetch driver data');
    } finally {
      setIsLoadingDriver(false);
    }
  };

  // Initialize ride ID from props or create a new ride
  useEffect(() => {
    if (driver?.rideId) {
      setRideId(driver.rideId);
    } else {
      // Create a new ride for tracking
      const createRide = async () => {
        try {
          const newRide = await rideService.createRide({
            pickupLat: 28.6139,
            pickupLng: 77.2090,
            dropLat: 28.5355,
            dropLng: 77.3910,
            vehicleType: 'SEDAN'
          });
          setRideId(newRide.id);
        } catch (error) {
          console.error('Error creating ride:', error);
        }
      };
      createRide();
    }
  }, [driver]);

  // Fetch driver data when ride ID is available
  useEffect(() => {
    if (rideId) {
      fetchDriverData();
    }
  }, [rideId]);

  useEffect(() => {
    // Real-time trip status updates
    // This would connect to WebSocket for live updates
    // Example: ws://your-api.com/trip-status/{ride_id}
    
    const statusUpdates = [
      { status: 'approaching', eta: '1 min', delay: 5000 },
      { status: 'arrived', eta: '0 min', delay: 15000 },
      { status: 'trip_started', eta: null, delay: 25000 },
    ];

    statusUpdates.forEach(({ status, eta: newEta, delay }) => {
      setTimeout(() => {
        setTripStatus(status);
        if (newEta !== null) setEta(newEta);
        
        // Show appropriate notifications
        switch (status) {
          case 'approaching':
            toast.info("Driver is approaching", {
              description: "Please be ready at the pickup point",
              duration: 4000,
            });
            break;
          case 'arrived':
            toast.success("Driver has arrived!", {
              description: "Please verify OTP and start your trip",
              duration: 5000,
            });
            break;
          case 'trip_started':
            toast.success("Trip started", {
              description: "Have a safe journey!",
              duration: 3000,
            });
            break;
        }
      }, delay);
    });

    // Cleanup function
    return () => {
      // TODO: Close WebSocket connections
      console.log("Cleanup: Closing real-time connections");
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden isolate">
      {/* Map Background Layer - Locked to background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gray-100">
          {/* Background map images */}
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url('${imgUber0213C7Cd81E2}')` }}
          />
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-80"
            style={{ backgroundImage: `url('${imgUber0214Ed5498Cc}')` }}
          />
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-60"
            style={{ backgroundImage: `url('${imgImage}')` }}
          />
        </div>
      </div>

      {/* Map Elements Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Driver marker */}
        <div className="absolute top-[45%] left-[15%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-[#cf923d]">
            <svg className="w-6 h-6 text-[#cf923d]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
            </svg>
          </div>
        </div>

        {/* Destination marker */}
        <div className="absolute top-[25%] right-[20%] transform translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-[#59C147] rounded-full shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Route line */}
        <svg 
          className="absolute top-[20%] left-[10%] w-[80%] h-[60%] pointer-events-none" 
          viewBox="0 0 250 132" 
          fill="none"
        >
          <path 
            d={svgPaths.p347eac80} 
            stroke="#cf923d" 
            strokeWidth="3" 
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>

        {/* Driver vehicle icon */}
        <div 
          className="absolute bg-no-repeat bg-center h-16 w-17 mix-blend-multiply"
          style={{ 
            backgroundImage: `url('${imgFrame}')`,
            top: '35%',
            left: '12%',
            transform: 'translate(-50%, -50%)',
            backgroundSize: '100% 100%'
          }}
        />
      </div>

      {/* UI Layer Container */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Bottom card with driver details */}
        <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-auto">
        <DriverCard 
          driver={driver}
          otp={otp}
          pickupLocation={pickupLocation}
          onCancel={onCancel}
        />
        </div>
      </div>
    </div>
  );
}