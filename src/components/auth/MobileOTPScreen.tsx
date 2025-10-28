import React, { useState, useEffect, useRef } from 'react';
import { Button } from "../ui/button";
import svgPaths from "../../imports/svg-1ch7gtc44c";
import img103451 from "figma:asset/5d54f3b2ac26f683d46d31996748c6b7893e6cc5.png";

interface MobileOTPScreenProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
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

export default function MobileOTPScreen({ 
  phoneNumber, 
  onVerify, 
  onResend, 
  onBack 
}: MobileOTPScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');
    if (digit.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (digit && index === 5 && newOtp.every(d => d)) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if all 6 digits are pasted
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpValue?: string) => {
    const otpString = otpValue || otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔢 Verifying OTP:', otpString);
      await onVerify(otpString);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');
    setOtp(['', '', '', '', '', '']);
    
    try {
      console.log('🔄 Resending OTP');
      await onResend();
      setResendTimer(30);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const maskPhoneNumber = (phone: string) => {
    // Show last 4 digits
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, -10)}XXXXXX${cleaned.slice(-4)}`;
    }
    return phone;
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
            disabled={loading}
            className="flex items-center gap-2 text-[#11211e] hover:text-[#cf923d] transition-colors disabled:opacity-50"
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
              Verify your number
            </h2>
            <p className="text-[#c3aa85] text-center text-sm max-w-sm">
              Enter the 6-digit code sent to
            </p>
            <p className="text-[#11211e] text-center text-base font-semibold mt-1">
              {maskPhoneNumber(phoneNumber)}
            </p>
          </div>

          {/* OTP Input Form */}
          <div className="w-full max-w-sm mx-auto space-y-6">
            {/* OTP Input Boxes */}
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-[#a89c8a] bg-white text-[#11211e] focus:outline-none focus:border-[#cf923d] transition-colors disabled:opacity-50"
                  style={{
                    caretColor: RAAHI_COLORS.primary,
                  }}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center flex items-center justify-center gap-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
                </svg>
                {error}
              </p>
            )}

            {/* Verify Button */}
            <Button
              onClick={() => handleVerify()}
              disabled={otp.some(d => !d) || loading}
              className="w-full h-14 text-lg font-semibold rounded-2xl transition-all"
              style={{
                backgroundColor: (otp.some(d => !d) || loading) ? '#c3aa85' : '#cf923d',
                color: 'white',
                opacity: (otp.some(d => !d) || loading) ? 0.6 : 1,
              }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-[#cf923d] font-semibold hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-[#c3aa85] text-sm">
                  Resend OTP in <span className="font-semibold text-[#cf923d]">{resendTimer}s</span>
                </p>
              )}
            </div>

            {/* Edit Number */}
            <div className="text-center pt-4">
              <button
                onClick={onBack}
                disabled={loading}
                className="text-[#11211e] text-sm underline hover:text-[#cf923d] transition-colors disabled:opacity-50"
              >
                Wrong number? Edit
              </button>
            </div>
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





