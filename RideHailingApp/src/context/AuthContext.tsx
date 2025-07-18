import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, AuthSession } from '../services/auth';

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
    // Check for existing session on app start
    loadInitialSession();
  }, []);

  const loadInitialSession = async () => {
    try {
      const { session, error } = await authService.getSession();
      if (session && !error) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Error loading initial session:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { session, error } = await authService.signIn({ email, password });
      if (error) {
        throw new Error(error);
      }
      if (session) {
        setUser(session.user);
      }
      return { user: session?.user, error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign in failed';
      setLoading(false);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      const { user: newUser, error } = await authService.signUp({
        email,
        password,
        name: userData.name,
        phone: userData.phone,
        user_type: userData.user_type,
      });

      if (error) {
        throw new Error(error);
      }

      if (newUser) {
        // Automatically sign in after successful signup
        const { session, error: signInError } = await authService.signIn({ email, password });
        if (signInError) {
          throw new Error(signInError);
        }
        if (session) {
          setUser(session.user);
        }
        return { user: session?.user, error: null };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Sign up failed';
      setLoading(false);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) {
        throw new Error(error);
      }
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};