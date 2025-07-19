import AsyncStorage from '@react-native-async-storage/async-storage';
import { query } from './database';
import { otpService, OTPResult, VerifyOTPResult } from './otpService';
import { User } from '../types';

// JWT secret - in production, this should be from environment variables
const JWT_SECRET = process.env.EXPO_PUBLIC_JWT_SECRET || 'your-secret-key';

// Simple JWT implementation for mobile
const createJWT = (payload: any): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const verifyJWT = (token: string): any => {
  try {
    const [header, payload, signature] = token.split('.');
    const expectedSignature = btoa(`${header}.${payload}.${JWT_SECRET}`);
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }
    
    const decodedPayload = JSON.parse(atob(payload));
    
    if (decodedPayload.exp && Date.now() / 1000 > decodedPayload.exp) {
      throw new Error('Token expired');
    }
    
    return decodedPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Request OTP for phone number
export const requestOTP = async (phone: string): Promise<OTPResult> => {
  return await otpService.requestOTP(phone);
};

// Verify OTP and complete authentication
export const verifyOTPAndSignIn = async (
  sessionId: string, 
  otp: string, 
  userData?: any
): Promise<VerifyOTPResult> => {
  return await otpService.verifyOTP(sessionId, otp, userData);
};

// Resend OTP
export const resendOTP = async (sessionId: string): Promise<OTPResult> => {
  return await otpService.resendOTP(sessionId);
};

// Get OTP session status
export const getOTPSessionStatus = async (sessionId: string) => {
  return await otpService.getSessionStatus(sessionId);
};

// Sign out function
export const signOut = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    
    if (token) {
      // Remove session from database
      await query(
        'DELETE FROM user_sessions WHERE token = $1',
        [token]
      );
    }
    
    // Remove token locally
    await AsyncStorage.removeItem('auth_token');
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get current user function
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    
    if (!token) {
      return null;
    }
    
    // Verify token
    const payload = verifyJWT(token);
    
    // Get current user data
    const userResult = await query(
      `SELECT u.*, d.license_number, d.is_verified as driver_verified, 
              d.is_available, d.current_location, d.rating, d.total_rides, 
              d.vehicle_info
       FROM users u 
       LEFT JOIN drivers d ON u.id = d.id 
       WHERE u.id = $1`,
      [payload.userId]
    );
    
    if (userResult.error || !userResult.data || userResult.data.length === 0) {
      await AsyncStorage.removeItem('auth_token');
      return null;
    }
    
    const user = userResult.data[0];
    
    // Parse JSON fields
    if (user.current_location) {
      user.current_location = JSON.parse(user.current_location);
    }
    if (user.vehicle_info) {
      user.vehicle_info = JSON.parse(user.vehicle_info);
    }
    
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    await AsyncStorage.removeItem('auth_token');
    return null;
  }
};

// Verify session function
export const verifySession = async (token: string): Promise<boolean> => {
  try {
    // Check if token exists in database and is not expired
    const sessionResult = await query(
      'SELECT id FROM user_sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    
    if (sessionResult.error || !sessionResult.data || sessionResult.data.length === 0) {
      return false;
    }
    
    // Verify JWT
    verifyJWT(token);
    
    return true;
  } catch (error) {
    return false;
  }
};

// Get auth token
export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_token');
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    if (updates.name) {
      updateFields.push(`name = $${paramIndex}`);
      values.push(updates.name);
      paramIndex++;
    }

    if (updates.email) {
      updateFields.push(`email = $${paramIndex}`);
      values.push(updates.email);
      paramIndex++;
    }

    if (updates.avatar_url) {
      updateFields.push(`avatar_url = $${paramIndex}`);
      values.push(updates.avatar_url);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return { data: null, error: 'No fields to update' };
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(userId);

    const result = await query(
      `UPDATE users SET ${updateFields.join(', ')} 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values
    );

    if (result.error) {
      throw new Error(result.error);
    }

    return { data: result.data[0], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Check if phone number is already registered
export const checkPhoneExists = async (phone: string): Promise<{ exists: boolean; user?: User }> => {
  try {
    const result = await query(
      'SELECT id, phone, name, user_type FROM users WHERE phone = $1',
      [phone]
    );

    if (result.error) {
      throw new Error(result.error);
    }

    const exists = result.data && result.data.length > 0;
    return {
      exists,
      user: exists ? result.data[0] : undefined,
    };
  } catch (error) {
    console.error('Error checking phone exists:', error);
    return { exists: false };
  }
};

// Delete user account
export const deleteUserAccount = async (userId: string) => {
  try {
    // This will cascade delete related records due to foreign key constraints
    const result = await query(
      'DELETE FROM users WHERE id = $1',
      [userId]
    );

    if (result.error) {
      throw new Error(result.error);
    }

    // Clear local storage
    await AsyncStorage.removeItem('auth_token');

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Legacy functions for backward compatibility (will be removed)
export const signUp = async (phone: string, userData: any) => {
  console.warn('signUp is deprecated. Use requestOTP and verifyOTPAndSignIn instead.');
  const otpResult = await requestOTP(phone);
  return {
    data: otpResult.success ? { sessionId: otpResult.sessionId } : null,
    error: otpResult.error || null,
  };
};

export const signIn = async (phone: string) => {
  console.warn('signIn is deprecated. Use requestOTP and verifyOTPAndSignIn instead.');
  const otpResult = await requestOTP(phone);
  return {
    data: otpResult.success ? { sessionId: otpResult.sessionId } : null,
    error: otpResult.error || null,
  };
};