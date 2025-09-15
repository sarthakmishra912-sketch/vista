import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state_provider.dart';
import '../utils/raahi_colors.dart';

class TermsScreen extends StatefulWidget {
  const TermsScreen({super.key});

  @override
  State<TermsScreen> createState() => _TermsScreenState();
}

class _TermsScreenState extends State<TermsScreen> {
  final ScrollController _scrollController = ScrollController();
  bool _hasScrolledToBottom = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_scrollListener);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_scrollListener);
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollListener() {
    if (_scrollController.position.pixels >= 
        _scrollController.position.maxScrollExtent - 100) {
      if (!_hasScrolledToBottom) {
        setState(() {
          _hasScrolledToBottom = true;
        });
      }
    }
  }

  void _handleAccept() {
    setState(() {
      _isLoading = true;
    });

    // Simulate processing time
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        context.read<AppStateProvider>().acceptTerms();
      }
    });
  }

  void _handleBack() {
    context.read<AppStateProvider>().navigateToScreen(AppScreen.otp);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RaahiColors.backgroundPrimary,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  IconButton(
                    onPressed: _handleBack,
                    icon: const Icon(
                      Icons.arrow_back_ios,
                      color: RaahiColors.textPrimary,
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      'Terms & Conditions',
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
            
            // Scrollable terms content
            Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 24),
                padding: const EdgeInsets.all(24),
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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title
                    Text(
                      'Welcome to Raahi!',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        color: RaahiColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    
                    const SizedBox(height: 8),
                    
                    Text(
                      'Please read and accept our terms to continue',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: RaahiColors.gray,
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Scrollable content
                    Expanded(
                      child: Scrollbar(
                        controller: _scrollController,
                        thumbVisibility: true,
                        child: SingleChildScrollView(
                          controller: _scrollController,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _buildSection(
                                'User Agreement',
                                'By using Raahi cab booking services, you agree to be bound by these terms and conditions. This agreement is effective immediately upon your acceptance.',
                              ),
                              
                              _buildSection(
                                'Service Description',
                                'Raahi provides a platform to connect passengers with independent drivers for transportation services. We facilitate bookings but do not provide transportation services directly.',
                              ),
                              
                              _buildSection(
                                'User Responsibilities',
                                '• Provide accurate information during registration\n'
                                '• Treat drivers and other users with respect\n'
                                '• Pay for services as agreed\n'
                                '• Follow local laws and regulations\n'
                                '• Not use the service for illegal activities',
                              ),
                              
                              _buildSection(
                                'Payment Terms',
                                'Payment is processed through secure gateways. Fare calculations include base fare, distance, time, and applicable taxes. Cancellation charges may apply based on timing.',
                              ),
                              
                              _buildSection(
                                'Privacy & Data',
                                'We collect and process personal data necessary for service provision including location data, contact information, and payment details. Your privacy is important to us.',
                              ),
                              
                              _buildSection(
                                'Safety Guidelines',
                                '• Verify driver details before entering vehicle\n'
                                '• Share trip details with trusted contacts\n'
                                '• Use in-app emergency features when needed\n'
                                '• Report any safety concerns immediately',
                              ),
                              
                              _buildSection(
                                'Limitation of Liability',
                                'Raahi acts as a platform connecting users with drivers. We are not liable for actions of drivers or incidents during trips. Users participate at their own risk.',
                              ),
                              
                              _buildSection(
                                'Account Termination',
                                'We reserve the right to suspend or terminate accounts for violations of terms, fraudulent activity, or misuse of the platform.',
                              ),
                              
                              _buildSection(
                                'Updates to Terms',
                                'These terms may be updated periodically. Continued use of the service constitutes acceptance of updated terms.',
                              ),
                              
                              _buildSection(
                                'Contact Information',
                                'For questions about these terms or our service, contact us at:\n\n'
                                'Email: support@raahi.com\n'
                                'Phone: +91 98765 43210\n'
                                'Address: Delhi, NCR',
                              ),
                              
                              const SizedBox(height: 32),
                              
                              // Last updated
                              Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: RaahiColors.lightGray,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  'Last updated: January 2024\n\n'
                                  'By clicking "Accept Terms", you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.',
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: RaahiColors.gray,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            // Bottom buttons
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Scroll indicator
                  if (!_hasScrolledToBottom)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: RaahiColors.tagline.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.scroll_outlined,
                            size: 16,
                            color: RaahiColors.tagline,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Please scroll to read all terms',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: RaahiColors.tagline,
                            ),
                          ),
                        ],
                      ),
                    ),
                  
                  if (!_hasScrolledToBottom) const SizedBox(height: 16),
                  
                  // Accept button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: (_hasScrolledToBottom && !_isLoading) ? _handleAccept : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _hasScrolledToBottom 
                            ? RaahiColors.buttonPrimary 
                            : RaahiColors.placeholderGray,
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
                              'Accept Terms & Continue',
                              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                                color: RaahiColors.white,
                              ),
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: RaahiColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: RaahiColors.textPrimary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}