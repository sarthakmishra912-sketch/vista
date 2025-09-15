import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import '../providers/app_state_provider.dart';
import '../utils/raahi_colors.dart';

class OTPVerificationScreen extends StatefulWidget {
  const OTPVerificationScreen({super.key});

  @override
  State<OTPVerificationScreen> createState() => _OTPVerificationScreenState();
}

class _OTPVerificationScreenState extends State<OTPVerificationScreen>
    with TickerProviderStateMixin {
  final TextEditingController _otpController = TextEditingController();
  bool _isLoading = false;
  bool _canResend = false;
  int _resendTimer = 30;
  String? _otpError;
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _startResendTimer();
  }

  @override
  void dispose() {
    _otpController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _startResendTimer() {
    setState(() {
      _canResend = false;
      _resendTimer = 30;
    });

    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) {
        setState(() {
          _resendTimer--;
        });
        
        if (_resendTimer <= 0) {
          setState(() {
            _canResend = true;
          });
          return false;
        }
        return true;
      }
      return false;
    });
  }

  void _handleOTPVerify(String otp) {
    if (otp.length != 4) return;

    setState(() {
      _isLoading = true;
      _otpError = null;
    });

    /*
      🚀 FLUTTER API INTEGRATION - OTP VERIFICATION:
      
      1. OTP Validation:
         - API: POST /api/auth/verify-otp
         - Payload: { phone: string, otp: string }
         - Response: { valid: boolean, access_token?: string, expires_in: number }
         
      2. Security Measures:
         - Rate limiting: max 3 attempts per OTP
         - OTP expiry validation (5 minutes)
         - Hash comparison for security
         - Blacklist repeated invalid attempts
         
      3. Success Handling:
         - Generate JWT access token
         - Store user session securely
         - Update user last_login timestamp
         - Trigger user preference loading
         
      4. Error Scenarios:
         - Invalid OTP code
         - Expired OTP
         - Too many attempts
         - Network connectivity issues
         
      5. Analytics:
         - Track verification success rates
         - Monitor OTP delivery times
         - Failed attempt patterns
    */

    debugPrint("🔢 Verifying OTP: $otp");

    // Simulate API call
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });

        // Simulate OTP validation (in real app, this would be server-side)
        if (otp == '1234' || otp == '0000') {  // Demo valid OTPs
          debugPrint("✅ OTP verified successfully");
          context.read<AppStateProvider>().verifyOTP(otp);
        } else {
          setState(() {
            _otpError = 'Invalid OTP. Please try again.';
          });
          _animationController.forward().then((_) {
            _animationController.reverse();
          });
          
          // Clear OTP field
          _otpController.clear();
          
          // Vibrate for error feedback
          HapticFeedback.lightImpact();
        }
      }
    });
  }

  void _handleResendOTP() {
    if (!_canResend) return;

    /*
      🚀 FLUTTER API INTEGRATION - RESEND OTP:
      
      1. Rate Limiting Check:
         - Verify user hasn't exceeded resend limits
         - API: POST /api/auth/can-resend-otp
         - Block suspicious resend patterns
         
      2. Generate New OTP:
         - Invalidate previous OTP
         - Generate new secure 4-6 digit code
         - Update expiry timestamp
         - API: POST /api/auth/resend-otp
         
      3. SMS Delivery:
         - Use SMS gateway for delivery
         - Handle different country SMS formats
         - Retry mechanism for failed deliveries
         - Track delivery status
         
      4. User Feedback:
         - Show resend confirmation
         - Reset timer for next resend
         - Update UI accordingly
    */

    debugPrint("📨 Resending OTP to phone number");
    
    // Reset timer and clear any errors
    _startResendTimer();
    setState(() {
      _otpError = null;
    });
    
    // Show success feedback
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('OTP sent successfully'),
        backgroundColor: RaahiColors.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppStateProvider>();
    
    return Scaffold(
      backgroundColor: RaahiColors.backgroundPrimary,
      body: SafeArea(
        child: Column(
          children: [
            // Header with back button
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () {
                      context.read<AppStateProvider>().navigateToScreen(AppScreen.contact);
                    },
                    icon: const Icon(
                      Icons.arrow_back_ios,
                      color: RaahiColors.textPrimary,
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      'Verify Phone Number',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: RaahiColors.textPrimary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(width: 48), // Balance the back button
                ],
              ),
            ),
            
            // Main content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Title
                    Text(
                      'Enter verification code',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        color: RaahiColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 12),
                    
                    // Subtitle with phone number
                    RichText(
                      textAlign: TextAlign.center,
                      text: TextSpan(
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: RaahiColors.gray,
                        ),
                        children: [
                          const TextSpan(text: 'We sent a 4-digit code to '),
                          TextSpan(
                            text: appState.userPhoneNumber ?? '+91 98765 43210',
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: RaahiColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 48),
                    
                    // OTP Input
                    AnimatedBuilder(
                      animation: _animationController,
                      builder: (context, child) {
                        return Transform.translate(
                          offset: Offset(_animationController.value * 10 * 
                              ((_animationController.value * 4).round() % 2 == 0 ? 1 : -1), 0),
                          child: PinCodeTextField(
                            appContext: context,
                            length: 4,
                            controller: _otpController,
                            keyboardType: TextInputType.number,
                            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                            pinTheme: PinTheme(
                              shape: PinCodeFieldShape.box,
                              borderRadius: BorderRadius.circular(12),
                              fieldHeight: 64,
                              fieldWidth: 56,
                              activeFillColor: RaahiColors.white,
                              inactiveFillColor: RaahiColors.white,
                              selectedFillColor: RaahiColors.white,
                              activeColor: RaahiColors.buttonPrimary,
                              inactiveColor: RaahiColors.borderGray,
                              selectedColor: RaahiColors.buttonPrimary,
                              borderWidth: 2,
                            ),
                            enableActiveFill: true,
                            onCompleted: _handleOTPVerify,
                            onChanged: (value) {
                              if (_otpError != null) {
                                setState(() {
                                  _otpError = null;
                                });
                              }
                            },
                            textStyle: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w600,
                              color: RaahiColors.textPrimary,
                            ),
                            cursorColor: RaahiColors.buttonPrimary,
                            animationType: AnimationType.fade,
                            animationDuration: const Duration(milliseconds: 300),
                          ),
                        );
                      },
                    ),
                    
                    // Error message
                    if (_otpError != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 16),
                        child: Text(
                          _otpError!,
                          style: const TextStyle(
                            color: RaahiColors.error,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    
                    const SizedBox(height: 32),
                    
                    // Resend OTP section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Didn\'t receive the code? ',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: RaahiColors.gray,
                          ),
                        ),
                        if (_canResend)
                          GestureDetector(
                            onTap: _handleResendOTP,
                            child: Text(
                              'Resend',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: RaahiColors.buttonPrimary,
                                fontWeight: FontWeight.w600,
                                decoration: TextDecoration.underline,
                                decorationColor: RaahiColors.buttonPrimary,
                              ),
                            ),
                          )
                        else
                          Text(
                            'Resend in ${_resendTimer}s',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: RaahiColors.placeholderGray,
                            ),
                          ),
                      ],
                    ),
                    
                    const SizedBox(height: 48),
                    
                    // Loading indicator
                    if (_isLoading)
                      const CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(
                          RaahiColors.buttonPrimary,
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}