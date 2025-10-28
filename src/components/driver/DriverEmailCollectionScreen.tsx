import React, { useState, useEffect } from 'react';
import svgPaths from "../../imports/svg-83dk9h3jzq";
import { toast } from "sonner";

interface DriverEmailCollectionScreenProps {
  onContinue: (data: { firstName: string; lastName: string; email: string }) => void;
  onBack: () => void;
  onSupport: () => void;
  userEmail?: string | null;
}

export default function DriverEmailCollectionScreen({ 
  onContinue, 
  onBack, 
  onSupport,
  userEmail 
}: DriverEmailCollectionScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize driver onboarding when component mounts
  useEffect(() => {
    const initializeDriverOnboarding = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.error('No access token found');
          toast.error('Please login again');
          return;
        }

        console.log('🚗 Initializing driver onboarding...');
        
        const response = await fetch('http://localhost:5001/api/driver/onboarding/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Driver profile initialized:', data.data);
          toast.success('Driver profile ready!');
        } else {
          console.error('❌ Failed to initialize driver profile:', data.message);
          toast.error(data.message || 'Failed to initialize driver profile');
        }
      } catch (error) {
        console.error('❌ Error initializing driver onboarding:', error);
        toast.error('Failed to initialize. Please try again.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDriverOnboarding();
  }, []);

  const handleContinue = () => {
    if (firstName && lastName && email) {
      // Store driver details in localStorage for later use
      localStorage.setItem('raahi_driver_email', email);
      localStorage.setItem('raahi_driver_firstName', firstName);
      localStorage.setItem('raahi_driver_lastName', lastName);
      
      onContinue({ firstName, lastName, email });
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleSupportClick = () => {
    // TODO: Implement driver support system
    // Could open chat widget, phone dialer, or support ticket system
    onSupport();
  };

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="bg-white relative min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#CF923D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#11211E] font-medium">Initializing driver profile...</p>
        </div>
      </div>
    );
  }

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
                  <path d={svgPaths.p1b4fce00} fill="#170E2B" />
                  <g>
                    <path d={svgPaths.p2de66400} fill="#170E2B" opacity="0.4" />
                    <rect fill="#170E2B" height="13.5385" rx="2.32479" width="30.9614" x="83.6469" y="3.69172" />
                  </g>
                </g>
              </svg>
            </div>
          </div>

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
          <div className="flex flex-col gap-[60px] items-start justify-start relative shrink-0 w-full">
            
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
                    <p className="leading-[1.2]">Sign-in Details Required</p>
                  </div>
                  <div 
                    className="relative shrink-0 w-full text-[16px] sm:text-[18px] tracking-[-0.32px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '400',
                      color: '#2e2e2e'
                    }}
                  >
                    <p className="leading-[normal]">To set up your driver account, we need to collect your details</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Inputs Section */}
            <div className="relative shrink-0 w-full">
              <div className="relative size-full">
                <div className="box-border flex flex-col gap-5 items-start justify-start px-5 py-0 relative w-full">
                  
                  {/* First Name */}
                  <div className="w-full flex flex-col gap-3">
                    <div 
                      className="leading-[0] not-italic relative shrink-0 w-full text-[16px] sm:text-[18px] tracking-[-0.32px]"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        color: '#080a24'
                      }}
                    >
                      <p className="leading-[normal]">First Name</p>
                    </div>
                    <div 
                      className="relative rounded-[20px] shrink-0 w-full"
                      style={{ backgroundColor: '#f6f6f6' }}
                    >
                      <div className="flex flex-row items-center justify-center relative size-full">
                        <div className="box-border flex gap-2.5 items-center justify-center px-5 py-4 relative w-full">
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] sm:text-[18px] tracking-[-0.32px] bg-transparent border-none outline-none"
                            style={{ 
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: '400',
                              color: '#444343'
                            }}
                            placeholder="Enter your first name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="w-full flex flex-col gap-3">
                    <div 
                      className="leading-[0] not-italic relative shrink-0 w-full text-[16px] sm:text-[18px] tracking-[-0.32px]"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        color: '#080a24'
                      }}
                    >
                      <p className="leading-[normal]">Last Name</p>
                    </div>
                    <div 
                      className="relative rounded-[20px] shrink-0 w-full"
                      style={{ backgroundColor: '#f6f6f6' }}
                    >
                      <div className="flex flex-row items-center justify-center relative size-full">
                        <div className="box-border flex gap-2.5 items-center justify-center px-5 py-4 relative w-full">
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] sm:text-[18px] tracking-[-0.32px] bg-transparent border-none outline-none"
                            style={{ 
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: '400',
                              color: '#444343'
                            }}
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="w-full flex flex-col gap-3">
                    <div 
                      className="leading-[0] not-italic relative shrink-0 w-full text-[16px] sm:text-[18px] tracking-[-0.32px]"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        color: '#080a24'
                      }}
                    >
                      <p className="leading-[normal]">Email Address</p>
                    </div>
                    <div 
                      className="relative rounded-[20px] shrink-0 w-full"
                      style={{ backgroundColor: '#f6f6f6' }}
                    >
                      <div className="flex flex-row items-center justify-center relative size-full">
                        <div className="box-border flex gap-2.5 items-center justify-center px-5 py-4 relative w-full">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] sm:text-[18px] tracking-[-0.32px] bg-transparent border-none outline-none"
                            style={{ 
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: '400',
                              color: '#444343'
                            }}
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Continue Button - Fixed at bottom */}
          <div className="absolute box-border flex flex-col gap-2.5 items-start justify-start left-0 px-5 py-6 shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)] bottom-0 w-full bg-white">
            <button
              onClick={handleContinue}
              disabled={!firstName || !lastName || !email}
              className="relative rounded-[30px] shrink-0 w-full disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}