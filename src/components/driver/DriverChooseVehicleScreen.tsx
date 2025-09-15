import React, { useState, useEffect } from 'react';
import { toast } from "sonner@2.0.3";
import svgPaths from "../../imports/svg-pvhi2toqrz";
import img3ChooseVehicle from "figma:asset/176ba6c12ab7f022834992fb78872f1e9feeb9a4.png";

interface DriverChooseVehicleScreenProps {
  onBack?: () => void;
  onRideAccept?: (rideData: any) => void;
  onGoOnline?: (isOnline: boolean) => void;
  onVehicleSelect?: (vehicleType: string) => void; // New handler for vehicle selection
  userEmail: string | null;
  isOnline?: boolean;
}

interface RideRequest {
  id: string;
  type: 'bike_rescue' | 'commercial' | 'golden_ride';
  title: string;
  earning: string;
  earningColor: string;
  pickupDistance: string;
  pickupTime: string;
  dropDistance: string;
  dropTime: string;
  pickupLocation: string;
  dropLocation: string;
  buttonText: string;
  buttonColor: string;
  cardBackground: string;
  borderColor: string;
}

export default function DriverChooseVehicleScreen({
  onBack,
  onRideAccept,
  onGoOnline,
  onVehicleSelect,
  userEmail,
  isOnline = false
}: DriverChooseVehicleScreenProps) {
  const [driverOnlineStatus, setDriverOnlineStatus] = useState(isOnline);
  const [currentEarnings, setCurrentEarnings] = useState("0.00");
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);

  console.log("🚗 Rendering Driver Choose Vehicle Screen for:", userEmail);

  /* ========================================
   * API INTEGRATION POINT: REAL-TIME RIDE REQUESTS
   * ========================================
   * Set up real-time connection for incoming ride requests:
   * 
   * ```
   * useEffect(() => {
   *   if (driverOnlineStatus) {
   *     // Connect to ride request WebSocket
   *     const rideSocket = rideApi.connectToRideRequests({
   *       driverId: driverId,
   *       location: getCurrentLocation(),
   *       vehicleType: getDriverVehicleType(),
   *       serviceTypes: getDriverServiceTypes()
   *     });
   * 
   *     // Listen for new ride requests
   *     rideSocket.on('new_ride_request', (rideData) => {
   *       setRideRequests(prev => [...prev, formatRideRequest(rideData)]);
   *       
   *       // Show notification for new ride
   *       toast.info(`New ${rideData.serviceType} request!`, {
   *         description: `₹${rideData.estimatedEarning} • ${rideData.distance}km`,
   *         duration: 10000,
   *         action: {
   *           label: "Accept",
   *           onClick: () => handleRideAccept(rideData.id)
   *         }
   *       });
   *     });
   * 
   *     // Listen for request cancellations
   *     rideSocket.on('ride_request_cancelled', (requestId) => {
   *       setRideRequests(prev => prev.filter(req => req.id !== requestId));
   *       toast.info("Ride request cancelled");
   *     });
   * 
   *     return () => rideSocket.disconnect();
   *   }
   * }, [driverOnlineStatus]);
   * ```
   * ======================================== */

  useEffect(() => {
    // DEMO: Load mock ride requests (REPLACE WITH REAL API)
    const mockRideRequests: RideRequest[] = [
      {
        id: 'ride_1',
        type: 'bike_rescue',
        title: 'Bike Rescue',
        earning: '₹200.00',
        earningColor: '#38a35f',
        pickupDistance: '1.5 km',
        pickupTime: '5 min away',
        dropDistance: '7.8 km', 
        dropTime: '12 min away',
        pickupLocation: 'Safdarjung Enclave, Gali no.20',
        dropLocation: 'Chandni Chowk, Metro Station gate 4',
        buttonText: 'Accept Ride',
        buttonColor: '#e3e3e3',
        cardBackground: '#ffffff',
        borderColor: '#7b7b7b'
      },
      {
        id: 'ride_2',
        type: 'commercial',
        title: 'Raahi - Driver',
        earning: '₹2500.00',
        earningColor: '#c06821',
        pickupDistance: '15.5 km',
        pickupTime: '5 min away',
        dropDistance: '27.8 km',
        dropTime: '12 min away',
        pickupLocation: 'Safdarjung Enclave, Gali no.20',
        dropLocation: 'Chandni Chowk, Metro Station gate 4',
        buttonText: 'Golden Ride',
        buttonColor: '#e3e3e3',
        cardBackground: '#fffefd',
        borderColor: '#c06821'
      },
      {
        id: 'ride_3',
        type: 'golden_ride',
        title: 'Bike Rescue',
        earning: '₹200.00 / hr.',
        earningColor: '#000000',
        pickupDistance: '0 km',
        pickupTime: '0 min away',
        dropDistance: '0 km',
        dropTime: '0 min away',
        pickupLocation: 'Safdarjung Enclave, Gali no.20',
        dropLocation: 'Chandni Chowk, Metro Station gate 4',
        buttonText: 'Accept Ride',
        buttonColor: '#38a35f',
        cardBackground: '#f9f3eb',
        borderColor: '#505050'
      }
    ];

    setRideRequests(mockRideRequests);

    /* ========================================
     * API INTEGRATION: FETCH DRIVER DATA
     * ========================================
     * Load driver's current data and earnings:
     * 
     * ```
     * const fetchDriverData = async () => {
     *   try {
     *     // Get current earnings
     *     const earningsResponse = await driverApi.getTodayEarnings(driverId);
     *     setCurrentEarnings(earningsResponse.data.totalEarnings);
     * 
     *     // Get driver status
     *     const statusResponse = await driverApi.getDriverStatus(driverId);
     *     setDriverOnlineStatus(statusResponse.data.isOnline);
     * 
     *     // Get available ride requests
     *     const ridesResponse = await rideApi.getAvailableRides({
     *       driverId: driverId,
     *       location: getCurrentLocation(),
     *       radius: 10, // km
     *       vehicleTypes: getDriverVehicleTypes()
     *     });
     *     setRideRequests(ridesResponse.data.rides);
     *   } catch (error) {
     *     console.error('Error fetching driver data:', error);
     *   }
     * };
     * 
     * fetchDriverData();
     * ```
     * ======================================== */
  }, []);

  const handleGoOnline = async () => {
    console.log("🔄 Toggling driver online status:", !driverOnlineStatus);
    
    try {
      /* ========================================
       * API INTEGRATION: UPDATE DRIVER STATUS
       * ========================================
       * Update driver's online/offline status:
       * 
       * ```
       * const statusResponse = await driverApi.updateDriverStatus({
       *   driverId: driverId,
       *   isOnline: !driverOnlineStatus,
       *   location: await getCurrentLocation(),
       *   timestamp: new Date().toISOString()
       * });
       * 
       * if (statusResponse.success) {
       *   setDriverOnlineStatus(!driverOnlineStatus);
       *   
       *   if (!driverOnlineStatus) {
       *     // Going online - start location tracking
       *     startLocationTracking();
       *     connectToRideRequests();
       *   } else {
       *     // Going offline - stop tracking
       *     stopLocationTracking();
       *     disconnectFromRideRequests();
       *   }
       * }
       * ```
       * ======================================== */

      // DEMO: Toggle status locally (REPLACE WITH REAL API)
      const newStatus = !driverOnlineStatus;
      setDriverOnlineStatus(newStatus);
      
      // Update parent component if handler provided
      if (onGoOnline) {
        onGoOnline(newStatus);
      }
      
      toast.success(newStatus ? "You're now online!" : "You're now offline", {
        description: newStatus ? "You'll receive ride requests" : "You won't receive ride requests",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating driver status:", error);
      toast.error("Failed to update status", {
        description: "Please try again",
        duration: 3000,
      });
    }
  };

  const handleRideAccept = async (rideId: string) => {
    console.log("✅ Accepting ride:", rideId);
    
    try {
      /* ========================================
       * API INTEGRATION: ACCEPT RIDE REQUEST
       * ========================================
       * Accept a ride request and update status:
       * 
       * ```
       * const acceptResponse = await rideApi.acceptRideRequest({
       *   rideId: rideId,
       *   driverId: driverId,
       *   acceptedAt: new Date().toISOString(),
       *   estimatedArrival: calculateETA()
       * });
       * 
       * if (acceptResponse.success) {
       *   // Update ride status
       *   await rideApi.updateRideStatus(rideId, 'DRIVER_ASSIGNED');
       *   
       *   // Notify passenger
       *   await notificationApi.notifyPassenger(acceptResponse.data.passengerId, {
       *     type: 'DRIVER_ASSIGNED',
       *     driverInfo: getDriverInfo(),
       *     estimatedArrival: acceptResponse.data.estimatedArrival
       *   });
       *   
       *   // Remove from available requests
       *   setRideRequests(prev => prev.filter(req => req.id !== rideId));
       *   
       *   // Navigate to ride tracking
       *   if (onRideAccept) {
       *     onRideAccept(acceptResponse.data);
       *   }
       * }
       * ```
       * ======================================== */
      
      const acceptedRide = rideRequests.find(ride => ride.id === rideId);
      
      if (acceptedRide) {
        // DEMO: Remove from available requests (REPLACE WITH REAL API)
        setRideRequests(prev => prev.filter(req => req.id !== rideId));
        
        toast.success("Ride accepted!", {
          description: `${acceptedRide.title} - ${acceptedRide.earning}`,
          duration: 4000,
        });
        
        // Call parent handler if provided
        if (onRideAccept) {
          onRideAccept({
            id: rideId,
            type: acceptedRide.type,
            earning: acceptedRide.earning,
            pickup: acceptedRide.pickupLocation,
            drop: acceptedRide.dropLocation
          });
        }
      }
    } catch (error) {
      console.error("Error accepting ride:", error);
      toast.error("Failed to accept ride", {
        description: "Please try again",
        duration: 3000,
      });
    }
  };

  const handleVehicleOptionClick = (vehicleType: string) => {
    console.log("🚗 Vehicle option selected:", vehicleType);
    
    /* ========================================
     * API INTEGRATION POINT: VEHICLE TYPE SELECTION
     * ========================================
     * When driver selects a vehicle type, update their preferences:
     * 
     * ```
     * await driverApi.updateDriverPreferences({
     *   driverId: driverId,
     *   selectedVehicleType: vehicleType,
     *   serviceTypes: getServiceTypesForVehicle(vehicleType),
     *   updatedAt: new Date().toISOString()
     * });
     * ```
     * ======================================== */
    
    if (onVehicleSelect) {
      onVehicleSelect(vehicleType);
    }
    
    toast.success(`${vehicleType} selected!`, {
      description: "Taking you to ride selection screen",
      duration: 2000,
    });
  };

  const handleWayBill = () => {
    console.log("📄 WayBill clicked");
    
    /* ========================================
     * API INTEGRATION: WAYBILL FUNCTIONALITY
     * ========================================
     * Handle waybill generation and management:
     * 
     * ```
     * const openWayBill = async () => {
     *   try {
     *     const wayBillResponse = await driverApi.getWayBill(driverId);
     *     
     *     // Open waybill interface
     *     window.open(wayBillResponse.data.wayBillUrl, '_blank');
     *   } catch (error) {
     *     toast.error("WayBill unavailable", {
     *       description: "Complete your current ride first"
     *     });
     *   }
     * };
     * ```
     * ======================================== */
    
    toast.info("WayBill", {
      description: "Feature coming soon",
      duration: 2000,
    });
  };

  return (
    <div 
      className="bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] bg-white box-border content-stretch flex flex-col gap-5 items-center justify-start pb-0 pt-20 px-0 relative size-full min-h-screen"
      style={{ backgroundImage: `url('${img3ChooseVehicle}')` }}
    >
      <div className="basis-0 content-stretch flex flex-col gap-10 grow items-center justify-start min-h-px min-w-px relative shrink-0 w-full">
        
        {/* Top Section - Driver Status */}
        <div className="content-stretch flex flex-col gap-[81px] items-center justify-start relative shrink-0 w-[585px] max-w-full px-4">
          
          {/* Driver Status Icons */}
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
            
            {/* Left Status - Menu/Profile */}
            <div className="h-[110.881px] relative shrink-0 w-[102.245px]">
              <div className="absolute bg-white box-border content-stretch flex flex-col gap-[7.144px] items-center justify-center left-[-0.19px] p-[26.791px] rounded-[45.545px] size-[90px] top-4">
                <div className="content-stretch flex flex-col gap-[7.144px] items-start justify-start relative shrink-0 w-full">
                  <div className="bg-[#505050] h-[4.228px] rounded-[17.97px] shrink-0 w-full" />
                  <div className="bg-[#505050] h-[4.228px] rounded-[17.97px] shrink-0 w-[41.226px]" />
                  <div className="bg-[#505050] h-[4.228px] rounded-[17.97px] shrink-0 w-[41.226px]" />
                </div>
              </div>
              <div className="absolute bg-[#3690d8] box-border content-stretch flex flex-col gap-[3.802px] items-center justify-center left-[58px] p-[14.256px] rounded-[24.235px] size-[38px] top-1.5">
                <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[22px] text-nowrap text-white">
                  <p className="leading-[60.648px] whitespace-pre">90</p>
                </div>
              </div>
            </div>

            {/* Center Status - Earnings */}
            <div className="content-stretch flex flex-col gap-2.5 items-center justify-center relative shrink-0">
              <div className="bg-neutral-800 box-border content-stretch flex flex-col gap-[6.215px] h-[82.347px] items-center justify-center pl-[15.537px] pr-[23.306px] py-[23.306px] relative rounded-[29px] shrink-0">
                <div className="content-stretch flex gap-[15.537px] items-center justify-start leading-[0] relative shrink-0 text-nowrap">
                  <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center relative shrink-0 text-[#38a35f] text-[31.869px]">
                    <p className="leading-[60.253px] text-nowrap whitespace-pre">₹</p>
                  </div>
                  <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center not-italic relative shrink-0 text-[41.875px] text-white tracking-[-1.675px]">
                    <p className="leading-[79.17px] text-nowrap whitespace-pre">{currentEarnings}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white relative rounded-[18px] shrink-0 w-full">
                <div className="flex flex-col items-center justify-center relative size-full">
                  <div className="box-border content-stretch flex flex-col gap-[3.547px] items-center justify-center px-5 py-2.5 relative w-full">
                    <div className="content-stretch flex gap-[8.868px] items-center justify-start relative shrink-0">
                      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[19.179px] text-neutral-800 text-nowrap tracking-[-0.7672px]">
                        <p className="leading-[36.261px] whitespace-pre">
                          <span>Today - </span>
                          <span className="font-['Poppins:Light',_sans-serif] not-italic">26.07.2025</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Status - Settings */}
            <div className="bg-white box-border content-stretch flex flex-col gap-[6.917px] items-center justify-center p-[25.94px] relative rounded-[44.099px] shrink-0 size-[90px]">
              <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#505050] text-[35.472px] text-nowrap">
                <p className="leading-[67.065px] whitespace-pre">⚙️</p>
              </div>
            </div>
          </div>

          {/* Go Online Button */}
          <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[10px] relative rounded-[49px] shrink-0">
            <div className="absolute border border-[#040404] border-solid inset-0 pointer-events-none rounded-[49px]" />
            <button
              onClick={handleGoOnline}
              className={`box-border content-stretch flex gap-[15px] h-[124.612px] items-center justify-center leading-[0] pl-[35.304px] pr-[30px] py-[35.306px] relative rounded-[42px] shrink-0 text-[49.158px] text-nowrap text-white transition-colors ${
                driverOnlineStatus ? 'bg-[#38a35f]' : 'bg-[#0571dd]'
              }`}
            >
              <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center not-italic relative shrink-0 tracking-[-1.9663px]">
                <p className="leading-[92.939px] text-nowrap whitespace-pre">
                  {driverOnlineStatus ? 'Go Offline' : 'Go Online'}
                </p>
              </div>
              <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center relative shrink-0">
                <p className="leading-[92.939px] text-nowrap whitespace-pre">
                  {driverOnlineStatus ? '⏸️' : '▶️'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Section - Ride Requests */}
        <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-tl-[30px] rounded-tr-[30px] shrink-0 w-full">
          <div className="relative size-full">
            <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start pb-0 pt-[30px] px-[30px] relative size-full">
              
              {/* Header */}
              <div className="content-stretch flex flex-col gap-2.5 items-center justify-center relative shrink-0 w-full">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                  <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#505050] text-[41.023px] text-nowrap">
                    <p className="leading-[77.56px] whitespace-pre">≡</p>
                  </div>
                  <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                    <div className="[grid-area:1_/_1] box-border content-stretch flex flex-col items-start justify-start ml-0 mt-0 relative">
                      <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#080a24] text-[36px] tracking-[-1.44px] w-full">
                        <p className="leading-[normal]">{driverOnlineStatus ? "You're Online" : "You're Offline"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-[46px]">
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                        <div className="flex flex-row items-center self-stretch">
                          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                            <div className="relative shrink-0 size-[3px]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
                                <circle cx="1.5" cy="1.5" fill="#505050" r="1.5" />
                              </svg>
                            </div>
                            <div className="relative shrink-0 size-[3px]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
                                <circle cx="1.5" cy="1.5" fill="#505050" r="1.5" />
                              </svg>
                            </div>
                            <div className="relative shrink-0 size-[3px]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
                                <circle cx="1.5" cy="1.5" fill="#505050" r="1.5" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-[21.713px] relative shrink-0 w-[41.063px]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 22">
                          <path d={svgPaths.ped12800} fill="#505050" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="basis-0 content-stretch flex flex-col gap-10 grow items-start justify-start min-h-px min-w-px relative shrink-0 w-full">
                
                {/* Ride Offers Notification */}
                <div className="content-stretch flex flex-col gap-5 items-start justify-start relative shrink-0 w-full">
                  <div className="content-stretch flex gap-2.5 items-center justify-start relative shrink-0 w-full">
                    <div className="box-border content-stretch flex gap-[13px] items-end justify-start pl-2.5 pr-[15px] py-[7px] relative rounded-[38px] shadow-[0px_2px_3px_0px_rgba(0,0,0,0.07)] shrink-0">
                      <div className="flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[16px] text-nowrap">
                        <p className="leading-[20px] whitespace-pre">Ride Offers, Start Ride Now!</p>
                      </div>
                    </div>
                  </div>

                  {/* Ride Requests Cards */}
                  <div className="content-stretch flex gap-[21.578px] items-start justify-start relative shrink-0 w-full overflow-x-auto scrollbar-hide">
                    {rideRequests.map((ride, index) => (
                      <div 
                        key={ride.id}
                        className="box-border content-stretch flex flex-col h-[631.164px] items-start justify-between p-[21.578px] relative rounded-[21.578px] shrink-0 w-[381.935px] min-w-[320px]"
                        style={{ 
                          backgroundColor: ride.cardBackground,
                          opacity: index === 2 ? 0.6 : 1 
                        }}
                      >
                        <div className="absolute border-2 border-solid inset-0 pointer-events-none rounded-[21.578px]" style={{ borderColor: ride.borderColor }} />
                        
                        {/* Ride Details */}
                        <div className="content-stretch flex flex-col gap-[21.578px] items-start justify-start relative shrink-0 w-full">
                          
                          {/* Earning Info */}
                          <div className="content-stretch flex flex-col gap-[267.57px] h-[316.121px] items-start justify-start relative shrink-0 w-full">
                            <div className="basis-0 content-stretch flex flex-col grow items-start justify-between min-h-px min-w-px relative shrink-0 w-full">
                              <div className="content-stretch flex flex-col gap-[7.552px] items-start justify-start leading-[0] not-italic relative shrink-0 w-full">
                                <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[#656565] text-[19.42px] text-nowrap">
                                  <p className="leading-[normal] whitespace-pre">{ride.title}</p>
                                </div>
                                <div className="font-['Poppins:Medium',_sans-serif] leading-[1.2] relative shrink-0 text-[0px] text-black w-[233.045px]">
                                  <p className="mb-0 text-[26.428px]">Earning</p>
                                  <p className="text-[43.246px]" style={{ color: ride.earningColor }}>{ride.earning}</p>
                                </div>
                              </div>

                              {/* Distance Info */}
                              <div className="bg-[#f5f5f5] relative rounded-[12.889px] shrink-0 w-full">
                                <div className="overflow-clip relative size-full">
                                  <div className="box-border content-stretch flex flex-col gap-[10.789px] items-start justify-start px-[16.184px] py-[9.667px] relative w-full">
                                    
                                    {/* Pickup Distance */}
                                    <div className="content-stretch flex flex-col gap-[9.164px] items-start justify-start relative shrink-0 w-full">
                                      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                                        <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[20.161px] text-black w-[118.132px]">
                                          <p className="leading-[normal]">Pickup Distance</p>
                                        </div>
                                        <div className="h-0 relative shrink-0 w-[27.615px]">
                                          <div className="absolute inset-[-0.77px_-2.78%]">
                                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 2">
                                              <path d="M1 1H28.6152" opacity="0.2" stroke="black" strokeLinecap="round" strokeWidth="1.53418" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="flex flex-row items-center self-stretch">
                                          <div className="content-stretch flex flex-col gap-[15.342px] h-full items-center justify-center leading-[0] not-italic relative shrink-0 text-nowrap w-[134.681px]">
                                            <div className="font-['Poppins:Bold',_sans-serif] relative shrink-0 text-[#2e2e2e] text-[24.925px]">
                                              <p className="leading-[31.156px] text-nowrap whitespace-pre">{ride.pickupDistance}</p>
                                            </div>
                                            <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[14.662px] text-black">
                                              <p className="leading-[18.328px] text-nowrap whitespace-pre">{ride.pickupTime}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Separator Line */}
                                    <div className="flex items-center justify-center relative shrink-0 w-full h-[306.411px]">
                                      <div className="flex-none rotate-[90deg] w-full">
                                        <div className="h-[306.411px] relative w-full">
                                          <div className="absolute bottom-0 left-[-0.46px] right-[-0.46px] top-0">
                                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 307">
                                              <path d="M1 0V306.411" stroke="#E8E8E8" strokeWidth="0.9164" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Drop Distance */}
                                    <div className="content-stretch flex flex-col gap-[9.164px] items-center justify-center relative shrink-0 w-full">
                                      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                                        <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[20.161px] text-black w-[118.132px]">
                                          <p className="leading-[normal]">Drop Distance</p>
                                        </div>
                                        <div className="h-0 relative shrink-0 w-[27.615px]">
                                          <div className="absolute inset-[-0.77px_-2.78%]">
                                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 2">
                                              <path d="M1 1H28.6152" opacity="0.2" stroke="black" strokeLinecap="round" strokeWidth="1.53418" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="flex flex-row items-center self-stretch">
                                          <div className="content-stretch flex flex-col gap-[15.342px] h-full items-center justify-center leading-[0] not-italic relative shrink-0 text-nowrap w-[134.681px]">
                                            <div className="font-['Poppins:Bold',_sans-serif] relative shrink-0 text-[#1facbb] text-[26.081px]">
                                              <p className="leading-[18.328px] text-nowrap whitespace-pre">{ride.dropDistance}</p>
                                            </div>
                                            <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[14.662px] text-black">
                                              <p className="leading-[18.328px] text-nowrap whitespace-pre">{ride.dropTime}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Separator */}
                          <div className="h-0 relative shrink-0 w-full">
                            <div className="absolute bottom-[-0.54px] left-0 right-0 top-[-0.54px]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 339 2">
                                <path d="M0 1H338.779" stroke="black" strokeOpacity="0.12" strokeWidth="1.07891" />
                              </svg>
                            </div>
                          </div>

                          {/* Pickup/Drop Locations */}
                          <div className="content-stretch flex flex-col gap-[10.789px] items-start justify-start relative shrink-0 w-full">
                            <div className="content-stretch flex font-['Poppins:Regular',_sans-serif] gap-[110.049px] items-start justify-start leading-[0] not-italic relative shrink-0 text-[28.052px] text-black text-nowrap w-full">
                              <div className="relative shrink-0">
                                <p className="leading-[normal] text-nowrap whitespace-pre">Pickup</p>
                              </div>
                              <div className="relative shrink-0">
                                <p className="leading-[normal] text-nowrap whitespace-pre">Drop</p>
                              </div>
                            </div>
                            <div className="content-stretch flex gap-[21.578px] items-center justify-start relative shrink-0 w-full">
                              <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                                <div className="basis-0 content-stretch flex gap-[10.789px] grow h-full items-start justify-start min-h-px min-w-px relative shrink-0">
                                  <div className="basis-0 content-stretch flex flex-col gap-[10.789px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
                                    <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#2e2e2e] text-[17.263px] w-full">
                                      <p className="leading-[21.578px]">{ride.pickupLocation}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="h-[0.005px] relative shrink-0 w-[21.578px]">
                                <div className="absolute inset-[-8.08px_-5%_-7.8px_-5%]">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 17">
                                    <path d={svgPaths.p27b8b880} fill="black" />
                                  </svg>
                                </div>
                              </div>
                              <div className="basis-0 content-stretch flex gap-[10.789px] grow items-start justify-start min-h-px min-w-px relative shrink-0">
                                <div className="basis-0 content-stretch flex flex-col gap-[10.789px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
                                  <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#2e2e2e] text-[17.263px] w-full">
                                    <p className="leading-[21.578px]">{ride.dropLocation}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Accept Button */}
                        <div className="content-stretch flex flex-col gap-[5.395px] items-start justify-start relative shrink-0 w-full">
                          <div className="content-stretch flex gap-[21.578px] items-start justify-start relative shrink-0 w-full">
                            <button
                              onClick={() => handleRideAccept(ride.id)}
                              className="basis-0 grow h-[84.567px] min-h-px min-w-px relative rounded-[21.578px] shrink-0 transition-colors hover:opacity-90"
                              style={{ backgroundColor: ride.buttonColor }}
                            >
                              <div className="flex flex-row items-center justify-center relative size-full">
                                <div className="box-border content-stretch flex gap-[16.184px] h-[84.567px] items-center justify-center leading-[0] pl-[23.959px] pr-[20.359px] py-[23.96px] relative text-nowrap text-white w-full">
                                  <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center not-italic relative shrink-0 text-[31.626px] tracking-[-1.265px]">
                                    <p className="leading-[59.793px] text-nowrap whitespace-pre">{ride.buttonText}</p>
                                  </div>
                                  <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center relative shrink-0 text-[33.36px]">
                                    <p className="leading-[63.072px] text-nowrap whitespace-pre">→</p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Scroll Indicator */}
                  <div className="bg-[#f8f8f8] h-[21px] relative rounded-[84px] shrink-0 w-full">
                    <div className="relative size-full">
                      <div className="box-border content-stretch flex flex-col gap-2.5 h-[21px] items-start justify-start px-[72px] py-[5px] relative w-full">
                        <div className="basis-0 bg-[#e0e0e0] grow min-h-px min-w-px relative rounded-[62px] shrink-0 w-[90px]">
                          <div className="relative size-full">
                            <div className="h-full w-[90px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Notification */}
                <div className="content-stretch flex flex-col gap-2.5 items-start justify-start relative shrink-0 w-full">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                    <div className="content-stretch flex gap-2.5 items-center justify-start leading-[0] relative shrink-0 text-[18px] text-nowrap">
                      <div className="font-['SF_Pro:Regular',_sans-serif] font-normal relative shrink-0 text-[#cf923d]">
                        <p className="leading-[normal] text-nowrap whitespace-pre">ℹ️</p>
                      </div>
                      <div className="font-['Poppins:Regular',_sans-serif] not-italic relative shrink-0 text-[#656565]">
                        <p className="leading-[normal] text-nowrap whitespace-pre">Account</p>
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[18px]">
                      <div className="absolute flex h-[17.987px] items-center justify-center left-0 top-0 w-[17.987px]">
                        <div className="flex-none rotate-[315deg]">
                          <div className="bg-[#505050] h-[2.368px] rounded-[10.064px] w-[23.088px]" />
                        </div>
                      </div>
                      <div className="absolute flex h-[17.987px] items-center justify-center left-0 top-0 w-[17.987px]">
                        <div className="flex-none rotate-[225deg] scale-y-[-100%]">
                          <div className="bg-[#505050] h-[2.368px] rounded-[10.064px] w-[23.088px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="font-['Poppins:Medium',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[28px] text-black">
                    <p className="leading-[normal]">Certain ratings are now excluded</p>
                  </div>
                  <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#656565] text-[18px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre">For reasons outside of your control, such as traffic.</p>
                  </div>
                </div>

                {/* WayBill Button */}
                <button
                  onClick={handleWayBill}
                  className="bg-white relative rounded-[20px] shrink-0 w-full border border-black hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-row items-center justify-center relative size-full">
                    <div className="box-border content-stretch flex gap-2.5 items-center justify-center p-[20px] relative w-full">
                      <div className="basis-0 font-['Poppins:Medium',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#cf923d] text-[28px] text-center">
                        <p className="leading-[normal]">WayBill</p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}