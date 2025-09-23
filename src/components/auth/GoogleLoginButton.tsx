import React from 'react';
import svgPaths from "../../imports/svg-1ch7gtc44c";

interface GoogleLoginButtonProps {
  onLogin: (method: string) => void;
}

export default function GoogleLoginButton({ onLogin }: GoogleLoginButtonProps) {
  const handleGoogleLogin = () => {
    /*
      🚀 API INTEGRATION - GOOGLE LOGIN:
      
      1. Google Sign-In Setup:
         - Add google_sign_in package to pubspec.yaml
         - Configure OAuth 2.0 credentials in Google Console
         - Add SHA-1 fingerprints for Android
         - Set up iOS URL schemes
         
      2. Backend Integration:
         - API: POST /api/auth/google-verify
         - Payload: { id_token: string, access_token: string }
         - Response: { access_token: string, user_id: string, profile: object }
         
      3. User Profile Data:
         - Extract name, email, profile picture
         - Store user preferences and settings
         - Sync with backend user database
         
      4. Error Scenarios:
         - Google Play Services not available
         - Network connectivity issues
         - Account selection cancelled
         - Invalid credentials
    */
    console.log("Google login clicked");
    
    // Simulate successful login for demo
    setTimeout(() => {
      onLogin('google');
    }, 1000);
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-[#e8dbc9] w-full p-4 rounded-3xl hover:bg-[#ddd0bd] transition-colors border border-[#a89c8a] min-h-[72px] active:scale-[0.98]"
    >
      <div className="flex items-center gap-4 relative">
        <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 63 64"
          >
            <g id="google-seeklogo.com">
              <path
                d={svgPaths.pfc778e0}
                fill="var(--fill-0, #4285F4)"
                id="Path 1"
              />
              <path
                d={svgPaths.pacdbb20}
                fill="var(--fill-0, #6DCC4D)"
                id="Path 2"
              />
              <path
                d={svgPaths.pb15ee80}
                fill="var(--fill-0, #FBBC05)"
                id="Path 3"
              />
              <path
                d={svgPaths.p1da9cd00}
                fill="var(--fill-0, #EB4335)"
                id="Path 4"
              />
            </g>
          </svg>
        </div>
        <div className="text-[#2f2f2f] text-base sm:text-lg font-medium text-left">
          Login with Google
        </div>
      </div>
    </button>
  );
}