import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { imgEllipse300, img, imgVector47, imgVector44, imgVector43, imgVector37, imgVector45, imgVector38 } from "../../imports/svg-ru0zr";
import svgPaths from "../../imports/svg-l145m4g3nd";

interface DriverRideSelectionScreenProps {
  onBack: () => void;
  onAcceptRide: (rideData: any) => void;
  onToggleOnline: (isOnline: boolean) => void;
  onSupport: () => void;
  userEmail: string | null;
  isOnline: boolean;
  selectedVehicleType: string;
}

export default function DriverRideSelectionScreen({
  onBack,
  onAcceptRide,
  onToggleOnline,
  onSupport,
  userEmail,
  isOnline,
  selectedVehicleType
}: DriverRideSelectionScreenProps) {
  const [showAccountInfo, setShowAccountInfo] = useState(false);

  // Component functions from Figma design - all scaled down for mobile
  function Frame1410081569() {
    return (
      <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full">
        <div className="bg-[#505050] h-1 rounded-[4px] shrink-0 w-full" />
        <div className="bg-[#505050] h-1 rounded-[4px] shrink-0 w-[10px]" />
        <div className="bg-[#505050] h-1 rounded-[4px] shrink-0 w-[10px]" />
      </div>
    );
  }

  function Frame1410081214() {
    return (
      <div className="absolute bg-white box-border content-stretch flex flex-col gap-1 items-center justify-center left-0 p-4 rounded-[16px] size-[60px] top-1">
        <Frame1410081569 />
      </div>
    );
  }

  function Frame1410081572() {
    return (
      <div className="absolute bg-[#3690d8] box-border content-stretch flex flex-col gap-1 items-center justify-center left-[38px] p-2 rounded-[8px] size-[24px] top-1">
        <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[12px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[20px] whitespace-pre">90</p>
        </div>
      </div>
    );
  }

  function Frame1410081581() {
    return (
      <div className="h-[70px] relative shrink-0 w-[70px]">
        <Frame1410081214 />
        <Frame1410081572 />
      </div>
    );
  }

  function Frame1410081570() {
    return (
      <div className="content-stretch flex gap-2 items-center justify-start leading-[0] relative shrink-0 text-nowrap">
        <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center relative shrink-0 text-[#38a35f] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[24px] text-nowrap whitespace-pre">􁑉</p>
        </div>
        <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center not-italic relative shrink-0 text-[20px] text-white tracking-[-0.8px]">
          <p className="leading-[28px] text-nowrap whitespace-pre">0.00</p>
        </div>
      </div>
    );
  }

  function Frame1410081216() {
    return (
      <div className="bg-neutral-800 box-border content-stretch flex flex-col gap-1 h-[50px] items-center justify-center px-3 py-3 relative rounded-[16px] shrink-0">
        <Frame1410081570 />
      </div>
    );
  }

  function Frame1410081571() {
    return (
      <div className="content-stretch flex gap-2 items-center justify-start relative shrink-0">
        <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-neutral-800 text-nowrap tracking-[-0.48px]">
          <p className="leading-[18px] whitespace-pre">
            <span>{`Today - `}</span>
            <span className="font-['Poppins:Light',_sans-serif] not-italic">26.07.2025</span>
          </p>
        </div>
      </div>
    );
  }

  function Frame1410081582() {
    return (
      <div className="bg-white relative rounded-[12px] shrink-0 w-full">
        <div className="flex flex-col items-center justify-center relative size-full">
          <div className="box-border content-stretch flex flex-col gap-1 items-center justify-center px-3 py-2 relative w-full">
            <Frame1410081571 />
          </div>
        </div>
      </div>
    );
  }

  function Frame1410081588() {
    return (
      <div className="content-stretch flex flex-col gap-2 items-center justify-center relative shrink-0">
        <Frame1410081216 />
        <Frame1410081582 />
      </div>
    );
  }

  function Frame1410081215() {
    return (
      <div 
        className="bg-white box-border content-stretch flex flex-col gap-2 items-center justify-center p-4 relative rounded-[16px] shrink-0 size-[60px] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setShowAccountInfo(!showAccountInfo)}
      >
        <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#505050] text-[20px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[24px] whitespace-pre">􀊫</p>
        </div>
      </div>
    );
  }

  function Frame1410081587() {
    return (
      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
        <Frame1410081581 />
        <Frame1410081588 />
        <Frame1410081215 />
      </div>
    );
  }

  function Frame1410081217() {
    return (
      <div 
        className="bg-[#0571dd] box-border content-stretch flex gap-3 h-[70px] items-center justify-center leading-[0] px-6 py-4 relative rounded-[24px] shrink-0 text-[24px] text-nowrap text-white cursor-pointer hover:bg-[#045bb8] transition-colors"
        onClick={() => {
          const newStatus = !isOnline;
          onToggleOnline(newStatus);
          
          if (newStatus) {
            toast.success("You're now online!", {
              description: "You'll start receiving ride requests",
              duration: 3000,
            });
          } else {
            toast.info("You're now offline", {
              description: "You won't receive new ride requests",
              duration: 3000,
            });
          }
        }}
      >
        <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center not-italic relative shrink-0 tracking-[-0.96px]">
          <p className="leading-[32px] text-nowrap whitespace-pre">{isOnline ? "Go Offline" : "Go Online"}</p>
        </div>
        <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[32px] text-nowrap whitespace-pre">􀷄</p>
        </div>
      </div>
    );
  }

  function Frame1410081580() {
    return (
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-2 relative rounded-[24px] shrink-0">
        <div aria-hidden="true" className="absolute border border-[#040404] border-solid inset-0 pointer-events-none rounded-[24px]" />
        <Frame1410081217 />
      </div>
    );
  }

  function Frame1410081583() {
    return (
      <div className="content-stretch flex flex-col h-[200px] items-center justify-between relative shrink-0 w-full max-w-sm">
        <Frame1410081587 />
        <Frame1410081580 />
      </div>
    );
  }

  function Frame1410081222() {
    return (
      <div className="[grid-area:1_/_1] box-border content-stretch flex flex-col items-start justify-start ml-0 mt-0 relative">
        <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#080a24] text-[18px] tracking-[-0.72px] w-full">
          <p className="leading-[normal]">{isOnline ? "You're Online" : "You're Offline"}</p>
        </div>
      </div>
    );
  }

  function Rectangle21() {
    return (
      <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
        <Frame1410081222 />
      </div>
    );
  }

  function Car1() {
    return (
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Car 1">
        <Rectangle21 />
      </div>
    );
  }

  function Frame1410081577() {
    return (
      <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0">
        <div className="relative shrink-0 size-[3px]">
          <img className="block max-w-none size-full" src={imgEllipse300} />
        </div>
        <div className="relative shrink-0 size-[3px]">
          <img className="block max-w-none size-full" src={imgEllipse300} />
        </div>
        <div className="relative shrink-0 size-[3px]">
          <img className="block max-w-none size-full" src={imgEllipse300} />
        </div>
      </div>
    );
  }

  function Frame1410081576() {
    return (
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-[30px]">
        <div className="flex flex-row items-center self-stretch">
          <Frame1410081577 />
        </div>
        <div className="h-[14px] relative shrink-0 w-[26px]" data-name="􀌇">
          <img className="block max-w-none size-full" src={img} />
        </div>
      </div>
    );
  }

  function Frame1410081574() {
    return (
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <div 
          className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#505050] text-[24px] text-nowrap cursor-pointer hover:text-[#cf923d] transition-colors" 
          style={{ fontVariationSettings: "'wdth' 100" }}
          onClick={onBack}
        >
          <p className="leading-[28px] whitespace-pre">􀌆</p>
        </div>
        <Car1 />
        <Frame1410081576 />
      </div>
    );
  }

  function ChooseYourRide() {
    return (
      <div className="content-stretch flex flex-col gap-2 items-center justify-center relative shrink-0 w-full" data-name="Choose your ride">
        <Frame1410081574 />
      </div>
    );
  }

  function Frame1410081210() {
    return (
      <div className="box-border content-stretch flex gap-3 items-end justify-start pl-2 pr-3 py-2 relative rounded-[20px] shadow-[0px_2px_3px_0px_rgba(0,0,0,0.07)] shrink-0">
        <div className="flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[14px] text-nowrap">
          <p className="leading-[18px] whitespace-pre">Ride Offers, Start Ride Now!</p>
        </div>
      </div>
    );
  }

  function Frame1410081585() {
    return (
      <div className="content-stretch flex gap-2 items-center justify-start relative shrink-0 w-full">
        <Frame1410081210 />
      </div>
    );
  }

  // Normal Ride Card (Card 1)
  function RideCard1() {
    return (
      <div className="bg-white relative rounded-[12px] w-full max-w-[340px]">
        <div aria-hidden="true" className="absolute border-[#7b7b7b] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start px-6 py-4 relative size-full">
            
            {/* Header and Distance Info */}
            <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0 w-full">
              
              {/* Title and Earning */}
              <div className="content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic relative shrink-0 w-full">
                <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[#656565] text-[12px] text-nowrap">
                  <p className="leading-[normal] whitespace-pre">Bike Rescue</p>
                </div>
                <div className="font-['Poppins:Medium',_sans-serif] leading-[1.2] relative shrink-0 text-[0px] text-black w-full">
                  <p className="mb-0 text-[14px]">Earning</p>
                  <p className="text-[#38a35f] text-[20px]">₹200.00</p>
                </div>
              </div>
              
              {/* Distance Information Box */}
              <div className="bg-neutral-50 relative rounded-[8px] shrink-0 w-full">
                <div className="overflow-clip relative size-full">
                  <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-3 py-2 relative w-full">
                    
                    {/* Pickup Distance */}
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[normal]">Pickup Distance</p>
                      </div>
                      <div className="h-0 relative shrink-0 w-[12px]">
                        <div className="absolute inset-[-1px_-10%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 2">
                            <path d="M1 1H13" opacity="0.2" stroke="black" strokeLinecap="round" strokeWidth="1" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="font-['Poppins:Bold',_sans-serif] relative shrink-0 text-[#2e2e2e] text-[14px]">
                          <p className="leading-[16px] text-nowrap whitespace-pre">1.5 km</p>
                        </div>
                        <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[10px] text-black">
                          <p className="leading-[12px] text-nowrap whitespace-pre">5 min away</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Vertical Separator */}
                    <div className="h-px bg-[#E8E8E8] w-full"></div>
                    
                    {/* Drop Distance */}
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[normal]">Drop Distance</p>
                      </div>
                      <div className="h-0 relative shrink-0 w-[12px]">
                        <div className="absolute inset-[-1px_-10%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 2">
                            <path d="M1 1H13" opacity="0.2" stroke="black" strokeLinecap="round" strokeWidth="1" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="font-['Poppins:Bold',_sans-serif] relative shrink-0 text-[#1facbb] text-[14px]">
                          <p className="leading-[16px] text-nowrap whitespace-pre">7.8 km</p>
                        </div>
                        <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[10px] text-black">
                          <p className="leading-[12px] text-nowrap whitespace-pre">12 min away</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Horizontal Separator */}
              <div className="h-px bg-black/10 w-full"></div>
              
              {/* Pickup and Drop Locations */}
              <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full">
                <div className="content-stretch flex font-['Poppins:Regular',_sans-serif] gap-8 items-start justify-start leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap w-full">
                  <div className="relative shrink-0">
                    <p className="leading-[normal] text-nowrap whitespace-pre">Pickup</p>
                  </div>
                  <div className="relative shrink-0">
                    <p className="leading-[normal] text-nowrap whitespace-pre">Drop</p>
                  </div>
                </div>
                <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full">
                  <div className="basis-0 flex flex-col grow items-start justify-center min-h-px min-w-px relative shrink-0">
                    <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#2e2e2e] text-[11px] w-full">
                      <p className="leading-[14px]">Safdarjung Enclave, Gali no.20</p>
                    </div>
                  </div>
                  <div className="h-[0.005px] relative shrink-0 w-[12px]">
                    <div className="absolute inset-[-4px_-5%_-4px_-5%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
                        <path d={svgPaths.p27b8b880} fill="black" />
                      </svg>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-col grow items-start justify-center min-h-px min-w-px relative shrink-0">
                    <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#2e2e2e] text-[11px] w-full">
                      <p className="leading-[14px]">Chandni Chowk, Metro Station gate 4</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Accept Ride Button */}
            <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full">
              <div 
                className="basis-0 grow h-[50px] min-h-px min-w-px relative rounded-[12px] shrink-0 bg-[#38a35f] cursor-pointer hover:bg-[#2d8049] transition-colors"
                onClick={() => {
                  onAcceptRide({
                    rideId: 'ride_001',
                    passengerName: 'Customer',
                    pickupLocation: 'Safdarjung Enclave, Gali no.20',
                    dropLocation: 'Chandni Chowk, Metro Station gate 4',
                    fare: 200,
                    estimatedDuration: 18,
                    rideType: 'bike_rescue'
                  });
                }}
              >
                <div className="flex flex-row items-center justify-center relative size-full">
                  <div className="box-border content-stretch flex gap-2 h-[50px] items-center justify-center leading-[0] px-4 py-3 relative text-nowrap text-white w-full">
                    <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center not-italic relative shrink-0 text-[16px] tracking-[-0.64px]">
                      <p className="leading-[20px] text-nowrap whitespace-pre">Accept Ride</p>
                    </div>
                    <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center relative shrink-0 text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <p className="leading-[20px] text-nowrap whitespace-pre">􀷞</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Golden Ride Card (Card 2)
  function RideCard2() {
    return (
      <div className="bg-[#fffefd] relative rounded-[12px] w-full max-w-[340px]">
        <div aria-hidden="true" className="absolute border-[#c06821] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start px-6 py-4 relative size-full">
            
            {/* Header and Distance Info */}
            <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0 w-full">
              
              {/* Title and Earning */}
              <div className="content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic relative shrink-0 w-full">
                <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[#656565] text-[12px] text-nowrap">
                  <p className="leading-[normal] whitespace-pre">Raahi - Driver</p>
                </div>
                <div className="font-['Poppins:Medium',_sans-serif] leading-[1.2] relative shrink-0 text-[0px] text-black w-full">
                  <p className="mb-0 text-[14px]">Earning</p>
                  <p className="text-[#c06821] text-[20px]">₹2500.00</p>
                </div>
              </div>
              
              {/* Distance Information Box */}
              <div className="bg-[#fff9f3] relative rounded-[8px] shrink-0 w-full">
                <div className="overflow-clip relative size-full">
                  <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-3 py-2 relative w-full">
                    
                    {/* Pickup Distance */}
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[normal]">Pickup Distance</p>
                      </div>
                      <div className="h-0 relative shrink-0 w-[12px]">
                        <div className="absolute inset-[-1px_-10%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 2">
                            <path d="M1 1H13" opacity="0.2" stroke="black" strokeLinecap="round" strokeWidth="1" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="font-['Poppins:Bold',_sans-serif] relative shrink-0 text-[#2e2e2e] text-[14px]">
                          <p className="leading-[16px] text-nowrap whitespace-pre">15.5 km</p>
                        </div>
                        <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[10px] text-black">
                          <p className="leading-[12px] text-nowrap whitespace-pre">5 min away</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Vertical Separator */}
                    <div className="h-px bg-[#E8E8E8] w-full"></div>
                    
                    {/* Drop Distance */}
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[normal]">Drop Distance</p>
                      </div>
                      <div className="h-0 relative shrink-0 w-[12px]">
                        <div className="absolute inset-[-1px_-10%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 2">
                            <path d="M1 1H13" opacity="0.2" stroke="black" strokeLinecap="round" strokeWidth="1" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="font-['Poppins:Bold',_sans-serif] relative shrink-0 text-[#e2ab7e] text-[14px]">
                          <p className="leading-[16px] text-nowrap whitespace-pre">27.8 km</p>
                        </div>
                        <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[10px] text-black">
                          <p className="leading-[12px] text-nowrap whitespace-pre">12 min away</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Horizontal Separator */}
              <div className="h-px bg-black/10 w-full"></div>
              
              {/* Pickup and Drop Locations */}
              <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full">
                <div className="content-stretch flex font-['Poppins:Regular',_sans-serif] gap-8 items-start justify-start leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap w-full">
                  <div className="relative shrink-0">
                    <p className="leading-[normal] text-nowrap whitespace-pre">Pickup</p>
                  </div>
                  <div className="relative shrink-0">
                    <p className="leading-[normal] text-nowrap whitespace-pre">Drop</p>
                  </div>
                </div>
                <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full">
                  <div className="basis-0 flex flex-col grow items-start justify-center min-h-px min-w-px relative shrink-0">
                    <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#535353] text-[11px] w-full">
                      <p className="leading-[14px]">Safdarjung Enclave, Gali no.20</p>
                    </div>
                  </div>
                  <div className="h-[0.005px] relative shrink-0 w-[12px]">
                    <div className="absolute inset-[-4px_-5%_-4px_-5%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
                        <path d={svgPaths.p27b8b880} fill="black" />
                      </svg>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-col grow items-start justify-center min-h-px min-w-px relative shrink-0">
                    <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#535353] text-[11px] w-full">
                      <p className="leading-[14px]">Chandni Chowk, Metro Station gate 4</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Golden Ride Button */}
            <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full">
              <div 
                className="basis-0 grow h-[50px] min-h-px min-w-px relative rounded-[12px] shrink-0 bg-[#c06821] cursor-pointer hover:bg-[#a0561a] transition-colors"
                onClick={() => {
                  onAcceptRide({
                    rideId: 'ride_002',
                    passengerName: 'Premium Customer',
                    pickupLocation: 'Safdarjung Enclave, Gali no.20',
                    dropLocation: 'Chandni Chowk, Metro Station gate 4',
                    fare: 2500,
                    estimatedDuration: 25,
                    rideType: 'golden_ride'
                  });
                }}
              >
                <div className="flex flex-row items-center justify-center relative size-full">
                  <div className="box-border content-stretch flex gap-2 h-[50px] items-center justify-center leading-[0] px-4 py-3 relative text-nowrap text-white w-full">
                    <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center not-italic relative shrink-0 text-[16px] tracking-[-0.64px]">
                      <p className="leading-[20px] text-nowrap whitespace-pre">Golden Ride</p>
                    </div>
                    <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center relative shrink-0 text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <p className="leading-[20px] text-nowrap whitespace-pre">􀋃</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Frame1410081593() {
    return (
      <div className="content-stretch flex gap-4 items-stretch justify-start relative shrink-0 w-full overflow-x-auto [&>*]:flex-1 [&>*]:min-w-[340px] [&>*]:max-w-[340px]">
        <RideCard1 />
        <RideCard2 />
      </div>
    );
  }

  function Frame1410081594() {
    return (
      <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0 w-full">
        <Frame1410081585 />
        <Frame1410081593 />
      </div>
    );
  }

  function Frame1410081612() {
    return (
      <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0 w-full">
        {/* Only show ride cards when driver is online */}
        {isOnline && <Frame1410081594 />}
        
        {/* Show offline message when driver is offline */}
        {!isOnline && (
          <div className="content-stretch flex flex-col gap-4 items-center justify-center relative shrink-0 w-full py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#6b7280] text-[48px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[52px] whitespace-pre">􀐔</p>
              </div>
              <div className="text-center">
                <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#374151] text-[18px] mb-2">
                  <p className="leading-[24px]">You're Offline</p>
                </div>
                <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px]">
                  <p className="leading-[20px]">Go online to start receiving ride requests</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Account info modal content
  function Frame1410081637() {
    return (
      <div className="content-stretch flex gap-2 items-center justify-start leading-[0] relative shrink-0 text-[16px] text-nowrap">
        <div className="font-['SF_Pro:Regular',_sans-serif] font-normal relative shrink-0 text-[#cf923d]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] text-nowrap whitespace-pre">􀉪</p>
        </div>
        <div className="font-['Poppins:Regular',_sans-serif] not-italic relative shrink-0 text-[#656565]">
          <p className="leading-[normal] text-nowrap whitespace-pre">Account</p>
        </div>
      </div>
    );
  }

  function Cross() {
    return (
      <div 
        className="relative shrink-0 size-[16px] cursor-pointer" 
        data-name="Cross"
        onClick={() => setShowAccountInfo(false)}
      >
        <div className="absolute flex h-[16px] items-center justify-center left-0 top-0 w-[16px]">
          <div className="flex-none rotate-[315deg]">
            <div className="bg-[#505050] h-[2px] rounded-[8px] w-[16px]" />
          </div>
        </div>
        <div className="absolute flex h-[16px] items-center justify-center left-0 top-0 w-[16px]">
          <div className="flex-none rotate-[225deg] scale-y-[-100%]">
            <div className="bg-[#505050] h-[2px] rounded-[8px] w-[16px]" />
          </div>
        </div>
      </div>
    );
  }

  function Frame1410081638() {
    return (
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <Frame1410081637 />
        <Cross />
      </div>
    );
  }

  function Frame1410081578() {
    return (
      <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full">
        <Frame1410081638 />
        <div className="font-['Poppins:Medium',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[18px] text-black">
          <p className="leading-[normal]">Certain ratings are now excluded</p>
        </div>
        <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#656565] text-[14px] text-nowrap">
          <p className="leading-[normal] whitespace-pre">For reasons outside of your control, such as traffic.</p>
        </div>
      </div>
    );
  }

  function Frame1410081579() {
    return (
      <div className="bg-white relative rounded-[16px] shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="flex flex-row items-center justify-center relative size-full">
          <div className="box-border content-stretch flex gap-2 items-center justify-center p-4 relative w-full">
            <div className="basis-0 font-['Poppins:Medium',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#cf923d] text-[18px] text-center">
              <p className="leading-[normal]">WayBill</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Frame1410081546() {
    return (
      <div className="basis-0 content-stretch flex flex-col gap-6 grow items-start justify-start min-h-px min-w-px relative shrink-0 w-full">
        <Frame1410081612 />
        {showAccountInfo && <Frame1410081578 />}
        <Frame1410081579 />
      </div>
    );
  }

  function Frame1410081225() {
    return (
      <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-tl-[20px] rounded-tr-[20px] shrink-0 w-full">
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pt-4 px-4 relative size-full">
            <ChooseYourRide />
            <Frame1410081546 />
          </div>
        </div>
      </div>
    );
  }

  function Frame1410081584() {
    return (
      <div className="basis-0 content-stretch flex flex-col gap-6 grow items-center justify-start min-h-px min-w-px relative shrink-0 w-full">
        <Frame1410081583 />
        <Frame1410081225 />
      </div>
    );
  }

  return (
    <div 
      className="bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] bg-white box-border content-stretch flex flex-col gap-4 items-center justify-start pb-0 pt-12 px-0 relative min-h-screen w-full max-w-md mx-auto" 
      data-name="3. Choose Vehicle" 
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1717343824623-06293a62a70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwc3RyZWV0JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTc0MDUyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')` }}
    >
      <Frame1410081584 />
    </div>
  );
}