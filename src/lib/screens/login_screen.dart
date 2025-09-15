import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state_provider.dart';
import '../utils/raahi_colors.dart';
import '../constants.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    
    return Scaffold(
      backgroundColor: RaahiColors.backgroundPrimary,
      body: SafeArea(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: screenHeight),
            child: Column(
              children: [
                // Main content area
                Expanded(
                  flex: 1,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Title and Tagline Section
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          child: Column(
                            children: [
                              // Raahi Title
                              Text(
                                'Raahi',
                                style: TextStyle(
                                  fontFamily: 'Samarkan',
                                  fontSize: screenWidth * 0.25,
                                  color: RaahiColors.textPrimary,
                                  height: 1.1,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              
                              const SizedBox(height: 16),
                              
                              // Tagline
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'Butter to your ',
                                    style: TextStyle(
                                      fontFamily: 'Kite One',
                                      fontSize: screenWidth * 0.08,
                                      color: RaahiColors.tagline,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  Text(
                                    'जाम',
                                    style: TextStyle(
                                      fontFamily: 'Abhaya Libre',
                                      fontSize: screenWidth * 0.09,
                                      color: RaahiColors.tagline,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        
                        const SizedBox(height: 48),
                        
                        // Login Buttons
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 24),
                          child: LoginButtons(),
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Footer
                const Footer(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class LoginButtons extends StatelessWidget {
  const LoginButtons({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 400),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Truecaller and Google buttons
          Column(
            children: [
              const TruecallerLoginButton(),
              const SizedBox(height: 12),
              const GoogleLoginButton(),
            ],
          ),
          
          const SizedBox(height: 32),
          
          // Mobile OTP button
          const MobileOTPButton(),
        ],
      ),
    );
  }
}

class TruecallerLoginButton extends StatelessWidget {
  const TruecallerLoginButton({super.key});

  void _handleTruecallerLogin(BuildContext context) {
    /*
      🚀 FLUTTER API INTEGRATION - TRUECALLER LOGIN:
      
      1. Truecaller SDK Integration:
         - Add truecaller_sdk package to pubspec.yaml
         - Initialize SDK with API key in main.dart
         - Handle automatic phone number verification
         
      2. Backend API Calls:
         - API: POST /api/auth/truecaller-verify
         - Payload: { phone: string, truecaller_token: string }
         - Response: { access_token: string, user_id: string, is_new_user: boolean }
         
      3. Error Handling:
         - Network connectivity issues
         - Truecaller app not installed
         - User cancellation scenarios
         
      4. Security:
         - Validate Truecaller token on backend
         - Implement rate limiting for OTP requests
         - Store tokens securely using flutter_secure_storage
    */
    debugPrint("Truecaller login clicked");
    
    // Simulate successful login for demo
    Future.delayed(const Duration(seconds: 1), () {
      context.read<AppStateProvider>().login('truecaller');
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _handleTruecallerLogin(context),
      child: AnimatedScale(
        scale: 1.0,
        duration: const Duration(milliseconds: 100),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: RaahiColors.truecallerBackground,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Row(
            children: [
              // Truecaller icon placeholder
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.phone,
                  color: RaahiColors.truecallerBackground,
                  size: 24,
                ),
              ),
              
              const SizedBox(width: 16),
              
              Expanded(
                child: Text(
                  'Login Via OTP on truecaller',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class GoogleLoginButton extends StatelessWidget {
  const GoogleLoginButton({super.key});

  void _handleGoogleLogin(BuildContext context) {
    /*
      🚀 FLUTTER API INTEGRATION - GOOGLE LOGIN:
      
      1. Google Sign-In Setup:
         - Add google_sign_in package to pubspec.yaml
         - Configure OAuth 2.0 credentials in Google Console
         - Add SHA-1 fingerprints for Android
         - Set up iOS URL schemes
         
      2. Backend Integration:
         - API: POST /api/auth/google-verify
         - Payload: { id_token: string, access_token: string }
         - Response: { access_token: string, user_id: string, profile: object }
         
      3. User Profile Data:
         - Extract name, email, profile picture
         - Store user preferences and settings
         - Sync with backend user database
         
      4. Error Scenarios:
         - Google Play Services not available
         - Network connectivity issues
         - Account selection cancelled
         - Invalid credentials
    */
    debugPrint("Google login clicked");
    
    // Simulate successful login for demo
    Future.delayed(const Duration(seconds: 1), () {
      context.read<AppStateProvider>().login('google');
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _handleGoogleLogin(context),
      child: AnimatedScale(
        scale: 1.0,
        duration: const Duration(milliseconds: 100),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: RaahiColors.googleBackground,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: RaahiColors.googleBorder),
          ),
          child: Row(
            children: [
              // Google icon
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: const Icon(
                  Icons.g_mobiledata,
                  color: RaahiColors.info,
                  size: 32,
                ),
              ),
              
              const SizedBox(width: 16),
              
              Expanded(
                child: Text(
                  'Login with Google',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: const Color(0xFF2f2f2f),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class MobileOTPButton extends StatelessWidget {
  const MobileOTPButton({super.key});

  void _handleMobileOTPLogin(BuildContext context) {
    /*
      🚀 FLUTTER API INTEGRATION - MOBILE OTP LOGIN:
      
      1. Phone Number Input:
         - Use intl_phone_field package for country codes
         - Validate phone number format
         - API: POST /api/auth/send-otp
         - Payload: { phone: string, country_code: string }
         
      2. OTP Generation & Delivery:
         - Use SMS gateway (Twilio, AWS SNS, or local provider)
         - Generate 4-6 digit OTP with expiry (5 minutes)
         - Store OTP hash in Redis/database
         - Rate limiting: max 3 attempts per hour
         
      3. OTP Verification:
         - API: POST /api/auth/verify-otp
         - Payload: { phone: string, otp: string }
         - Response: { access_token: string, refresh_token: string }
         
      4. Session Management:
         - Store JWT tokens securely
         - Implement token refresh mechanism
         - Handle session expiry gracefully
         
      5. Error Handling:
         - Invalid phone number
         - OTP expired or incorrect
         - SMS delivery failures
         - Network connectivity issues
    */
    debugPrint("Mobile OTP login clicked");
    
    // Simulate successful login for demo
    Future.delayed(const Duration(seconds: 1), () {
      context.read<AppStateProvider>().login('mobile-otp');
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _handleMobileOTPLogin(context),
      child: AnimatedScale(
        scale: 1.0,
        duration: const Duration(milliseconds: 100),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: RaahiColors.googleBorder),
          ),
          child: Text(
            'Login with Mobile OTP',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: RaahiColors.textPrimary,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}

class Footer extends StatelessWidget {
  const Footer({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      child: Text(
        'Curated with love in Delhi, NCR 💛',
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: RaahiColors.gray,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}