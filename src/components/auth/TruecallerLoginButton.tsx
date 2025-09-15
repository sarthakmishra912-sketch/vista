import React from 'react';
import imgImage from "figma:asset/dff479357ad6e8130c79c1839e0a1387559549d2.png";

interface TruecallerLoginButtonProps {
  onLogin: (method: string) => void;
}

export default function TruecallerLoginButton({ onLogin }: TruecallerLoginButtonProps) {
  const handleTruecallerLogin = () => {
    /*
      🚀 FLUTTER API INTEGRATION - TRUECALLER LOGIN:
      
      1. Truecaller SDK Integration:
         - Add truecaller_sdk package to pubspec.yaml
         - Initialize SDK with API key in main.dart
         - Handle automatic phone number verification
         
      2. Backend API Calls:
         - API: POST /api/auth/truecaller-verify
         - Payload: { phone: string, truecaller_token: string }
         - Response: { access_token: string, user_id: string, is_new_user: boolean }
         
      3. Error Handling:
         - Network connectivity issues
         - Truecaller app not installed
         - User cancellation scenarios
         
      4. Security:
         - Validate Truecaller token on backend
         - Implement rate limiting for OTP requests
         - Store tokens securely using flutter_secure_storage
    */
    console.log("Truecaller login clicked");
    
    // Simulate successful login for demo
    setTimeout(() => {
      onLogin('truecaller');
    }, 1000);
  };

  return (
    <button
      onClick={handleTruecallerLogin}
      className="bg-[#353330] w-full p-4 rounded-3xl hover:bg-[#2a2926] transition-colors min-h-[72px] active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 shrink-0">
          <img
            className="w-full h-full object-contain"
            src={imgImage}
            alt="Truecaller"
          />
        </div>
        <div className="text-white text-base sm:text-lg font-medium text-left">
          Login Via OTP on truecaller
        </div>
      </div>
    </button>
  );
}