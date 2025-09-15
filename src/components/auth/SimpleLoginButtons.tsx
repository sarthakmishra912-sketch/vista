import React from 'react';
import imgImage from "figma:asset/dff479357ad6e8130c79c1839e0a1387559549d2.png";
import svgPaths from "../../imports/svg-1ch7gtc44c";

interface SimpleLoginButtonsProps {
  onLogin: (method: string) => void;
}

export default function SimpleLoginButtons({ onLogin }: SimpleLoginButtonsProps) {
  const handleTruecallerLogin = () => {
    console.log("Truecaller login clicked");
    setTimeout(() => {
      onLogin('truecaller');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    setTimeout(() => {
      onLogin('google');
    }, 1000);
  };

  const handleMobileOTPLogin = () => {
    console.log("Mobile OTP login clicked");
    setTimeout(() => {
      onLogin('mobile-otp');
    }, 1000);
  };

  return (
    <div className="w-full max-w-sm mx-auto px-6 space-y-4">
      <div className="space-y-3">
        {/* Truecaller Button */}
        <button
          onClick={handleTruecallerLogin}
          className="bg-[#353330] w-full p-4 rounded-3xl hover:bg-[#2a2926] transition-colors min-h-[72px] active:scale-[0.98] flex items-center justify-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 shrink-0">
              <img
                className="w-full h-full object-contain"
                src={imgImage}
                alt="Truecaller"
              />
            </div>
            <div className="text-white text-base sm:text-lg font-medium">
              Login Via OTP on truecaller
            </div>
          </div>
        </button>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="bg-[#e8dbc9] w-full p-4 rounded-3xl hover:bg-[#ddd0bd] transition-colors border border-[#a89c8a] min-h-[72px] active:scale-[0.98] flex items-center justify-center"
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
            <div className="text-[#2f2f2f] text-base sm:text-lg font-medium">
              Login with Google
            </div>
          </div>
        </button>
      </div>
      
      <div className="pt-8">
        {/* Mobile OTP Button */}
        <button
          onClick={handleMobileOTPLogin}
          className="w-full p-4 rounded-3xl border border-[#a89c8a] hover:bg-[#f0f0f0] transition-colors min-h-[64px] active:scale-[0.98] flex items-center justify-center"
        >
          <div className="text-[#11211e] text-base sm:text-lg text-center">
            <span className="font-normal">Login with </span>
            <span className="font-medium underline">
              Mobile OTP
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}