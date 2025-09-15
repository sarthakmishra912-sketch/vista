import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state_provider.dart';
import '../utils/raahi_colors.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    
    return Scaffold(
      backgroundColor: RaahiColors.backgroundPrimary,
      body: SafeArea(
        child: Column(
          children: [
            // Main content area
            Expanded(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
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
                      
                      const SizedBox(height: 64),
                      
                      // Find a Trip Button
                      Container(
                        width: double.infinity,
                        constraints: const BoxConstraints(maxWidth: 320),
                        child: ElevatedButton(
                          onPressed: () {
                            /*
                              🚀 FLUTTER API INTEGRATION - FIND RIDE:
                              
                              1. Location Services:
                                 - Check location permissions
                                 - Get current user location
                                 - API: GET /api/location/current
                                 
                              2. Nearby Drivers:
                                 - Fetch available drivers nearby
                                 - API: GET /api/drivers/nearby?lat={lat}&lng={lng}
                                 - Real-time driver location updates
                                 
                              3. Ride Estimation:
                                 - Calculate estimated fare and time
                                 - API: POST /api/rides/estimate
                                 - Show pricing for different vehicle types
                                 
                              4. User Preferences:
                                 - Load saved locations (home, work)
                                 - Recent ride history
                                 - Preferred vehicle types
                            */
                            debugPrint("🚗 Find ride clicked");
                            context.read<AppStateProvider>().navigateToScreen(AppScreen.booking);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: RaahiColors.buttonPrimary,
                            foregroundColor: RaahiColors.white,
                            padding: const EdgeInsets.symmetric(vertical: 20),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                            elevation: 8,
                            shadowColor: Colors.black.withOpacity(0.3),
                          ),
                          child: Text(
                            'Find a Trip',
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              color: RaahiColors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            
            // Footer
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Text(
                'Curated with love in Delhi, NCR 💛',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: RaahiColors.gray,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }
}