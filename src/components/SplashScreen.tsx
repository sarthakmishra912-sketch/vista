import svgPaths from "../imports/svg-ortnbr1thp";
import imgEllipse299 from "figma:asset/89b4a4aaa1b03293257be5b42d742cca4fa15ee7.png";
import img103451 from "figma:asset/5d54f3b2ac26f683d46d31996748c6b7893e6cc5.png";



function UserProfile({ email = "Dhruvsiwach@gmail.com" }) {
  const handleSwitchAccount = () => {
    // TODO: Implement account switching functionality
    console.log("Switch account clicked");
  };

  return (
    <div className="absolute bg-[#eedfca] box-border content-stretch flex gap-[17.9px] h-[52.1px] items-center justify-center left-1/2 -translate-x-1/2 pl-[8.95px] pr-[26.84px] py-[15.8px] rounded-[61.46px] top-[20px] w-[334px]">
      <div aria-hidden="true" className="absolute border-[#a89c8a] border-[0.58px] border-solid inset-0 pointer-events-none rounded-[61.46px]" />
      <div className="relative shrink-0 size-[39.37px]">
        <img className="block max-w-none size-full rounded-full" height="39.37" src={imgEllipse299} width="39.37" />
      </div>
      <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#353535] text-[15.58px] text-nowrap overflow-hidden">
        <p className="leading-[normal] whitespace-pre truncate">{email}</p>
      </div>
      <div className="flex h-[10.73px] items-center justify-center relative shrink-0 w-[19.68px]">
        <button 
          onClick={handleSwitchAccount}
          className="flex-none rotate-[90deg] hover:opacity-70 transition-opacity"
        >
          <div className="h-[19.68px] relative w-[10.74px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 27">
              <path d={svgPaths.p5825700} fill="#A89C8A" stroke="#EEDFCA" strokeWidth="0.63" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

function BrandSection() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[25px] items-center justify-start top-[120px] sm:top-[140px] left-1/2 -translate-x-1/2 w-[90%] max-w-[557px]">
      <div className="content-stretch flex flex-col items-center justify-start leading-[0] not-italic relative shrink-0 w-full">
        <div className="flex flex-col font-['Samarkan'] h-[175.725px] justify-center relative shrink-0 text-[#11211e] text-[80px] sm:text-[100px] md:text-[120px] lg:text-[159.316px] text-center w-full">
          <p className="leading-[normal]">Raahi</p>
        </div>
        <div className="font-['Jockey_One:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] relative shrink-0 text-[#c3aa85] text-center w-full mt-4">
          <p className="leading-[normal] not-italic whitespace-pre-wrap">
            <span className="font-['Kite_One:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] text-[32px] sm:text-[40px] md:text-[50.659px]">Butter to your</span>
            <span className="font-['Kite_One:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] text-[32px] sm:text-[40px] md:text-[50.659px] tracking-[-3.5461px]"> </span>
            <span className="font-['Abhaya_Libre_SemiBold:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] text-[36px] sm:text-[46px] md:text-[56.8px] tracking-[-3.976px]"> </span>
            <span className="font-['Abhaya_Libre_SemiBold:Regular',_'Noto_Sans_Devanagari:Bold',_sans-serif] text-[36px] sm:text-[46px] md:text-[56.8px]">जाम</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButtons({ onFindRide }) {
  const handleFindRide = () => {
    onFindRide();
  };

  const handleOpenDriversApp = () => {
    // TODO: Open drivers' app or navigate to driver mode
    console.log("Open drivers app clicked");
  };

  return (
    <div className="absolute top-[400px] sm:top-[450px] content-stretch flex flex-col items-center justify-start left-1/2 -translate-x-1/2 w-[90%] max-w-[585px] gap-6">
      {/* Find a Ride Button */}
      <button
        onClick={handleFindRide}
        className="bg-[#cf923d] box-border content-stretch flex gap-[20px] sm:gap-[115px] h-[80px] sm:h-[123px] items-center justify-center p-[20px] sm:p-[25.402px] relative rounded-[40px] shrink-0 w-full hover:bg-[#b8823a] transition-colors active:scale-98"
      >
        <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[20px] sm:text-[31.578px] text-nowrap">
          <p className="leading-[normal] whitespace-pre">Find a Ride Now!</p>
        </div>
        <div className="flex h-[20px] sm:h-[25px] items-center justify-center relative shrink-0 w-[23px] sm:w-[28.984px]">
          <div className="flex-none rotate-[90deg]">
            <div className="h-[23px] sm:h-[29px] relative w-[20px] sm:w-[25px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 29">
                <path d={svgPaths.p1a275700} fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {/* Open Drivers App Button */}
      <button
        onClick={handleOpenDriversApp}
        className="bg-[#eee5ca] box-border content-stretch flex gap-[20px] sm:gap-[190px] h-[70px] sm:h-[108px] items-center justify-center px-[20px] sm:px-[54px] py-[20px] sm:py-[27px] relative rounded-[40px] w-full border border-[#a89c8a] hover:bg-[#e5dcc5] transition-colors active:scale-98"
      >
        <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#353535] text-[18px] sm:text-[29.755px] text-nowrap">
          <p className="leading-[normal] whitespace-pre">Open Drivers' App</p>
        </div>
      </button>
    </div>
  );
}

function SwitchAccountLink() {
  const handleSwitchAccount = () => {
    // TODO: Implement account switching functionality
    console.log("Switch account link clicked");
  };

  return (
    <button
      onClick={handleSwitchAccount}
      className="absolute font-['Poppins:Regular',_sans-serif] leading-[0] left-1/2 -translate-x-1/2 not-italic text-[#353330] text-[20px] sm:text-[29.708px] text-nowrap top-[700px] sm:top-[750px] hover:opacity-70 transition-opacity"
    >
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[normal] underline whitespace-pre">Switch Account?</p>
    </button>
  );
}

function Footer() {
  return (
    <div className="absolute font-['Poppins:Medium',_sans-serif] leading-[0] not-italic text-[#606060] text-center top-[780px] sm:top-[850px] left-1/2 -translate-x-1/2 w-[90%] max-w-[426px]">
      <p className="leading-[normal] whitespace-pre-wrap">
        <span className="font-['Poppins:Light',_sans-serif] not-italic text-[#606060] text-[16px] sm:text-[25.782px]">Curated </span>
        <span className="font-['Poppins:Light',_sans-serif] not-italic text-[16px] sm:text-[25.782px]">with </span>
        <span className="font-['Poppins:Light',_sans-serif] not-italic text-[#606060] text-[16px] sm:text-[25.782px]">love in Delhi, NCR</span>
        <span className="font-['Poppins:Light',_sans-serif] not-italic text-[#606060] text-[16px] sm:text-[25.782px] tracking-[-0.7735px]"> </span>
        <span className="text-[#606060] text-[16px] sm:text-[20px]">💛</span>
      </p>
    </div>
  );
}

export default function SplashScreen({ onFindRide }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 698 1511">
          <path d={svgPaths.p3a371780} fill="#F6EFD8" />
        </svg>
      </div>

      {/* Background Flower Pattern */}
      <div className="absolute flex h-[800px] sm:h-[1237.805px] items-center justify-center left-1/2 -translate-x-1/2 mix-blend-multiply top-[-400px] sm:top-[-671.52px] w-[800px] sm:w-[1237.805px]">
        <div className="flex-none rotate-[19.466deg]">
          <div className="bg-center bg-cover bg-no-repeat opacity-[0.38] size-[600px] sm:size-[970px]" style={{ backgroundImage: `url('${img103451}')` }} />
        </div>
      </div>



      {/* User Profile */}
      <UserProfile />

      {/* Brand Section */}
      <BrandSection />

      {/* Action Buttons */}
      <ActionButtons onFindRide={onFindRide} />

      {/* Switch Account Link */}
      <SwitchAccountLink />

      {/* Footer */}
      <Footer />
    </div>
  );
}