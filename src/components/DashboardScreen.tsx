import svgPaths from "../imports/svg-kewznvodg6";
import imgEllipse299 from "figma:asset/89b4a4aaa1b03293257be5b42d742cca4fa15ee7.png";
import img103451 from "figma:asset/5d54f3b2ac26f683d46d31996748c6b7893e6cc5.png";

interface DashboardScreenProps {
  onFindRide: () => void;
  onOpenDriversApp: () => void;
  onSwitchAccount: () => void;
  onOpenAdmin?: () => void;
  userEmail?: string;
}



function UserAccountButton({ userEmail, onSwitchAccount }: { userEmail?: string; onSwitchAccount: () => void }) {
  return (
    <button
      onClick={onSwitchAccount}
      className="absolute bg-[#eedfca] box-border content-stretch flex gap-3 h-[48px] items-center justify-center px-3 py-2 rounded-full top-[80px] translate-x-[-50%] w-full max-w-[min(360px,calc(100vw-48px))] hover:bg-[#e8dbc9] transition-colors active:scale-95"
      style={{ left: "50%" }}
    >
      <div aria-hidden="true" className="absolute border-[#a89c8a] border-[0.78px] border-solid inset-0 pointer-events-none rounded-full" />
      <div className="relative shrink-0 size-[36px]">
        <img className="block max-w-none size-full rounded-full object-cover" height="36" src={imgEllipse299} width="36" alt="User avatar" />
      </div>
      <div className="font-medium leading-[0] not-italic relative flex-1 text-[#353535] text-base min-w-0">
        <p className="leading-[normal] truncate">{userEmail || 'Dhruvsiwach@gmail.com'}</p>
      </div>
      <div className="flex h-[12px] items-center justify-center relative shrink-0 w-[22px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-[22px] relative w-[12px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 27">
              <path d={svgPaths.p5825700} fill="var(--fill-0, #A89C8A)" id="icon_back" stroke="var(--stroke-0, #EEDFCA)" strokeWidth="0.835121" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

function RaahiBranding() {
  return (
    <div className="absolute top-[180px] content-stretch flex flex-col items-center justify-start translate-x-[-50%] w-full max-w-[557px] px-4" style={{ left: "50%" }}>
      <div className="content-stretch flex flex-col gap-6 items-center justify-start w-full max-w-[426px]">
        <div className="content-stretch flex flex-col items-center justify-start leading-[0] not-italic relative shrink-0 w-full">
          <div className="flex flex-col font-['Samarkan'] justify-center relative shrink-0 text-[#11211e] text-center w-full">
            <h1 
              className="leading-[normal]"
              style={{ fontSize: 'clamp(80px, 12vw, 160px)' }}
            >
              Raahi
            </h1>
          </div>
          <div className="font-['Jockey_One'] relative shrink-0 text-[#c3aa85] w-full text-center">
            <p className="leading-[normal] not-italic">
              <span 
                className="font-['Kite_One']"
                style={{ fontSize: 'clamp(28px, 4vw, 51px)' }}
              >
                Butter to your
              </span>
              <span className="font-['Kite_One'] tracking-[-2px]"> </span>
              <span 
                className="font-['Abhaya_Libre_SemiBold']"
                style={{ fontSize: 'clamp(32px, 4.5vw, 57px)' }}
              >
                जाम
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FindRideButton({ onFindRide }: { onFindRide: () => void }) {
  return (
    <button
      onClick={onFindRide}
      className="bg-[#cf923d] box-border content-stretch flex gap-4 h-[80px] items-center justify-center px-6 py-4 relative rounded-[40px] shrink-0 w-full hover:bg-[#c8893a] transition-colors active:scale-95"
    >
      <div className="font-medium leading-[0] not-italic relative text-white text-xl sm:text-2xl text-center">
        <p className="leading-[normal]">Find a Ride Now!</p>
      </div>
      <div className="flex h-[25px] items-center justify-center relative shrink-0 w-[29px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-[29px] relative w-[25px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 29">
              <path d={svgPaths.p1a275700} fill="var(--fill-0, white)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

function OpenDriversAppButton({ onOpenDriversApp }: { onOpenDriversApp: () => void }) {
  return (
    <button
      onClick={onOpenDriversApp}
      className="bg-[#fef8e3] box-border content-stretch flex h-[70px] items-center justify-center px-6 py-4 relative rounded-[40px] w-full border border-[#a89c8a] hover:bg-[#fcf5db] transition-colors active:scale-95"
    >
      <div className="font-medium leading-[0] not-italic relative text-[#353535] text-xl sm:text-2xl text-center">
        <p className="leading-[normal]">Open Drivers' App</p>
      </div>
    </button>
  );
}

function ActionButtons({ onFindRide, onOpenDriversApp }: { onFindRide: () => void; onOpenDriversApp: () => void }) {
  return (
    <div className="absolute bottom-[180px] content-stretch flex flex-col items-center justify-center gap-6 translate-x-[-50%] w-full max-w-[min(585px,calc(100vw-32px))] px-4" style={{ left: "50%" }}>
      <div className="w-full">
        <FindRideButton onFindRide={onFindRide} />
      </div>
      <div className="w-full">
        <OpenDriversAppButton onOpenDriversApp={onOpenDriversApp} />
      </div>
    </div>
  );
}

export default function DashboardScreen({ onFindRide, onOpenDriversApp, onSwitchAccount, onOpenAdmin, userEmail }: DashboardScreenProps) {
  return (
    <div className="relative size-full min-h-screen overflow-hidden" data-name="Dashboard">
      {/* Background */}
      <div className="absolute inset-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 698 1511">
          <path d={svgPaths.p3a371780} fill="var(--fill-0, #F6EFD8)" id="Vector" />
        </svg>
      </div>

      {/* Decorative Background Pattern */}
      <div className="absolute flex items-center justify-center left-[-20%] mix-blend-multiply top-[-40%] w-[140%] h-[80%] pointer-events-none">
        <div className="flex-none rotate-[19.466deg] opacity-40">
          <div className="bg-center bg-cover bg-no-repeat size-[min(80vw,600px)]" style={{ backgroundImage: `url('${img103451}')` }} />
        </div>
      </div>


      
      {/* Raahi Branding */}
      <RaahiBranding />
      
      {/* User Account Button */}
      <UserAccountButton userEmail={userEmail} onSwitchAccount={onSwitchAccount} />
      
      {/* Action Buttons */}
      <ActionButtons onFindRide={onFindRide} onOpenDriversApp={onOpenDriversApp} />
      
      {/* Switch Account Link */}
      <button
        onClick={onSwitchAccount}
        className="absolute font-medium leading-[0] not-italic text-[#353330] text-xl bottom-[120px] translate-x-[-50%] hover:text-[#11211e] transition-colors active:scale-95"
        style={{ left: "50%" }}
      >
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[normal] underline">Switch Account?</p>
      </button>
      
      {/* Footer Text (Click 5 times to access admin) */}
      <div 
        className="absolute font-medium leading-[0] not-italic text-[#606060] text-center bottom-[40px] translate-x-[-50%] w-full max-w-[426px] px-4 cursor-pointer select-none" 
        style={{ left: "50%" }}
        onClick={(e) => {
          const clicks = parseInt(e.currentTarget.dataset.clicks || '0') + 1;
          e.currentTarget.dataset.clicks = clicks.toString();
          if (clicks >= 5 && onOpenAdmin) {
            e.currentTarget.dataset.clicks = '0';
            console.log('Admin access unlocked!');
            onOpenAdmin();
          }
        }}
      >
        <p className="leading-[normal]">
          <span className="font-light not-italic text-[#606060] text-lg">Curated with love in Delhi, NCR </span>
          <span className="text-[#606060] text-base">💛</span>
        </p>
      </div>
    </div>
  );
}