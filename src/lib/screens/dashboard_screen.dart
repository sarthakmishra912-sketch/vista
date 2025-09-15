import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state_provider.dart';
import '../constants.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Background
          Container(
            width: double.infinity,
            height: double.infinity,
            color: AppColors.background,
          ),
          
          // Decorative Background Pattern (flower)
          Positioned(
            top: -200,
            left: screenWidth * 0.5 - 150,
            child: Transform.rotate(
              angle: 0.34, // 19.466 degrees in radians
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  color: AppColors.tagline.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(150),
                ),
              ),
            ),
          ),
          
          // Status Bar Notch
          Positioned(
            top: 33.35,
            left: screenWidth * 0.5 - 134.32,
            child: Container(
              width: 268.645,
              height: 51.836,
              decoration: BoxDecoration(
                color: AppColors.brandDark,
                borderRadius: BorderRadius.circular(34.257),
              ),
            ),
          ),
          
          // Status Bar
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 58,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 6.974),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Time
                  const Text(
                    '12:30',
                    style: TextStyle(
                      fontSize: 24.41,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF170E2B),
                      letterSpacing: 0.0244,
                    ),
                  ),
                  
                  // Battery and Signal Icons
                  SizedBox(
                    width: 122.054,
                    height: 20.924,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        // Signal bars
                        Container(
                          width: 15,
                          height: 10,
                          decoration: BoxDecoration(
                            color: const Color(0xFF170E2B),
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(width: 4),
                        Container(
                          width: 15,
                          height: 15,
                          decoration: BoxDecoration(
                            color: const Color(0xFF170E2B),
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(width: 8),
                        // Battery icon
                        Container(
                          width: 30.96,
                          height: 13.54,
                          decoration: BoxDecoration(
                            color: const Color(0xFF170E2B),
                            borderRadius: BorderRadius.circular(2.32),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // User Account Button
          Positioned(
            top: 124,
            left: screenWidth * 0.5 - 222.5,
            child: Consumer<AppStateProvider>(
              builder: (context, appState, child) {
                return GestureDetector(
                  onTap: () => appState.navigateToScreen(AppScreen.login),
                  child: Container(
                    width: screenWidth > 445 ? 445 : screenWidth - 40,
                    height: 69.46,
                    decoration: BoxDecoration(
                      color: AppColors.profileBackground,
                      borderRadius: BorderRadius.circular(81.947),
                      border: Border.all(
                        color: AppColors.profileBorder,
                        width: 0.78,
                      ),
                    ),
                    child: Row(
                      children: [
                        const SizedBox(width: 11.93),
                        // Profile Picture
                        Container(
                          width: 52.493,
                          height: 52.493,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.profileBorder,
                          ),
                          child: const Icon(
                            Icons.person,
                            color: Colors.white,
                            size: 30,
                          ),
                        ),
                        const SizedBox(width: 23.861),
                        // Email
                        Expanded(
                          child: Text(
                            appState.userEmail ?? 'Dhruvsiwach@gmail.com',
                            style: AppTextStyles.profileEmailText.copyWith(
                              fontSize: 20.777,
                            ),
                          ),
                        ),
                        // Arrow Icon
                        Container(
                          width: 26.234,
                          height: 14.313,
                          child: transform.rotate(
                            angle: 1.5708, // 90 degrees
                            child: const Icon(
                              Icons.arrow_back_ios,
                              color: AppColors.profileBorder,
                              size: 14.316,
                            ),
                          ),
                        ),
                        const SizedBox(width: 35.791),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          
          // Raahi Branding
          Positioned(
            bottom: 513,
            left: screenWidth * 0.5 - 278.5 + 1.436,
            child: SizedBox(
              width: 557,
              child: Column(
                children: [
                  // Main brand text container
                  SizedBox(
                    width: 426,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        // Raahi title
                        Container(
                          height: 175.725,
                          alignment: Alignment.center,
                          child: Text(
                            'Raahi',
                            style: AppTextStyles.getBrandTextStyle(context).copyWith(
                              fontSize: 159.316,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                        
                        // Tagline
                        SizedBox(
                          width: 426,
                          child: RichText(
                            textAlign: TextAlign.center,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: 'Butter to your',
                                  style: AppTextStyles.getTaglineTextStyle(context).copyWith(
                                    fontSize: 50.659,
                                  ),
                                ),
                                TextSpan(
                                  text: ' ',
                                  style: AppTextStyles.getTaglineTextStyle(context).copyWith(
                                    fontSize: 50.659,
                                    letterSpacing: -3.5461,
                                  ),
                                ),
                                TextSpan(
                                  text: ' ',
                                  style: AppTextStyles.getDevanagariTextStyle(context).copyWith(
                                    fontSize: 56.8,
                                    letterSpacing: -3.976,
                                  ),
                                ),
                                TextSpan(
                                  text: 'जाम',
                                  style: AppTextStyles.getDevanagariTextStyle(context).copyWith(
                                    fontSize: 56.8,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Action Buttons
          Positioned(
            bottom: 242.05,
            left: screenWidth * 0.5 - (screenWidth > 585 ? 292.5 : (screenWidth - 40) / 2),
            child: SizedBox(
              width: screenWidth > 585 ? 585 : screenWidth - 40,
              height: 402,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Find a Ride Now Button
                  Consumer<AppStateProvider>(
                    builder: (context, appState, child) {
                      return GestureDetector(
                        onTap: () => appState.handleFindRide(),
                        child: Container(
                          height: 123,
                          decoration: BoxDecoration(
                            color: AppColors.primaryButton,
                            borderRadius: BorderRadius.circular(40),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Find a Ride Now!',
                                style: AppTextStyles.actionButtonText.copyWith(
                                  fontSize: 31.578,
                                ),
                              ),
                              const SizedBox(width: 115),
                              Transform.rotate(
                                angle: 1.5708, // 90 degrees
                                child: const Icon(
                                  Icons.arrow_forward,
                                  color: Colors.white,
                                  size: 28.984,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  
                  // Open Drivers' App Button
                  Consumer<AppStateProvider>(
                    builder: (context, appState, child) {
                      return GestureDetector(
                        onTap: () => appState.showMessage('Drivers\' App feature will be available soon'),
                        child: Container(
                          height: 108,
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF8E3),
                            borderRadius: BorderRadius.circular(40),
                            border: Border.all(
                              color: AppColors.profileBorder,
                              width: 1,
                            ),
                          ),
                          child: const Center(
                            child: Text(
                              'Open Drivers\' App',
                              style: TextStyle(
                                fontFamily: AppFonts.poppins,
                                fontWeight: FontWeight.w500,
                                fontSize: 29.755,
                                color: AppColors.primaryText,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          
          // Switch Account Link
          Positioned(
            bottom: 204,
            left: 225.62,
            child: Consumer<AppStateProvider>(
              builder: (context, appState, child) {
                return GestureDetector(
                  onTap: () => appState.navigateToScreen(AppScreen.login),
                  child: const Text(
                    'Switch Account?',
                    style: AppTextStyles.switchAccountText,
                  ),
                );
              },
            ),
          ),
          
          // Footer Text
          Positioned(
            bottom: 88,
            left: screenWidth * 0.5 - 213 - 0.064,
            child: SizedBox(
              width: 426,
              child: RichText(
                textAlign: TextAlign.center,
                text: const TextSpan(
                  children: [
                    TextSpan(
                      text: 'Curated ',
                      style: TextStyle(
                        fontFamily: AppFonts.poppins,
                        fontWeight: FontWeight.w300,
                        fontSize: 25.782,
                        color: AppColors.secondaryText,
                      ),
                    ),
                    TextSpan(
                      text: 'with ',
                      style: TextStyle(
                        fontFamily: AppFonts.poppins,
                        fontWeight: FontWeight.w300,
                        fontSize: 25.782,
                        color: AppColors.secondaryText,
                      ),
                    ),
                    TextSpan(
                      text: 'love in Delhi, NCR ',
                      style: TextStyle(
                        fontFamily: AppFonts.poppins,
                        fontWeight: FontWeight.w300,
                        fontSize: 25.782,
                        color: AppColors.secondaryText,
                      ),
                    ),
                    TextSpan(
                      text: '💛',
                      style: TextStyle(
                        fontSize: 20,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}