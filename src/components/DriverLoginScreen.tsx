import React from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface DriverLoginScreenProps {
  onDriverLogin: (method: string, email?: string, password?: string) => void;
  onBack: () => void;
}

export default function DriverLoginScreen({ onDriverLogin, onBack }: DriverLoginScreenProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onDriverLogin('email', email, password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F6EFD8' }}>
      {/* Header */}
      <div className="p-4 pb-6">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="p-2 rounded-full"
            style={{ color: '#11211e' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl" style={{ 
              fontFamily: 'Samarkan', 
              color: '#11211e',
              fontWeight: 'bold'
            }}>
              Raahi Driver
            </h1>
            <p style={{ color: '#c3aa85', fontSize: '14px', marginTop: '4px' }}>
              Login to start earning
            </p>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Driver Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#cf923d' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10V6c0-2-2-4-4-4H4c-2 0-4 2-4 4v10c0 .6.4 1 1 1h2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <path d="M9 17h6"></path>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
          </div>
        </div>

        {/* Email Login Form */}
        <Card className="mb-6">
          <CardHeader className="text-center pb-4">
            <CardTitle style={{ color: '#11211e', fontSize: '18px' }}>
              Driver Login
            </CardTitle>
            <CardDescription style={{ color: '#c3aa85' }}>
              Enter your driver credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: '#11211e' }}>Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="driver@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: '#c3aa85',
                    color: '#11211e'
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: '#11211e' }}>Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: '#c3aa85',
                    color: '#11211e'
                  }}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12"
                style={{ 
                  backgroundColor: '#cf923d',
                  color: 'white',
                  fontWeight: 'bold'
                }}
                disabled={!email || !password}
              >
                Login as Driver
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Separator */}
        <div className="flex items-center gap-4 mb-6">
          <Separator className="flex-1" style={{ backgroundColor: '#c3aa85' }} />
          <span style={{ color: '#c3aa85', fontSize: '14px' }}>or continue with</span>
          <Separator className="flex-1" style={{ backgroundColor: '#c3aa85' }} />
        </div>

        {/* Alternative Login Methods */}
        <div className="space-y-3">
          <Button 
            onClick={() => onDriverLogin('truecaller')}
            className="w-full h-14 justify-start"
            variant="outline"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#c3aa85',
              color: '#11211e'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00A8FF' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 'bold' }}>Truecaller</div>
                <div style={{ color: '#c3aa85', fontSize: '14px' }}>Instant verification</div>
              </div>
            </div>
          </Button>

          <Button 
            onClick={() => onDriverLogin('google')}
            className="w-full h-14 justify-start"
            variant="outline"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#c3aa85',
              color: '#11211e'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DB4437' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 'bold' }}>Google</div>
                <div style={{ color: '#c3aa85', fontSize: '14px' }}>Quick & secure</div>
              </div>
            </div>
          </Button>

          <Button 
            onClick={() => onDriverLogin('mobile')}
            className="w-full h-14 justify-start"
            variant="outline"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#c3aa85',
              color: '#11211e'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#cf923d' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 'bold' }}>Mobile OTP</div>
                <div style={{ color: '#c3aa85', fontSize: '14px' }}>SMS verification</div>
              </div>
            </div>
          </Button>
        </div>

        {/* New Driver Registration */}
        <div className="mt-8 text-center">
          <p style={{ color: '#c3aa85', fontSize: '14px', marginBottom: '12px' }}>
            New to Raahi Driver?
          </p>
          <Button 
            variant="ghost"
            className="text-sm underline"
            style={{ color: '#cf923d' }}
            onClick={() => onDriverLogin('signup')}
          >
            Register as a New Driver
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p style={{ color: '#c3aa85', fontSize: '12px' }}>
            By continuing, you agree to Raahi's Driver Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
}