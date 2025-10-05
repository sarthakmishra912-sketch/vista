import React, { useState } from 'react';
import svgPaths from "../../imports/svg-zeoe4zqx5r";
import { driverOnboardingApi } from '../../services/driver';
import { toast } from 'sonner';

interface DriverLanguageSelectionScreenProps {
  onContinue: (selectedLanguage: string) => void;
  onBack: () => void;
  onSupport: () => void;
  userEmail?: string | null;
}

const languages = [
  { code: 'en', name: 'English', icon: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', icon: '🇮🇳' },
  { code: 'es', name: 'Español', icon: '🇪🇸' },
  { code: 'fr', name: 'Français', icon: '🇫🇷' },
  { code: 'de', name: 'Deutsch', icon: '🇩🇪' },
];

export default function DriverLanguageSelectionScreen({ 
  onContinue, 
  onBack, 
  onSupport,
  userEmail 
}: DriverLanguageSelectionScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleContinue = async () => {
    if (selectedLanguage) {
      try {
        console.log('🌐 Saving language preference:', selectedLanguage);
        await driverOnboardingApi.updateLanguage(selectedLanguage);
        toast.success('Language preference saved');
        onContinue(selectedLanguage);
      } catch (error) {
        console.error('❌ Error saving language:', error);
        toast.error('Failed to save language preference');
        // Still proceed to next step for better UX
        onContinue(selectedLanguage);
      }
    }
  };

  const handleSupportClick = () => {
    // TODO: Implement driver support system for language selection
    // Could open multilingual support chat or FAQ
    onSupport();
  };

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
                    <p className="leading-[1.2]">Select your language</p>
                  </div>
                  <div 
                    className="relative shrink-0 w-full text-[16px] sm:text-[18px] tracking-[-0.32px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '400',
                      color: '#2e2e2e'
                    }}
                  >
                    <p className="leading-[normal]">You can choose your language on this screen or any time in support section.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Selection Section */}
            <div className="relative shrink-0 w-full">
              <div className="relative size-full">
                <div className="box-border flex flex-col gap-5 items-start justify-start px-5 py-0 relative w-full">
                  <div 
                    className="leading-[0] not-italic relative shrink-0 w-full text-[16px] sm:text-[18px] tracking-[-0.32px]"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '500',
                      color: '#080a24'
                    }}
                  >
                    <p className="leading-[normal]">Language</p>
                  </div>
                  
                  {/* Language Options */}
                  <div className="flex flex-col gap-3 w-full">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => setSelectedLanguage(language.code)}
                        className={`relative rounded-[20px] shrink-0 w-full transition-all duration-200 ${
                          selectedLanguage === language.code 
                            ? 'ring-2 ring-black' 
                            : 'hover:ring-1 hover:ring-gray-300'
                        }`}
                        style={{ backgroundColor: '#f6f6f6' }}
                      >
                        <div className="flex flex-row items-center justify-center relative size-full">
                          <div className="box-border flex gap-2.5 items-center justify-between px-5 py-4 relative w-full">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{language.icon}</span>
                              <div 
                                className="leading-[0] not-italic relative shrink-0 text-[16px] sm:text-[18px] tracking-[-0.32px]"
                                style={{ 
                                  fontFamily: 'Poppins, sans-serif',
                                  fontWeight: '400',
                                  color: '#444343'
                                }}
                              >
                                <p className="leading-[normal]">{language.name}</p>
                              </div>
                            </div>
                            
                            {/* Selection Indicator */}
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedLanguage === language.code 
                                ? 'border-black bg-black' 
                                : 'border-gray-300'
                            }`}>
                              {selectedLanguage === language.code && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button - Fixed at bottom */}
          <div className="absolute box-border flex flex-col gap-2.5 items-start justify-start left-0 px-5 py-6 shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)] bottom-0 w-full bg-white">
            <button
              onClick={handleContinue}
              disabled={!selectedLanguage}
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