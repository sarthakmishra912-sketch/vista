import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatabaseUtils } from './database';
import CryptoJS from 'crypto-js';

// JWT simulation for React Native (simplified)
const JWT_SECRET = process.env.EXPO_PUBLIC_JWT_SECRET || 'your-jwt-secret-key';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  user_type: 'rider' | 'driver';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  user_type: 'rider' | 'driver';
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentSession: AuthSession | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Hash password
  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password + JWT_SECRET).toString();
  }

  // Verify password
  private verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  // Generate JWT-like token
  private generateToken(payload: any): string {
    const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const data = btoa(JSON.stringify(payload));
    const signature = CryptoJS.HmacSHA256(`${header}.${data}`, JWT_SECRET).toString();
    return `${header}.${data}.${signature}`;
  }

  // Verify token
  private verifyToken(token: string): any {
    try {
      const [header, payload, signature] = token.split('.');
      const expectedSignature = CryptoJS.HmacSHA256(`${header}.${payload}`, JWT_SECRET).toString();
      
      if (signature !== expectedSignature) {
        throw new Error('Invalid token signature');
      }

      const decodedPayload = JSON.parse(atob(payload));
      
      if (Date.now() > decodedPayload.exp) {
        throw new Error('Token expired');
      }

      return decodedPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Generate UUID
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Sign up new user
  async signUp(data: SignUpData): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if user already exists
      const existingUsers = await DatabaseUtils.select('users', '*', { email: data.email });
      if (existingUsers.length > 0) {
        return { user: null, error: 'User with this email already exists' };
      }

      // Hash password
      const hashedPassword = this.hashPassword(data.password);
      const userId = this.generateUUID();

      // Insert user
      const userData = {
        id: userId,
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
        phone: data.phone,
        user_type: data.user_type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await DatabaseUtils.insert('users', userData);

      // If driver, create driver record
      if (data.user_type === 'driver') {
        await DatabaseUtils.insert('drivers', {
          id: userId,
          license_number: '',
          is_verified: false,
          is_available: false,
          rating: 5.0,
          total_rides: 0,
          total_earnings: 0.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Return user (without password)
      const { password_hash, ...user } = userData;
      return { user: user as User, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { user: null, error: error.message || 'Sign up failed' };
    }
  }

  // Sign in user
  async signIn(data: SignInData): Promise<{ session: AuthSession | null; error: string | null }> {
    try {
      // Find user by email
      const users = await DatabaseUtils.select('users', '*', { email: data.email });
      if (users.length === 0) {
        return { session: null, error: 'Invalid email or password' };
      }

      const userData = users[0];

      // Verify password
      if (!this.verifyPassword(data.password, userData.password_hash)) {
        return { session: null, error: 'Invalid email or password' };
      }

      // Generate tokens
      const expiresAt = Date.now() + TOKEN_EXPIRY;
      const tokenPayload = { userId: userData.id, email: userData.email, exp: expiresAt };
      const accessToken = this.generateToken(tokenPayload);
      const refreshToken = this.generateToken({ userId: userData.id, type: 'refresh', exp: expiresAt });

      // Create session
      const { password_hash, ...user } = userData;
      const session: AuthSession = {
        user: user as User,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      };

      // Store session
      this.currentSession = session;
      await AsyncStorage.setItem('@auth_session', JSON.stringify(session));

      return { session, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { session: null, error: error.message || 'Sign in failed' };
    }
  }

  // Sign out user
  async signOut(): Promise<{ error: string | null }> {
    try {
      this.currentSession = null;
      await AsyncStorage.removeItem('@auth_session');
      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error: error.message || 'Sign out failed' };
    }
  }

  // Get current session
  async getSession(): Promise<{ session: AuthSession | null; error: string | null }> {
    try {
      if (this.currentSession) {
        // Check if token is still valid
        if (Date.now() < this.currentSession.expires_at) {
          return { session: this.currentSession, error: null };
        }
      }

      // Try to load from storage
      const storedSession = await AsyncStorage.getItem('@auth_session');
      if (storedSession) {
        const session: AuthSession = JSON.parse(storedSession);
        
        // Check if token is still valid
        if (Date.now() < session.expires_at) {
          this.currentSession = session;
          return { session, error: null };
        } else {
          // Token expired, remove it
          await AsyncStorage.removeItem('@auth_session');
        }
      }

      return { session: null, error: null };
    } catch (error: any) {
      console.error('Get session error:', error);
      return { session: null, error: error.message };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    const { session, error } = await this.getSession();
    if (error) {
      return { user: null, error };
    }
    return { user: session?.user || null, error: null };
  }

  // Update user profile
  async updateUser(updates: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    try {
      const { session, error: sessionError } = await this.getSession();
      if (sessionError || !session) {
        return { user: null, error: 'Not authenticated' };
      }

      // Update user in database
      const updatedUser = await DatabaseUtils.update('users', updates, { id: session.user.id });
      
      // Update session
      const { password_hash, ...user } = updatedUser;
      this.currentSession = {
        ...session,
        user: user as User,
      };
      await AsyncStorage.setItem('@auth_session', JSON.stringify(this.currentSession));

      return { user: user as User, error: null };
    } catch (error: any) {
      console.error('Update user error:', error);
      return { user: null, error: error.message || 'Update failed' };
    }
  }

  // Reset password (simplified version)
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const users = await DatabaseUtils.select('users', '*', { email });
      if (users.length === 0) {
        return { error: 'No user found with this email' };
      }

      // In a real app, you would send an email with a reset link
      // For now, we'll just log a temporary password
      const tempPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = this.hashPassword(tempPassword);
      
      await DatabaseUtils.update('users', { password_hash: hashedPassword }, { email });
      
      console.log(`Temporary password for ${email}: ${tempPassword}`);
      
      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: error.message || 'Reset failed' };
    }
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ error: string | null }> {
    try {
      const { session, error: sessionError } = await this.getSession();
      if (sessionError || !session) {
        return { error: 'Not authenticated' };
      }

      // Get user with password
      const users = await DatabaseUtils.select('users', '*', { id: session.user.id });
      if (users.length === 0) {
        return { error: 'User not found' };
      }

      const userData = users[0];

      // Verify current password
      if (!this.verifyPassword(currentPassword, userData.password_hash)) {
        return { error: 'Current password is incorrect' };
      }

      // Update password
      const hashedPassword = this.hashPassword(newPassword);
      await DatabaseUtils.update('users', { password_hash: hashedPassword }, { id: session.user.id });

      return { error: null };
    } catch (error: any) {
      console.error('Change password error:', error);
      return { error: error.message || 'Password change failed' };
    }
  }

  // Refresh token
  async refreshToken(): Promise<{ session: AuthSession | null; error: string | null }> {
    try {
      const { session, error: sessionError } = await this.getSession();
      if (sessionError || !session) {
        return { session: null, error: 'Not authenticated' };
      }

      // Generate new tokens
      const expiresAt = Date.now() + TOKEN_EXPIRY;
      const tokenPayload = { userId: session.user.id, email: session.user.email, exp: expiresAt };
      const accessToken = this.generateToken(tokenPayload);
      const refreshToken = this.generateToken({ userId: session.user.id, type: 'refresh', exp: expiresAt });

      const newSession: AuthSession = {
        ...session,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      };

      this.currentSession = newSession;
      await AsyncStorage.setItem('@auth_session', JSON.stringify(newSession));

      return { session: newSession, error: null };
    } catch (error: any) {
      console.error('Refresh token error:', error);
      return { session: null, error: error.message || 'Token refresh failed' };
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export default authService;