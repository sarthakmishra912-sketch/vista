import React from 'react';
import TruecallerLoginButton from './TruecallerLoginButton';
import GoogleLoginButton from './GoogleLoginButton';
import MobileOTPButton from './MobileOTPButton';

interface LoginButtonsProps {
  onLogin: (method: string) => void;
}

export default function LoginButtons({ onLogin }: LoginButtonsProps) {
  return (
    <div className="w-full max-w-sm mx-auto px-6 space-y-4">
      <div className="space-y-3">
        <TruecallerLoginButton onLogin={onLogin} />
        <GoogleLoginButton onLogin={onLogin} />
      </div>
      <div className="pt-8">
        <MobileOTPButton onLogin={onLogin} />
      </div>
    </div>
  );
}