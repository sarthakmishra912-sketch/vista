import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '../services/authService';
import { webSocketService } from '../services/websocketService';
import { notificationService } from '../services/notificationService';
import { paymentService } from '../services/paymentService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
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
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // Initialize services if user is authenticated
        if (currentUser) {
          // Initialize push notifications
          const pushToken = await notificationService.initialize();
          if (pushToken) {
            await notificationService.savePushToken(currentUser.id);
          }

          // Initialize payment tables
          await paymentService.initializePaymentTables();
          
          // Connect to WebSocket
          await webSocketService.connect();
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Cleanup services on unmount
    return () => {
      webSocketService.disconnect();
      notificationService.cleanup();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await authSignIn(email, password);
      
      if (result.error) {
        return result;
      }
      
      setUser(result.data.user);
      
      // Initialize services after successful sign in
      const pushToken = await notificationService.initialize();
      if (pushToken) {
        await notificationService.savePushToken(result.data.user.id);
      }
      
      await webSocketService.connect();
      
      return result;
    } catch (error: any) {
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      const result = await authSignUp(email, password, userData);
      
      if (result.error) {
        return result;
      }
      
      setUser(result.data.user);
      
      // Initialize services after successful sign up
      const pushToken = await notificationService.initialize();
      if (pushToken) {
        await notificationService.savePushToken(result.data.user.id);
      }
      
      await webSocketService.connect();
      
      return result;
    } catch (error: any) {
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
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

  const value: AuthContextType = {
    user,
    loading,
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