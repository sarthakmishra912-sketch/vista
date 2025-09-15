import React, { useState } from 'react';
import svgPaths from "../imports/svg-yeit1xumim";

interface DriverSignupScreenProps {
  onContinue: (email: string, password: string) => void;
  onBack: () => void;
  userEmail?: string;
}

function StatusBar() {
  return (
    <div className="absolute bg-white box-border content-stretch flex justify-between h-[58px] items-center left-0 overflow-clip px-4 py-2 top-0 w-full">
      <div className="font-medium leading-[0] relative shrink-0 text-[#170e2b] text-xl tracking-wide">
        <p className="leading-[normal]">12:30</p>
      </div>
      <div className="h-[21px] relative shrink-0 w-[122px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 123 21">
          <g id="Auto Layout Horizontal">
            <path d={svgPaths.p32edff00} fill="var(--fill-0, #170E2B)" id="Exclude" />
            <path d={svgPaths.p1b4fce00} fill="var(--fill-0, #170E2B)" id="Exclude_2" />
            <g id="Group">
              <path d={svgPaths.p2de66400} fill="var(--fill-0, #170E2B)" id="Union" opacity="0.4" />
              <rect fill="var(--fill-0, #170E2B)" height="13.5385" id="Rectangle" rx="2.32479" width="30.9614" x="83.6469" y="3.69172" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function SupportButton() {
  return (
    <button className="bg-[#282828] box-border content-stretch flex gap-[14px] h-[55px] items-center justify-center pl-[16px] pr-[13px] py-[16px] relative rounded-[11px] shrink-0 hover:bg-[#3a3a3a] transition-colors active:scale-95">
      <div className="flex flex-col font-medium justify-center leading-[0] not-italic relative shrink-0 text-[22px] text-nowrap text-white tracking-[-0.66px]">
        <p className="leading-[41px]">Support</p>
      </div>
      <div className="flex h-[10px] items-center justify-center relative shrink-0 w-[19px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-[19px] relative w-[10px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 19">
              <path d={svgPaths.p49ccb00} fill="var(--fill-0, white)" id="icon_back" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

function Header() {
  return (
    <div className="bg-[#f6efd8] relative rounded-[30px] shrink-0 w-full">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-between px-10 py-[30px] relative w-full">
          <div className="flex flex-col font-['Samarkan'] justify-center leading-[0] not-italic relative shrink-0 text-[52px] text-black text-center text-nowrap">
            <p className="leading-[normal]">Raahi</p>
          </div>
          <SupportButton />
        </div>
      </div>
    </div>
  );
}

function SigninDetails() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start leading-[0] not-italic px-5 py-0 relative w-full">
          <div className="font-medium relative shrink-0 text-[#080a24] text-[48px] tracking-[-1.44px] w-full">
            <p className="leading-[1.2]">Sign-in Details Required</p>
          </div>
          <div className="font-normal relative shrink-0 text-[#2e2e2e] text-[24px] tracking-[-0.72px] w-full">
            <p className="leading-[normal]">To set up your driver account, we need to collect your email address and password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailAddressField({ email, onChange }: { email: string; onChange: (value: string) => void }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start px-5 py-0 relative w-full">
          <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#080a24] text-[36px] tracking-[-1.08px] w-full">
            <p className="leading-[normal]">Email Address</p>
          </div>
          <div className="bg-[#f6f6f6] relative rounded-[20px] shrink-0 w-full">
            <div className="flex flex-row items-center justify-center relative size-full">
              <div className="box-border content-stretch flex gap-2.5 items-center justify-center px-5 py-[30px] relative w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onChange(e.target.value)}
                  className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic bg-transparent outline-none relative shrink-0 text-[#444343] text-[26px] tracking-[-0.78px] w-full"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ password, onChange }: { password: string; onChange: (value: string) => void }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start px-5 py-0 relative w-full">
          <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#080a24] text-[36px] tracking-[-1.08px] w-full">
            <p className="leading-[normal]">Password</p>
          </div>
          <div className="bg-[#f6f6f6] relative rounded-[20px] shrink-0 w-full">
            <div className="flex flex-row items-center justify-center relative size-full">
              <div className="box-border content-stretch flex gap-2.5 items-center justify-center px-5 py-[30px] relative w-full">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => onChange(e.target.value)}
                  className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic bg-transparent outline-none relative shrink-0 text-[#444343] text-[26px] tracking-[-0.78px] w-full"
                  placeholder="Create a secure password"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainContent({ email, setEmail, password, setPassword }: { 
  email: string; 
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}) {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-start justify-start relative shrink-0 w-full">
      <SigninDetails />
      <EmailAddressField email={email} onChange={setEmail} />
      <PasswordField password={password} onChange={setPassword} />
    </div>
  );
}

function ContinueButton({ onContinue, disabled }: { onContinue: () => void; disabled: boolean }) {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-2.5 items-start justify-start left-0 px-5 py-[30px] shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)] bottom-0 w-full">
      <button
        onClick={onContinue}
        disabled={disabled}
        className={`bg-[#282828] relative rounded-[30px] shrink-0 w-full transition-all active:scale-95 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3a3a3a]'
        }`}
      >
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex items-center justify-center p-[40px] relative w-full">
            <div className="flex flex-col font-medium justify-center leading-[0] not-italic relative shrink-0 text-[36px] text-center text-nowrap text-white tracking-[-1.08px]">
              <p className="leading-[normal]">Continue</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function DriverSignupScreen({ onContinue, onBack, userEmail }: DriverSignupScreenProps) {
  const [email, setEmail] = useState(userEmail || 'Dhruvsiwach03@gmail.com');
  const [password, setPassword] = useState('');

  const handleContinue = () => {
    if (email.trim() && password.trim()) {
      onContinue(email.trim(), password.trim());
    }
  };

  const isFormValid = email.trim().length > 0 && password.trim().length >= 6;

  return (
    <div className="bg-white relative size-full min-h-screen overflow-hidden" data-name="Driver Signup">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-10 items-start justify-start pb-40 pt-20 px-4 relative size-full">
          {/* Header */}
          <div className="content-stretch flex flex-col gap-10 items-start justify-start relative shrink-0 w-full">
            <Header />
            <MainContent 
              email={email} 
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          </div>
          
          {/* Status Bar */}
          <StatusBar />
          
          {/* Continue Button */}
          <ContinueButton onContinue={handleContinue} disabled={!isFormValid} />
        </div>
      </div>
    </div>
  );
}