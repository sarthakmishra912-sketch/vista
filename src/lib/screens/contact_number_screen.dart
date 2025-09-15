import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:country_code_picker/country_code_picker.dart';
import '../providers/app_state_provider.dart';
import '../utils/raahi_colors.dart';

class ContactNumberScreen extends StatefulWidget {
  const ContactNumberScreen({super.key});

  @override
  State<ContactNumberScreen> createState() => _ContactNumberScreenState();
}

class _ContactNumberScreenState extends State<ContactNumberScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final FocusNode _phoneFocusNode = FocusNode();
  String _countryCode = '+91';
  bool _isLoading = false;
  String? _phoneError;

  @override
  void initState() {
    super.initState();
    // Auto-focus the phone input
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _phoneFocusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _phoneFocusNode.dispose();
    super.dispose();
  }

  bool _isValidPhone(String phone) {
    // Remove all non-digits
    final digitsOnly = phone.replaceAll(RegExp(r'\D'), '');
    
    // Indian phone numbers should be 10 digits
    if (_countryCode == '+91') {
      return digitsOnly.length == 10 && digitsOnly.startsWith(RegExp(r'[6-9]'));
    }
    
    // Basic validation for other countries (6-15 digits)
    return digitsOnly.length >= 6 && digitsOnly.length <= 15;
  }

  void _formatPhoneNumber(String value) {
    if (_countryCode == '+91') {
      // Format Indian numbers as: 98765 43210
      final digitsOnly = value.replaceAll(RegExp(r'\D'), '');
      String formatted = '';
      
      for (int i = 0; i < digitsOnly.length && i < 10; i++) {
        if (i == 5) formatted += ' ';
        formatted += digitsOnly[i];
      }
      
      if (formatted != _phoneController.text) {
        _phoneController.value = TextEditingValue(
          text: formatted,
          selection: TextSelection.collapsed(offset: formatted.length),
        );
      }
    }
  }

  void _handleSubmit() {
    final phoneNumber = _phoneController.text.trim();
    
    setState(() {
      _phoneError = null;
    });

    if (phoneNumber.isEmpty) {
      setState(() {
        _phoneError = 'Please enter your phone number';
      });
      return;
    }

    if (!_isValidPhone(phoneNumber)) {
      setState(() {
        _phoneError = 'Please enter a valid phone number';
      });
      return;
    }

    /*
      🚀 FLUTTER API INTEGRATION - PHONE SUBMISSION:
      
      1. Phone Number Validation:
         - Format validation based on country code
         - Check if number is already registered
         - API: POST /api/auth/validate-phone
         
      2. OTP Generation:
         - Generate secure OTP
         - Send via SMS gateway
         - API: POST /api/auth/send-otp
         - Store OTP with expiry in Redis/Database
         
      3. Rate Limiting:
         - Limit OTP requests per phone number
         - Implement CAPTCHA for suspicious activity
         - Block repeated invalid attempts
         
      4. Analytics:
         - Track phone number submissions
         - Monitor success/failure rates
         - Regional usage patterns
    */

    setState(() {
      _isLoading = true;
    });

    debugPrint("📱 Phone number submitted: $_countryCode $phoneNumber");

    // Simulate API call
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        
        final fullPhoneNumber = '$_countryCode ${phoneNumber.replaceAll(' ', '')}';
        context.read<AppStateProvider>().submitPhoneNumber(fullPhoneNumber);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    
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
                      context.read<AppStateProvider>().navigateToScreen(AppScreen.splash);
                    },
                    icon: const Icon(
                      Icons.arrow_back_ios,
                      color: RaahiColors.textPrimary,
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      'Enter Phone Number',
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
                      'What\'s your phone number?',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        color: RaahiColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 12),
                    
                    // Subtitle
                    Text(
                      'We\'ll send you a verification code to confirm your number',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: RaahiColors.gray,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 48),
                    
                    // Phone input container
                    Container(
                      decoration: BoxDecoration(
                        color: RaahiColors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Country code and phone input
                          Row(
                            children: [
                              // Country code picker
                              CountryCodePicker(
                                onChanged: (country) {
                                  setState(() {
                                    _countryCode = country.dialCode!;
                                  });
                                },
                                initialSelection: 'IN',
                                favorite: const ['+91', 'IN'],
                                showCountryOnly: false,
                                showOnlyCountryWhenClosed: false,
                                alignLeft: false,
                                textStyle: const TextStyle(
                                  color: RaahiColors.textPrimary,
                                  fontSize: 16,
                                ),
                                dialogTextStyle: const TextStyle(
                                  color: RaahiColors.textPrimary,
                                ),
                                searchStyle: const TextStyle(
                                  color: RaahiColors.textPrimary,
                                ),
                                flagDecoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                              
                              // Vertical divider
                              Container(
                                height: 40,
                                width: 1,
                                color: RaahiColors.borderGray,
                              ),
                              
                              // Phone number input
                              Expanded(
                                child: TextField(
                                  controller: _phoneController,
                                  focusNode: _phoneFocusNode,
                                  keyboardType: TextInputType.phone,
                                  inputFormatters: [
                                    FilteringTextInputFormatter.allow(
                                      RegExp(r'[\d\s]'),
                                    ),
                                    LengthLimitingTextInputFormatter(12),
                                  ],
                                  onChanged: _formatPhoneNumber,
                                  onSubmitted: (_) => _handleSubmit(),
                                  style: const TextStyle(
                                    fontSize: 16,
                                    color: RaahiColors.textPrimary,
                                  ),
                                  decoration: const InputDecoration(
                                    hintText: '98765 43210',
                                    hintStyle: TextStyle(
                                      color: RaahiColors.placeholderGray,
                                    ),
                                    border: InputBorder.none,
                                    contentPadding: EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 20,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          
                          // Error message
                          if (_phoneError != null)
                            Container(
                              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                              child: Text(
                                _phoneError!,
                                style: const TextStyle(
                                  color: RaahiColors.error,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Continue button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _handleSubmit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: RaahiColors.buttonPrimary,
                          foregroundColor: RaahiColors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    RaahiColors.white,
                                  ),
                                ),
                              )
                            : Text(
                                'Continue',
                                style: Theme.of(context).textTheme.labelLarge?.copyWith(
                                  color: RaahiColors.white,
                                ),
                              ),
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