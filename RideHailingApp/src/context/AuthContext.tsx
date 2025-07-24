import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { 
  getCurrentUser, 
  requestOTP, 
  verifyOTPAndSignIn, 
  resendOTP, 
  getOTPSessionStatus,
  signOut as authSignOut 
} from '../services/authService';
import { webSocketService } from '../services/websocketService';
import { notificationService } from '../services/notificationService';
import { paymentService } from '../services/paymentService';
import { OTPResult, VerifyOTPResult } from '../services/otpService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  requestOTP: (phone: string) => Promise<OTPResult>;
  verifyOTP: (sessionId: string, otp: string, userData?: any) => Promise<VerifyOTPResult>;
  resendOTP: (sessionId: string) => Promise<OTPResult>;
  getSessionStatus: (sessionId: string) => Promise<any>;
  signIn: (phone: string, password?: string) => Promise<any>;
  signUp: (userData: any) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple initialization without network calls for debugging
    const getInitialSession = async () => {
      try {
        // Check for cached user only, no API calls
        const token = await AsyncStorage.getItem('auth_token');
        const cachedUser = await AsyncStorage.getItem('user_data');
        
        if (token && cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch (parseError) {
            console.error('Error parsing cached user:', parseError);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // No cleanup needed for simplified version
  }, []);

  const handleRequestOTP = async (phone: string): Promise<OTPResult> => {
    try {
      setLoading(true);
      return await requestOTP(phone);
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (sessionId: string, otp: string, userData?: any): Promise<VerifyOTPResult> => {
    try {
      setLoading(true);
      const result = await verifyOTPAndSignIn(sessionId, otp, userData);
      
      if (result.success && result.user) {
        setUser(result.user);
        
        // Initialize services after successful verification
        const pushToken = await notificationService.initialize();
        if (pushToken) {
          await notificationService.savePushToken(result.user.id);
        }
        
        await webSocketService.connect();
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (sessionId: string): Promise<OTPResult> => {
    try {
      return await resendOTP(sessionId);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const handleGetSessionStatus = async (sessionId: string) => {
    try {
      return await getOTPSessionStatus(sessionId);
    } catch (error: any) {
      return { valid: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Remove push token and cleanup services before signing out
      if (user) {
        await notificationService.removePushToken(user.id);
      }
      
      webSocketService.disconnect();
      notificationService.cleanup();
      
      await authSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Alias methods for backward compatibility
  const signIn = async (phone: string, password?: string) => {
    // For OTP-based authentication, we'll use requestOTP
    return await handleRequestOTP(phone);
  };

  const signUp = async (userData: any) => {
    // For new user registration, also start with OTP
    return await handleRequestOTP(userData.phone);
  };

  const value: AuthContextType = {
    user,
    loading,
    requestOTP: handleRequestOTP,
    verifyOTP: handleVerifyOTP,
    resendOTP: handleResendOTP,
    getSessionStatus: handleGetSessionStatus,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};