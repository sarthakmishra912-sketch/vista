// App constants and configuration

export const RAAHI_COLORS = {
  background: '#F6EFD8',
  text: '#11211e',
  tagline: '#c3aa85',
  button: '#cf923d',
  accent: '#e8dbc9',
  border: '#a89c8a',
} as const;

export const SCREEN_TYPES = {
  DASHBOARD: 'dashboard',
  LOGIN: 'login',
  CONTACT: 'contact',
  OTP: 'otp',
  TERMS: 'terms',
  BOOKING: 'booking',
  BOOKING_LOADER: 'booking-loader',
  DRIVER_TRACKING: 'driver-tracking',
  DRIVER_SIGNUP: 'driver-signup',
} as const;

export const STORAGE_KEYS = {
  TERMS_ACCEPTED: 'raahi_has_accepted_terms',
  USER_EMAIL: 'raahi_user_email',
} as const;

export const LOGIN_METHODS = {
  TRUECALLER: 'truecaller',
  GOOGLE: 'google',
  MOBILE_OTP: 'mobile-otp',
  AUTO_LOGIN: 'auto-login',
} as const;