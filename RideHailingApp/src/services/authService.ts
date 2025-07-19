import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';
import { query } from './database';
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

// Sign up function
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.data && existingUser.data.length > 0) {
      return { data: null, error: 'User already exists' };
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const userResult = await query(
      `INSERT INTO users (email, password_hash, name, phone, user_type) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, phone, user_type, created_at`,
      [email, passwordHash, userData.name, userData.phone, userData.user_type || 'rider']
    );
    
    if (userResult.error) {
      return { data: null, error: userResult.error };
    }
    
    const user = userResult.data[0];
    
    // If user is a driver, create driver record
    if (userData.user_type === 'driver' && userData.vehicle_info && userData.license_number) {
      await query(
        `INSERT INTO drivers (id, license_number, vehicle_info) 
         VALUES ($1, $2, $3)`,
        [user.id, userData.license_number, JSON.stringify(userData.vehicle_info)]
      );
    }
    
    // Create session token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      userType: user.user_type,
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    };
    
    const token = createJWT(tokenPayload);
    
    // Store session in database
    await query(
      `INSERT INTO user_sessions (user_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [user.id, token, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
    );
    
    // Store token locally
    await AsyncStorage.setItem('auth_token', token);
    
    return { 
      data: { 
        user: { ...user, access_token: token },
        session: { access_token: token }
      }, 
      error: null 
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Sign in function
export const signIn = async (email: string, password: string) => {
  try {
    // Get user with password hash
    const userResult = await query(
      `SELECT u.*, d.license_number, d.is_verified as driver_verified, 
              d.is_available, d.current_location, d.rating, d.total_rides, 
              d.vehicle_info
       FROM users u 
       LEFT JOIN drivers d ON u.id = d.id 
       WHERE u.email = $1`,
      [email]
    );
    
    if (userResult.error || !userResult.data || userResult.data.length === 0) {
      return { data: null, error: 'Invalid email or password' };
    }
    
    const user = userResult.data[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return { data: null, error: 'Invalid email or password' };
    }
    
    // Create session token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      userType: user.user_type,
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    };
    
    const token = createJWT(tokenPayload);
    
    // Clean up old sessions
    await query(
      'DELETE FROM user_sessions WHERE user_id = $1 AND expires_at < NOW()',
      [user.id]
    );
    
    // Store new session
    await query(
      `INSERT INTO user_sessions (user_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [user.id, token, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
    );
    
    // Store token locally
    await AsyncStorage.setItem('auth_token', token);
    
    // Remove sensitive data
    delete user.password_hash;
    
    return { 
      data: { 
        user: { ...user, access_token: token },
        session: { access_token: token }
      }, 
      error: null 
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
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
    delete user.password_hash;
    
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