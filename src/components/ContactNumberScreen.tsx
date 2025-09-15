import { useState } from 'react';
import svgPaths from "../imports/svg-ortnbr1thp";
import img103451 from "figma:asset/5d54f3b2ac26f683d46d31996748c6b7893e6cc5.png";

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

function ContactForm({ onSubmit, onBack }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validatePhoneNumber = (number) => {
    // Basic validation for Indian phone numbers (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhoneNumber(value);
      setIsValid(validatePhoneNumber(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(phoneNumber);
    }
  };

  return (
    <div className="absolute top-[220px] sm:top-[260px] left-1/2 -translate-x-1/2 w-[90%] max-w-[400px]">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-[#a89c8a]/30 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="font-['Poppins:Medium',_sans-serif] text-[#11211e] text-[24px] sm:text-[28px] mb-2">
            Enter Your Contact Number
          </h2>
          <p className="font-['Poppins:Regular',_sans-serif] text-[#606060] text-[16px] sm:text-[18px]">
            We'll use this to contact you about your ride
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="phone" 
              className="block font-['Poppins:Medium',_sans-serif] text-[#353535] text-[16px] sm:text-[18px]"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 font-['Poppins:Medium',_sans-serif] text-[#606060] text-[16px] sm:text-[18px]">
                +91
              </div>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={handleInputChange}
                placeholder="9876543210"
                className="w-full pl-16 pr-4 py-4 border-2 border-[#a89c8a]/40 rounded-2xl 
                         font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-[#11211e]
                         focus:border-[#cf923d] focus:outline-none focus:ring-0 bg-[#f9f7f4]
                         placeholder:text-[#a89c8a] transition-colors"
                maxLength="10"
              />
            </div>
            {phoneNumber.length > 0 && !isValid && (
              <p className="text-red-500 text-[14px] sm:text-[16px] font-['Poppins:Regular',_sans-serif]">
                Please enter a valid 10-digit phone number
              </p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 rounded-2xl font-['Poppins:Medium',_sans-serif] text-[18px] sm:text-[20px] 
                        transition-all duration-200 flex items-center justify-center text-center ${
                isValid 
                  ? 'bg-[#cf923d] text-white hover:bg-[#b8823a] active:scale-98' 
                  : 'bg-[#a89c8a]/40 text-[#606060] cursor-not-allowed'
              }`}
            >
              Continue
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-4 rounded-2xl border-2 border-[#a89c8a] bg-transparent 
                       font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] text-[#353535]
                       hover:bg-[#a89c8a]/10 transition-colors active:scale-98 flex items-center justify-center text-center"
            >
              Back to Dashboard
            </button>
          </div>
        </form>
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

export default function ContactNumberScreen({ onSubmit, onBack }) {
  /*
    🚀 FLUTTER API INTEGRATION - CONTACT NUMBER SCREEN:
    
    1. Phone Number Validation:
       - Use libphonenumber for international validation
       - Real-time format checking as user types
       - Country code auto-detection based on SIM/location
       - Package: intl_phone_field or phone_number
       
    2. OTP Request API:
       - API: POST /api/auth/send-otp
       - Payload: { phone: string, country_code: string, app_signature: string }
       - Response: { success: boolean, otp_id: string, expires_at: timestamp, message: string }
       
    3. Rate Limiting & Security:
       - Track OTP requests per phone number (Redis/Database)
       - Implement exponential backoff for multiple attempts
       - Show appropriate error messages for rate limits
       - Max 3 OTP requests per hour per phone number
       
    4. Analytics & Monitoring:
       - Track phone number input completion rates
       - Monitor OTP request success/failure rates
       - Log user journey for conversion optimization
       - Firebase Analytics or Mixpanel integration
       
    5. Error Handling:
       - Network connectivity issues
       - Invalid phone number formats
       - Server errors and timeout scenarios
       - User-friendly error messages with retry options
       
    6. Local Storage:
       - Cache last entered phone number for convenience
       - Use SharedPreferences or Hive for local storage
       - Clear sensitive data on app uninstall
  */
  
  const handleSubmit = (phoneNumber) => {
    // TODO: Process the phone number (validate, store, send OTP, etc.)
    console.log("Phone number submitted:", phoneNumber);
    onSubmit(phoneNumber);
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

      {/* Contact Form */}
      <ContactForm onSubmit={handleSubmit} onBack={onBack} />

      {/* Footer */}
      <Footer />
    </div>
  );
}