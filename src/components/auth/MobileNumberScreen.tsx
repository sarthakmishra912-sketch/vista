import React, { useState } from 'react';
import { Button } from "../ui/button";
import svgPaths from "../../imports/svg-1ch7gtc44c";
import img103451 from "figma:asset/5d54f3b2ac26f683d46d31996748c6b7893e6cc5.png";

interface MobileNumberScreenProps {
  onSubmit: (phoneNumber: string, countryCode: string) => void;
  onBack: () => void;
}

const RAAHI_COLORS = {
  background: '#F6EFD8',
  primary: '#cf923d',
  secondary: '#c3aa85',
  dark: '#11211e',
  lightBg: '#fef8e3',
  border: '#a89c8a',
};

export default function MobileNumberScreen({ onSubmit, onBack }: MobileNumberScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    if (countryCode === '+91') {
      return cleaned.length === 10 && /^[6-9]/.test(cleaned);
    }
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const handleSubmit = async () => {
    setError('');
    
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      // Format the phone number
      const formattedNumber = countryCode + cleaned;
      console.log('📱 Submitting phone number:', formattedNumber);
      
      // Call parent handler
      onSubmit(formattedNumber, countryCode);
    } catch (err: any) {
      console.error('Phone submission error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
      setError('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F6EFD8] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 698 1511"
        >
          <path
            d={svgPaths.p3a371780}
            fill="var(--fill-0, #F6EFD8)"
            id="Vector"
          />
        </svg>
      </div>

      {/* Decorative Flower Background */}
      <div className="absolute top-[-200px] left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] opacity-40 mix-blend-multiply rotate-[9.642deg] pointer-events-none">
        <div 
          className="w-full h-full bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('${img103451}')` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Back Button */}
        <div className="p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#11211e] hover:text-[#cf923d] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center py-8 px-6">
          {/* Title Section */}
          <div className="flex flex-col items-center justify-center mb-12">
            <h1 
              className="font-['Samarkan'] text-[#11211e] text-center mb-4"
              style={{ fontSize: 'clamp(60px, 10vw, 100px)', lineHeight: 1.1 }}
            >
              Raahi
            </h1>
            
            <h2 className="text-[#11211e] text-2xl font-semibold mb-2">
              Enter your mobile number
            </h2>
            <p className="text-[#c3aa85] text-center text-sm max-w-sm">
              We'll send you a one-time password to verify your number
            </p>
          </div>

          {/* Phone Input Form */}
          <div className="w-full max-w-sm mx-auto space-y-6">
            {/* Country Code + Phone Number */}
            <div className="space-y-2">
              <label className="text-[#11211e] text-sm font-medium block">
                Mobile Number
              </label>
              <div className="flex gap-3">
                {/* Country Code Selector */}
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="appearance-none h-14 pl-4 pr-10 rounded-2xl border-2 border-[#a89c8a] bg-white text-[#11211e] font-medium focus:outline-none focus:border-[#cf923d] transition-colors"
                    style={{ minWidth: '100px' }}
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1L6 6L11 1" stroke="#11211e" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="flex-1">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full h-14 px-4 rounded-2xl border-2 border-[#a89c8a] bg-white text-[#11211e] text-lg font-medium placeholder:text-[#c3aa85] placeholder:text-base focus:outline-none focus:border-[#cf923d] transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
                  </svg>
                  {error}
                </p>
              )}
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleSubmit}
              disabled={!phoneNumber || phoneNumber.length !== 10 || loading}
              className="w-full h-14 text-lg font-semibold rounded-2xl transition-all"
              style={{
                backgroundColor: (!phoneNumber || phoneNumber.length !== 10 || loading) ? '#c3aa85' : '#cf923d',
                color: 'white',
                opacity: (!phoneNumber || phoneNumber.length !== 10 || loading) ? 0.6 : 1,
              }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending OTP...
                </div>
              ) : (
                'Send OTP'
              )}
            </Button>

            {/* Info Text */}
            <p className="text-center text-xs text-[#c3aa85] leading-relaxed">
              By continuing, you agree to Raahi's{' '}
              <span className="text-[#cf923d] underline cursor-pointer">Terms of Service</span>
              {' '}and{' '}
              <span className="text-[#cf923d] underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center text-xs text-[#c3aa85]">
          © 2025 Raahi. All rights reserved.
        </div>
      </div>
    </div>
  );
}





