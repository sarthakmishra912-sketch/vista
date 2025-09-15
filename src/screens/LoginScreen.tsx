import React from 'react';
import svgPaths from "../imports/svg-1ch7gtc44c";
import img103451 from "figma:asset/5d54f3b2ac26f683d46d31996748c6b7893e6cc5.png";
import SimpleLoginButtons from '../components/auth/SimpleLoginButtons';
import Footer from '../components/common/Footer';

interface LoginScreenProps {
  onLogin: (method: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
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
        <div className="flex-1 flex flex-col justify-center py-8">
          {/* Title and Tagline Section */}
          <div className="flex flex-col items-center justify-center mb-12 px-6">
            {/* Raahi Title */}
            <div className="flex flex-col items-center w-full max-w-sm">
              <h1 
                className="font-['Samarkan'] text-[#11211e] text-center mb-4"
                style={{ fontSize: 'clamp(80px, 12vw, 120px)', lineHeight: 1.1 }}
              >
                Raahi
              </h1>
              
              {/* Tagline */}
              <div className="text-[#c3aa85] text-center">
                <span 
                  className="font-['Kite_One'] tracking-tight"
                  style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
                >
                  Butter to your{" "}
                </span>
                <span 
                  className="font-['Abhaya_Libre_SemiBold']"
                  style={{ fontSize: 'clamp(32px, 4.5vw, 45px)' }}
                >
                  जाम
                </span>
              </div>
            </div>
          </div>

          <SimpleLoginButtons onLogin={onLogin} />
        </div>

        <Footer />
      </div>
    </div>
  );
}