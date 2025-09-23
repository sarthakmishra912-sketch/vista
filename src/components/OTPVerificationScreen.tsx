import { useState, useRef, useEffect } from 'react';
import { toast } from "sonner";
import svgPaths from "../imports/svg-ortnbr1thp";
import img103451 from "figma:asset/5d54f3b2ac26f683d46d31996748c6b7893e6cc5.png";
import exampleImage from 'figma:asset/807f21c1920af9e824c25cc65cc5f797e9946d35.png';

function BrandHeader() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[15px] items-center justify-start top-[60px] sm:top-[80px] left-1/2 -translate-x-1/2 w-[90%] max-w-[557px]">
      <div className="content-stretch flex flex-col items-center justify-start leading-[0] not-italic relative shrink-0 w-full">
        <div className="flex flex-col font-['Samarkan'] h-[120px] sm:h-[140px] justify-center relative shrink-0 text-[#11211e] text-[60px] sm:text-[80px] md:text-[100px] text-center w-full">
          <p className="leading-[normal]">Raahi</p>
        </div>
        <div className="font-['Jockey_One:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] relative shrink-0 text-[#c3aa85] text-center w-full mt-2">
          <p className="leading-[normal] not-italic whitespace-pre-wrap">
            <span className="font-['Kite_One:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] text-[24px] sm:text-[32px] md:text-[40px]">Butter to your</span>
            <span className="font-['Kite_One:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] text-[24px] sm:text-[32px] md:text-[40px] tracking-[-2px]"> </span>
            <span className="font-['Abhaya_Libre_SemiBold:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] text-[26px] sm:text-[36px] md:text-[46px] tracking-[-2px]"> </span>
            <span className="font-['Abhaya_Libre_SemiBold:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] text-[26px] sm:text-[36px] md:text-[46px]">जाम</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function OTPForm({ phoneNumber, onVerify, onBack, onResend }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Automatically verify when all 4 digits are entered
    if (newOtp.every(digit => digit !== '') && index === 3) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    if (pastedData.length === 4) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // TODO: Implement actual OTP verification API call
      // This would typically involve:
      // 1. Send OTP and phone number to backend
      // 2. Backend verifies with SMS service
      // 3. Return success/failure response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 4-digit code
      // In real implementation, verify against actual OTP
      console.log("Verifying OTP:", otpCode, "for phone:", phoneNumber);
      
      onVerify(otpCode);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(30);
    setError('');
    
    // TODO: Implement resend OTP API call
    console.log("Resending OTP to:", phoneNumber);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast.success("OTP sent successfully!", {
        description: `New OTP sent to +91 ${phoneNumber}`,
        duration: 3000,
      });
      
      onResend();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      setCanResend(true);
      setResendTimer(0);
      
      // Show error toast
      toast.error("Failed to resend OTP", {
        description: "Please try again later",
        duration: 3000,
      });
    }
  };

  return (
    <div className="absolute top-[220px] sm:top-[260px] left-1/2 -translate-x-1/2 w-[90%] max-w-[400px]">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-[#a89c8a]/30 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="font-['Poppins:Medium',_sans-serif] text-[#11211e] text-[24px] sm:text-[28px] mb-2">
            Verify OTP
          </h2>
          <p className="font-['Poppins:Regular',_sans-serif] text-[#606060] text-[16px] sm:text-[18px] mb-2">
            Enter the 4-digit code sent to
          </p>
          <p className="font-['Poppins:Medium',_sans-serif] text-[#11211e] text-[16px] sm:text-[18px]">
            +91 {phoneNumber}
          </p>
        </div>

        <div className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                maxLength="1"
                className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-[#a89c8a]/40 rounded-2xl 
                         font-['Poppins:Medium',_sans-serif] text-[24px] sm:text-[28px] text-[#11211e] text-center
                         focus:border-[#cf923d] focus:outline-none focus:ring-0 bg-[#f9f7f4]
                         transition-colors"
                disabled={isVerifying}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-[14px] sm:text-[16px] font-['Poppins:Regular',_sans-serif] text-center">
              {error}
            </p>
          )}

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={otp.some(digit => !digit) || isVerifying}
            className={`w-full py-4 rounded-2xl font-['Poppins:Medium',_sans-serif] text-[18px] sm:text-[20px] 
                      transition-all duration-200 flex items-center justify-center text-center ${
              otp.every(digit => digit) && !isVerifying
                ? 'bg-[#cf923d] text-white hover:bg-[#b8823a] active:scale-98' 
                : 'bg-[#a89c8a]/40 text-[#606060] cursor-not-allowed'
            }`}
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] text-[#cf923d] 
                         hover:text-[#b8823a] transition-colors underline flex items-center justify-center text-center"
              >
                Resend OTP
              </button>
            ) : (
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-[#606060]">
                Resend OTP in {resendTimer}s
              </p>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            disabled={isVerifying}
            className="w-full py-4 rounded-2xl border-2 border-[#a89c8a] bg-transparent 
                     font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] text-[#353535]
                     hover:bg-[#a89c8a]/10 transition-colors active:scale-98 disabled:opacity-50 flex items-center justify-center text-center"
          >
            Change Phone Number
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bottom-[40px] sm:bottom-[60px] left-1/2 -translate-x-1/2 w-[90%] max-w-[426px] text-center">
      <p className="font-['Poppins:Light',_sans-serif] text-[#606060] text-[14px] sm:text-[16px]">
        <span>Curated with love in Delhi, NCR </span>
        <span>💛</span>
      </p>
    </div>
  );
}

export default function OTPVerificationScreen({ phoneNumber, onVerify, onBack, onResend }) {
  /*
    🚀 API INTEGRATION - OTP VERIFICATION SCREEN:
    
    1. OTP Input Management:
       - Use pin_code_fields package for better UX
       - Auto-focus next field on input
       - Auto-submit when all fields filled
       - Handle paste from clipboard (SMS auto-read)
       
    2. SMS Auto-Read (Android):
       - Use sms_autofill package
       - Request SMS permissions
       - Auto-extract OTP from incoming SMS
       - Match sender and OTP pattern
       
    3. OTP Verification API:
       - API: POST /api/auth/verify-otp
       - Payload: { phone: string, otp: string, otp_id: string }
       - Response: { success: boolean, access_token: string, refresh_token: string, user: object }
       
    4. Timer & Resend Logic:
       - 60-second countdown timer
       - Disable resend button during countdown
       - Track resend attempts (max 3 times)
       - Exponential backoff for security
       
    5. Error Handling:
       - Invalid OTP (show specific error)
       - Expired OTP (auto-trigger resend flow)
       - Network issues (retry mechanism)
       - Too many failed attempts (temporary lockout)
       
    6. Security Features:
       - Rate limiting on verification attempts
       - Automatic logout after suspicious activity
       - Secure token storage using localStorage or sessionStorage
       - Biometric authentication setup prompt
       
    7. Accessibility:
       - Screen reader support for OTP fields
       - Voice assistance for visually impaired users
       - Keyboard navigation support
       - High contrast mode compatibility
  */
  const handleVerify = (otp) => {
    console.log("OTP verified:", otp);
    onVerify(otp);
  };

  const handleResend = () => {
    console.log("OTP resent to:", phoneNumber);
    // Show success message or toast
    if (onResend) {
      onResend();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 698 1511">
          <path d={svgPaths.p3a371780} fill="#F6EFD8" />
        </svg>
      </div>

      {/* Background Flower Pattern */}
      <div className="absolute flex h-[600px] sm:h-[800px] items-center justify-center left-1/2 -translate-x-1/2 mix-blend-multiply top-[-300px] sm:top-[-400px] w-[600px] sm:w-[800px]">
        <div className="flex-none rotate-[19.466deg]">
          <div 
            className="bg-center bg-cover bg-no-repeat opacity-[0.25] size-[500px] sm:size-[650px]" 
            style={{ backgroundImage: `url('${img103451}')` }} 
          />
        </div>
      </div>

      {/* Brand Header */}
      <BrandHeader />

      {/* OTP Form */}
      <OTPForm 
        phoneNumber={phoneNumber}
        onVerify={handleVerify} 
        onBack={onBack}
        onResend={handleResend}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}