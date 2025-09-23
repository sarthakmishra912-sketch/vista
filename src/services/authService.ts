import { authAPI, User, AuthTokens } from './api';

export interface LoginCredentials {
  method: 'mobile_otp' | 'google' | 'truecaller';
  phone?: string;
  otp?: string;
  countryCode?: string;
  idToken?: string;
  truecallerToken?: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private accessToken: string | null = null;

  private constructor() {
    this.loadStoredAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadStoredAuth(): void {
    this.accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuth();
      }
    }
  }

  private storeAuth(user: User, tokens: AuthTokens): void {
    this.currentUser = user;
    this.accessToken = tokens.accessToken;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuth(): void {
    this.currentUser = null;
    this.accessToken = null;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      let response;

      switch (credentials.method) {
        case 'mobile_otp':
          if (!credentials.phone || !credentials.otp) {
            throw new Error('Phone number and OTP are required');
          }
          response = await authAPI.verifyOTP(
            credentials.phone,
            credentials.otp,
            credentials.countryCode
          );
          break;

        case 'google':
          if (!credentials.idToken) {
            throw new Error('Google ID token is required');
          }
          response = await authAPI.authenticateWithGoogle(credentials.idToken);
          break;

        case 'truecaller':
          if (!credentials.phone || !credentials.truecallerToken) {
            throw new Error('Phone number and Truecaller token are required');
          }
          response = await authAPI.authenticateWithTruecaller(
            credentials.phone,
            credentials.truecallerToken
          );
          break;

        default:
          throw new Error('Invalid login method');
      }

      if (response.success && response.data) {
        this.storeAuth(response.data.user, response.data.tokens);
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async sendOTP(phone: string, countryCode: string = '+91'): Promise<void> {
    try {
      const response = await authAPI.sendOTP(phone, countryCode);
      if (!response.success) {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const response = await authAPI.getCurrentUser();
      if (response.success && response.data?.user) {
        this.currentUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        return this.currentUser;
      }
    } catch (error) {
      console.error('Get current user error:', error);
    }

    return null;
  }

  async updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
  }): Promise<User> {
    try {
      const response = await authAPI.updateProfile(updates);
      if (response.success && response.data?.user) {
        this.currentUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        return this.currentUser;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getUser(): User | null {
    return this.currentUser;
  }
}

export const authService = AuthService.getInstance();
export default authService;

