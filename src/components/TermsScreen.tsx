import { useState } from 'react';
import { toast } from "sonner";
import svgPaths from "../imports/svg-ilyboxozfc";
import imgFrame from "figma:asset/4e95da5f9e6ec1d32f897fbff5c28b62b3c1d8ed.png";
import imgFrame1 from "figma:asset/516e77515feb8b0da14eb9d08100d04603ad8beb.png";

function Frame1410081207({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute bg-[#cf923d] box-border content-stretch flex gap-3 h-[50px] items-center justify-center right-[20px] px-[12px] py-[8px] rounded-[12px] bottom-[20px] w-[80px] hover:bg-[#b8823a] transition-colors active:scale-98 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Next</p>
      </div>
      <div className="h-0 relative shrink-0 w-[10px]">
        <div className="absolute inset-[-3px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
            <path d={svgPaths.p2826d400} fill="white" id="Vector 40" />
          </svg>
        </div>
      </div>
    </button>
  );
}

function Frame1410081546({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute h-[50px] left-[20px] bottom-[20px] w-[50px] hover:opacity-80 transition-opacity active:scale-98"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 95 94">
        <g id="Frame 1410081546">
          <rect fill="#11211e" height="94" rx="17" width="95" />
          <path d={svgPaths.pa45cd00} fill="white" id="Vector 40" />
        </g>
      </svg>
    </button>
  );
}

function Frame() {
  return (
    <div 
      className="bg-[position:50%_50%,_53.92%_34.31%] bg-no-repeat bg-size-[cover,113.76%_121.18%] h-[70px] shrink-0 w-[85px]" 
      data-name="Frame" 
      style={{ backgroundImage: `url('${imgFrame}'), url('${imgFrame1}')` }} 
    />
  );
}

function TermsCard({ isAgreed, onAgreeChange }) {
  return (
    <div className="absolute top-[40px] left-[20px] right-[20px] bottom-[90px]">
      {/* Header */}
      <div className="bg-[#ffffff] box-border content-stretch flex gap-3 items-center justify-start px-4 py-4 rounded-t-xl border-b border-[#f0f0f0]">
        <div className="font-['K2D:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#2a2a2a] text-[28px] sm:text-[34px] md:text-[36px] flex-1">
          <p className="leading-[1.1]">{`Accept Raahi's Terms & Review Privacy Note`}</p>
        </div>
        <Frame />
      </div>

      {/* Scrollable content */}
      <div className="bg-[#ffffff] px-4 py-3 rounded-b-xl overflow-y-auto" style={{ height: 'calc(100% - 90px)' }}>
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',_sans-serif] text-[13px] leading-relaxed text-[#2a2a2a]">
            By selecting 'I Agree' below, I have reviewed and agree to the{' '}
            <span className="text-[#cf923d] underline cursor-pointer hover:text-[#b8823a]">Terms of Use</span>
            {' '}and acknowledge the{' '}
            <span className="text-[#cf923d] underline cursor-pointer hover:text-[#b8823a]">Privacy Notice</span>
            . I am at least 18 years of age.
          </p>

          <div className="flex items-center gap-2 pt-3 pb-2 sticky bottom-0 bg-white border-t border-[#f0f0f0] mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree-terms"
                checked={isAgreed}
                onChange={(e) => onAgreeChange(e.target.checked)}
                className="w-4 h-4 text-[#cf923d] border-2 border-[#a89c8a] rounded focus:ring-[#cf923d] focus:ring-1 bg-white"
              />
            </div>
            <label 
              htmlFor="agree-terms" 
              className="font-['Poppins:Medium',_sans-serif] text-[14px] text-[#2a2a2a] cursor-pointer"
            >
              I agree to the terms and conditions
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TermsScreen({ onAccept, onBack }) {
  /*
    🚀 API INTEGRATION - TERMS & CONDITIONS SCREEN:
    
    1. Terms Content Management:
       - API: GET /api/legal/terms-and-conditions?version=latest
       - Dynamic content loading from backend
       - Version control for legal document updates
       - Multi-language support based on user locale
       
    2. User Consent Tracking:
       - API: POST /api/users/{user_id}/consent
       - Payload: { terms_version: string, privacy_version: string, timestamp: string, ip_address: string }
       - Legal compliance for GDPR/data protection
       - Audit trail for consent management
       
    3. Document Versioning:
       - Track which version user accepted
       - Notify users of significant changes
       - Force re-acceptance for major updates
       - Maintain historical consent records
       
    4. Analytics & Compliance:
       - Track acceptance/rejection rates
       - Monitor drop-off points in terms flow
       - Legal compliance reporting
       - A/B test different presentation formats
       
    5. Offline Support:
       - Cache latest terms version locally
       - Allow reading offline with online sync
       - Handle network issues gracefully
       - Secure storage using localStorage or sessionStorage
       
    6. Accessibility Features:
       - Text-to-speech for visually impaired
       - Adjustable font sizes
       - High contrast mode support
       - Screen reader compatibility
       
    7. Integration Points:
       - Link to privacy policy and other legal docs
       - Customer support contact integration
       - Language selection and localization
       - Social media/website links
  */
  const [isAgreed, setIsAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = async () => {
    if (!isAgreed) {
      toast.error("Please agree to terms", {
        description: "You must accept the terms and conditions to continue",
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save terms acceptance to localStorage
      localStorage.setItem('raahi_has_accepted_terms', 'true');
      
      // Show success toast
      toast.success("Terms accepted!", {
        description: "Welcome to Raahi! You're all set to book rides.",
        duration: 2000,
      });
      
      onAccept();
    } catch (error) {
      console.error("Error accepting terms:", error);
      toast.error("Error accepting terms", {
        description: "Please try again",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    onBack();
  };

  const handleAgreeChange = (agreed) => {
    setIsAgreed(agreed);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden" data-name="Terms">
      {/* Terms Content */}
      <TermsCard 
        isAgreed={isAgreed}
        onAgreeChange={handleAgreeChange}
      />
      
      {/* Navigation Buttons */}
      <Frame1410081207 
        onClick={handleNext} 
        disabled={!isAgreed || isProcessing}
      />
      <Frame1410081546 onClick={handleBack} />

      {/* Loading overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-3 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#cf923d] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-['Poppins:Medium',_sans-serif] text-[#11211e] text-[14px]">
              Processing...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}