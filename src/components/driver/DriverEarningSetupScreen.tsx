import React, { useState } from 'react';
import svgPaths from "../../imports/svg-xtmqt1l9oe";

interface DriverEarningSetupScreenProps {
  onContinue: (setupData: { location: string; referralCode?: string }) => void;
  onBack: () => void;
  onSupport: () => void;
  userEmail?: string | null;
}

const locations = [
  { code: 'delhi_ncr', name: 'Delhi, NCR', zone: 'North India' },
  { code: 'mumbai', name: 'Mumbai', zone: 'West India' },
  { code: 'bangalore', name: 'Bangalore', zone: 'South India' },
  { code: 'chennai', name: 'Chennai', zone: 'South India' },
  { code: 'hyderabad', name: 'Hyderabad', zone: 'South India' },
  { code: 'pune', name: 'Pune', zone: 'West India' },
  { code: 'kolkata', name: 'Kolkata', zone: 'East India' },
  { code: 'ahmedabad', name: 'Ahmedabad', zone: 'West India' },
];

export default function DriverEarningSetupScreen({ 
  onContinue, 
  onBack, 
  onSupport,
  userEmail 
}: DriverEarningSetupScreenProps) {
  const [selectedLocation, setSelectedLocation] = useState('delhi_ncr');
  const [referralCode, setReferralCode] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleContinue = () => {
    if (selectedLocation) {
      // TODO: Save driver setup preferences to API
      // POST /api/driver/setup
      // {
      //   location: selectedLocation,
      //   referral_code: referralCode,
      //   email: userEmail
      // }
      onContinue({
        location: selectedLocation,
        referralCode: referralCode.trim() || undefined
      });
    }
  };

  const handleSupportClick = () => {
    // TODO: Implement driver support system for earning setup
    onSupport();
  };

  const selectedLocationName = locations.find(loc => loc.code === selectedLocation)?.name || 'Delhi, NCR';

  return (
    <div className="bg-white relative min-h-screen w-full">
      <div className="relative h-full">
        <div className="box-border flex flex-col gap-10 items-start justify-start pb-10 pt-20 px-4 relative h-full min-h-screen">
          
          {/* Status Bar */}
          <div className="absolute bg-white box-border flex gap-[469.026px] h-[58px] items-center justify-center left-[-1px] overflow-clip px-0 py-[6.974px] top-0 w-full">
            <div 
              className="font-medium leading-[0] relative shrink-0 text-[24.41px] text-nowrap tracking-[0.0244px]"
              style={{ 
                fontFamily: 'Roboto, sans-serif',
                color: '#170e2b'
              }}
            >
              <p className="leading-[normal] whitespace-pre">12:30</p>
            </div>
            <div className="h-[20.924px] relative shrink-0 w-[122.054px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 123 21">
                <g>
                  <path d={svgPaths.p32edff00} fill="#170E2B" />
                  <path d={svgPaths.p8f81700} fill="#170E2B" />
                  <g>
                    <path d={svgPaths.p2de66400} fill="#170E2B" opacity="0.4" />
                    <rect fill="#170E2B" height="13.5385" rx="2.32479" width="30.9614" x="83.6469" y="3.69172" />
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* Back button - positioned at top left above header */}
          <button
            onClick={onBack}
            className="absolute top-8 left-4 p-2 rounded-full z-20"
            style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#11211e" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>

          {/* Header with Raahi branding and Support */}
          <div 
            className="relative rounded-[30px] shrink-0 w-full"
            style={{ backgroundColor: '#f6efd8' }}
          >
            <div className="flex flex-row items-center relative size-full">
              <div className="box-border flex items-center justify-between px-6 py-[30px] relative w-full">
                <div 
                  className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[28px] sm:text-[32px] text-center text-nowrap"
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
                  className="box-border flex gap-2 h-10 items-center justify-center px-3 py-2 relative rounded-lg shrink-0"
                  style={{ backgroundColor: '#282828' }}
                >
                  <div 
                    className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[14px] sm:text-[16px] text-nowrap tracking-[-0.28px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '500',
                      color: 'white'
                    }}
                  >
                    <p className="leading-[normal] whitespace-pre">Support</p>
                  </div>
                  <div className="flex h-2 items-center justify-center relative shrink-0 w-3">
                    <div className="flex-none rotate-[90deg]">
                      <div className="h-3 relative w-2">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 19">
                          <path d={svgPaths.p49ccb00} fill="white" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-10 items-start justify-start relative shrink-0 w-full">
            
            {/* Title Section */}
            <div className="relative shrink-0 w-full">
              <div className="relative size-full">
                <div className="box-border flex flex-col gap-5 items-start justify-start leading-[0] not-italic px-5 py-0 relative w-full">
                  <div 
                    className="relative shrink-0 w-full text-[24px] sm:text-[28px] tracking-[-0.72px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '500',
                      color: '#080a24'
                    }}
                  >
                    <p className="leading-[1.2]">Start Earning with Raahi</p>
                  </div>
                  <div 
                    className="relative shrink-0 w-full text-[16px] sm:text-[18px] tracking-[-0.32px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '400',
                      color: '#535353'
                    }}
                  >
                    <p className="leading-[normal]">Decide when, where and how you want to earn.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Selection Section */}
            <div className="relative shrink-0 w-full">
              <div className="relative size-full">
                <div className="box-border flex flex-col gap-5 items-start justify-start px-5 py-0 relative w-full">
                  <div 
                    className="leading-[0] not-italic relative shrink-0 w-full text-[18px] sm:text-[20px] tracking-[-0.32px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '400',
                      color: '#080a24'
                    }}
                  >
                    <p className="leading-[normal]">Where would you like to earn?</p>
                  </div>
                  
                  {/* Location Dropdown */}
                  <div className="relative w-full">
                    <button
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="relative rounded-[20px] shrink-0 w-full transition-all duration-200 hover:ring-1 hover:ring-gray-300"
                      style={{ backgroundColor: '#f6f6f6' }}
                    >
                      <div className="flex flex-row items-center justify-center relative size-full">
                        <div className="box-border flex gap-2.5 items-center justify-between px-5 py-6 relative w-full">
                          <div 
                            className="leading-[0] not-italic relative shrink-0 text-[16px] sm:text-[18px] tracking-[-0.32px] flex-1 text-left"
                            style={{ 
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: '400',
                              color: '#444343'
                            }}
                          >
                            <p className="leading-[normal]">{selectedLocationName}</p>
                          </div>
                          
                          {/* Dropdown Arrow */}
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#444343" 
                            strokeWidth="2"
                            className={`transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`}
                          >
                            <polyline points="6,9 12,15 18,9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    {/* Dropdown Options */}
                    {showLocationDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-[20px] shadow-lg z-30 max-h-60 overflow-y-auto">
                        {locations.map((location) => (
                          <button
                            key={location.code}
                            onClick={() => {
                              setSelectedLocation(location.code);
                              setShowLocationDropdown(false);
                            }}
                            className={`w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors ${
                              selectedLocation === location.code ? 'bg-blue-50' : ''
                            } first:rounded-t-[20px] last:rounded-b-[20px]`}
                          >
                            <div 
                              className="text-[16px] sm:text-[18px]"
                              style={{ 
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: selectedLocation === location.code ? '500' : '400',
                                color: selectedLocation === location.code ? '#080a24' : '#444343'
                              }}
                            >
                              {location.name}
                            </div>
                            <div 
                              className="text-[14px] mt-1"
                              style={{ 
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: '400',
                                color: '#888'
                              }}
                            >
                              {location.zone}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Code Section */}
            <div className="relative shrink-0 w-full">
              <div className="relative size-full">
                <div className="box-border flex flex-col gap-5 items-start justify-start px-5 py-0 relative w-full">
                  <div 
                    className="leading-[0] not-italic relative shrink-0 w-full text-[18px] sm:text-[20px] tracking-[-0.32px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '400',
                      color: '#080a24'
                    }}
                  >
                    <p className="leading-[normal]">Referral code (optional)</p>
                  </div>
                  
                  {/* Referral Code Input */}
                  <div className="relative rounded-[20px] shrink-0 w-full" style={{ backgroundColor: '#f6f6f6' }}>
                    <div className="flex flex-row items-center justify-center relative size-full">
                      <div className="box-border flex gap-2.5 items-center justify-center px-5 py-6 relative w-full">
                        <input
                          type="text"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                          placeholder="Enter referral code"
                          className="w-full bg-transparent outline-none text-[16px] sm:text-[18px] tracking-[-0.32px]"
                          style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '400',
                            color: '#444343'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Consent Text */}
            <div className="relative shrink-0 w-full">
              <div className="flex flex-row items-center justify-center relative size-full">
                <div className="box-border flex gap-2.5 items-center justify-center px-5 py-0 relative w-full">
                  <div 
                    className="leading-[0] not-italic relative shrink-0 w-full text-[14px] sm:text-[16px] tracking-[-0.28px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '400',
                      color: '#606060'
                    }}
                  >
                    <p className="leading-[normal]">
                      By proceeding, I agree that Raahi or its representative may contact me by email, phone or text message (including by automatic telephone dialing system) using the email address or number I provided, including for marketing purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button - Fixed at bottom */}
          <div className="absolute box-border flex flex-col gap-2.5 items-start justify-start left-0 px-5 py-6 shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)] bottom-0 w-full bg-white">
            <button
              onClick={handleContinue}
              disabled={!selectedLocation}
              className="relative rounded-[30px] shrink-0 w-full disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#282828' }}
            >
              <div className="flex flex-row items-center relative size-full">
                <div className="box-border flex items-center justify-center py-4 px-6 relative w-full">
                  <div 
                    className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-center text-nowrap tracking-[-0.36px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '500',
                      color: 'white'
                    }}
                  >
                    <p className="leading-[normal] whitespace-pre">Continue</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}