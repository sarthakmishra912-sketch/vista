import React from 'react';

interface MobileOTPButtonProps {
  onLogin: (method: string) => void;
}

export default function MobileOTPButton({ onLogin }: MobileOTPButtonProps) {
  const handleMobileOTPLogin = () => {
    /*
      🚀 FLUTTER API INTEGRATION - MOBILE OTP LOGIN:
      
      1. Phone Number Input:
         - Use intl_phone_field package for country codes
         - Validate phone number format
         - API: POST /api/auth/send-otp
         - Payload: { phone: string, country_code: string }
         
      2. OTP Generation & Delivery:
         - Use SMS gateway (Twilio, AWS SNS, or local provider)
         - Generate 4-6 digit OTP with expiry (5 minutes)
         - Store OTP hash in Redis/database
         - Rate limiting: max 3 attempts per hour
         
      3. OTP Verification:
         - API: POST /api/auth/verify-otp
         - Payload: { phone: string, otp: string }
         - Response: { access_token: string, refresh_token: string }
         
      4. Session Management:
         - Store JWT tokens securely
         - Implement token refresh mechanism
         - Handle session expiry gracefully
         
      5. Error Handling:
         - Invalid phone number
         - OTP expired or incorrect
         - SMS delivery failures
         - Network connectivity issues
    */
    console.log("Mobile OTP login clicked");
    
    // Simulate successful login for demo
    setTimeout(() => {
      onLogin('mobile-otp');
    }, 1000);
  };

  return (
    <button
      onClick={handleMobileOTPLogin}
      className="w-full p-4 rounded-3xl border border-[#a89c8a] hover:bg-[#f0f0f0] transition-colors min-h-[64px] active:scale-[0.98]"
    >
      <div className="text-[#11211e] text-base sm:text-lg text-center">
        <span className="font-normal">Login with </span>
        <span className="font-medium underline">
          Mobile OTP
        </span>
      </div>
    </button>
  );
}