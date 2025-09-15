import React from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

interface DriverDashboardScreenProps {
  onBack: () => void;
  onToggleOnline: (isOnline: boolean) => void;
  userEmail?: string | null;
  isOnline?: boolean;
}

export default function DriverDashboardScreen({ 
  onBack, 
  onToggleOnline, 
  userEmail,
  isOnline = false 
}: DriverDashboardScreenProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6EFD8' }}>
      {/* Header */}
      <div className="p-4 pb-6">
        <div className="flex items-center justify-between mb-6">
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
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Driver Profile Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback style={{ backgroundColor: '#c3aa85', color: '#11211e' }}>
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'D'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle style={{ color: '#11211e' }}>
                  {userEmail ? userEmail.split('@')[0] : 'Driver'}
                </CardTitle>
                <CardDescription style={{ color: '#c3aa85' }}>
                  Professional Driver
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" style={{ backgroundColor: '#cf923d', color: 'white' }}>
                    ⭐ 4.8 Rating
                  </Badge>
                  <Badge variant="outline" style={{ borderColor: '#c3aa85', color: '#11211e' }}>
                    127 Trips
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Online Status Toggle */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: '#11211e', fontWeight: 'bold' }}>Go Online</h3>
                <p style={{ color: '#c3aa85', fontSize: '14px' }}>
                  {isOnline ? 'You are online and receiving ride requests' : 'You are offline'}
                </p>
              </div>
              <Switch 
                checked={isOnline}
                onCheckedChange={onToggleOnline}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div style={{ color: '#cf923d', fontSize: '24px', fontWeight: 'bold' }}>₹2,450</div>
              <div style={{ color: '#c3aa85', fontSize: '14px' }}>Today's Earnings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div style={{ color: '#cf923d', fontSize: '24px', fontWeight: 'bold' }}>8</div>
              <div style={{ color: '#c3aa85', fontSize: '14px' }}>Trips Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 style={{ color: '#11211e', fontWeight: 'bold', marginBottom: '16px' }}>
            Quick Actions
          </h3>
          
          <Button 
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 'bold' }}>Trip History</div>
                <div style={{ color: '#c3aa85', fontSize: '14px' }}>View your completed rides</div>
              </div>
            </div>
          </Button>

          <Button 
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 'bold' }}>Earnings Report</div>
                <div style={{ color: '#c3aa85', fontSize: '14px' }}>View detailed earnings</div>
              </div>
            </div>
          </Button>

          <Button 
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 'bold' }}>Profile Settings</div>
                <div style={{ color: '#c3aa85', fontSize: '14px' }}>Update your information</div>
              </div>
            </div>
          </Button>
        </div>

        {/* Current Status */}
        {isOnline && (
          <Card className="mt-6" style={{ backgroundColor: '#cf923d' }}>
            <CardContent className="p-4 text-center">
              <div className="animate-pulse">
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                  🚗 Looking for riders...
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>
                  You'll be notified when a ride request comes in
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}