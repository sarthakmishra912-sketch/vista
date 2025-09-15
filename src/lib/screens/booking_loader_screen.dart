import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state_provider.dart';
import '../providers/ride_provider.dart';
import '../utils/raahi_colors.dart';

class BookingLoaderScreen extends StatefulWidget {
  const BookingLoaderScreen({super.key});

  @override
  State<BookingLoaderScreen> createState() => _BookingLoaderScreenState();
}

class _BookingLoaderScreenState extends State<BookingLoaderScreen>
    with TickerProviderStateMixin {
  late AnimationController _searchController;
  late AnimationController _pulseController;
  late Animation<double> _searchAnimation;
  late Animation<double> _pulseAnimation;
  
  int _currentStepIndex = 0;
  final List<String> _searchSteps = [
    'Looking for drivers nearby...',
    'Finding the best match...',
    'Confirming driver availability...',
    'Driver found!'
  ];

  @override
  void initState() {
    super.initState();
    
    _searchController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    _pulseController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );
    
    _searchAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _searchController, curve: Curves.easeInOut),
    );
    
    _pulseAnimation = Tween<double>(begin: 1, end: 1.2).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
    
    _startSearchAnimation();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _startSearchAnimation() {
    _searchController.repeat();
    _pulseController.repeat(reverse: true);
    
    // Simulate search steps
    _simulateSearchSteps();
  }

  void _simulateSearchSteps() async {
    /*
      🚀 FLUTTER API INTEGRATION - DRIVER SEARCH:
      
      1. Location-Based Search:
         - API: POST /api/rides/search
         - Payload: { pickup_lat, pickup_lng, drop_lat, drop_lng, vehicle_type }
         - Response: { available_drivers: [], estimated_time: string }
         
      2. Real-time Driver Matching:
         - WebSocket: ws://your-api.com/ride-matching/{ride_id}
         - Live updates of driver acceptance/rejection
         - Automatic re-matching if driver cancels
         
      3. Driver Details:
         - API: GET /api/drivers/{driver_id}
         - Response: { name, photo, vehicle, rating, phone, location }
         
      4. Ride Confirmation:
         - API: POST /api/rides/confirm
         - Response: { ride_id, driver_id, otp, estimated_arrival }
    */
    
    for (int i = 0; i < _searchSteps.length; i++) {
      await Future.delayed(Duration(seconds: i == 0 ? 2 : 3));
      if (mounted) {
        setState(() {
          _currentStepIndex = i;
        });
        
        // On last step, simulate driver found
        if (i == _searchSteps.length - 1) {
          await Future.delayed(const Duration(seconds: 1));
          if (mounted) {
            _simulateDriverFound();
          }
        }
      }
    }
  }

  void _simulateDriverFound() {
    final driverData = {
      'id': 'driver_123',
      'name': 'SANTH',
      'phone': '+91 98765 43210',
      'vehicle': 'KA15AK00-0',
      'vehicleModel': 'White Suzuki S-Presso LXI',
      'rating': '4.9',
      'eta': '2 min',
      'photo': 'assets/images/driver_photo.jpg',
      'location': {'lat': 12.9716, 'lng': 77.5946},
    };
    
    context.read<AppStateProvider>().goToDriverTracking();
  }

  void _handleCancel() {
    context.read<AppStateProvider>().goBackToBooking();
  }

  @override
  Widget build(BuildContext context) {
    final rideProvider = context.watch<RideProvider>();
    final selectedVehicle = rideProvider.selectedVehicle;
    
    return Scaffold(
      backgroundColor: RaahiColors.backgroundPrimary,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              // Header
              Row(
                children: [
                  IconButton(
                    onPressed: _handleCancel,
                    icon: const Icon(
                      Icons.arrow_back_ios,
                      color: RaahiColors.textPrimary,
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      'Finding Your Ride',
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
              
              const SizedBox(height: 48),
              
              // Main animation area
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Animated search circles
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        // Outer pulse circles
                        AnimatedBuilder(
                          animation: _pulseAnimation,
                          builder: (context, child) {
                            return Container(
                              width: 200 * _pulseAnimation.value,
                              height: 200 * _pulseAnimation.value,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: RaahiColors.buttonPrimary.withOpacity(0.3),
                                  width: 2,
                                ),
                              ),
                            );
                          },
                        ),
                        
                        AnimatedBuilder(
                          animation: _pulseAnimation,
                          builder: (context, child) {
                            return Container(
                              width: 150 * _pulseAnimation.value,
                              height: 150 * _pulseAnimation.value,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: RaahiColors.buttonPrimary.withOpacity(0.5),
                                  width: 2,
                                ),
                              ),
                            );
                          },
                        ),
                        
                        // Center vehicle icon
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: RaahiColors.buttonPrimary,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: RaahiColors.buttonPrimary.withOpacity(0.3),
                                blurRadius: 20,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.directions_car,
                            color: RaahiColors.white,
                            size: 40,
                          ),
                        ),
                        
                        // Rotating search dots
                        AnimatedBuilder(
                          animation: _searchAnimation,
                          builder: (context, child) {
                            return transform.rotate(
                              angle: _searchAnimation.value * 2 * 3.14159,
                              child: SizedBox(
                                width: 120,
                                height: 120,
                                child: Stack(
                                  children: List.generate(8, (index) {
                                    final angle = (index * 2 * 3.14159) / 8;
                                    return transform.translate(
                                      offset: Offset(
                                        50 * math.cos(angle),
                                        50 * math.sin(angle),
                                      ),
                                      child: Container(
                                        width: 8,
                                        height: 8,
                                        decoration: BoxDecoration(
                                          color: RaahiColors.buttonPrimary.withOpacity(
                                            0.5 + 0.5 * math.sin(_searchAnimation.value * 2 * 3.14159 + angle),
                                          ),
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                    );
                                  }),
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 48),
                    
                    // Search status text
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 500),
                      child: Text(
                        _searchSteps[_currentStepIndex],
                        key: ValueKey(_currentStepIndex),
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: RaahiColors.textPrimary,
                          fontWeight: FontWeight.w500,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Progress indicator
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(_searchSteps.length, (index) {
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: index <= _currentStepIndex ? 24 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: index <= _currentStepIndex 
                                ? RaahiColors.buttonPrimary 
                                : RaahiColors.borderGray,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        );
                      }),
                    ),
                  ],
                ),
              ),
              
              // Ride details card
              Container(
                padding: const EdgeInsets.all(20),
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
                    // Selected vehicle
                    if (selectedVehicle != null) ...[
                      Row(
                        children: [
                          Container(
                            width: 50,
                            height: 30,
                            decoration: BoxDecoration(
                              color: RaahiColors.lightGray,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(
                              Icons.directions_car,
                              color: RaahiColors.gray,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  selectedVehicle.name,
                                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                    color: RaahiColors.textPrimary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  '${selectedVehicle.time} • ${selectedVehicle.price}',
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: RaahiColors.gray,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Divider
                      Container(
                        height: 1,
                        color: RaahiColors.borderGray,
                      ),
                      
                      const SizedBox(height: 16),
                    ],
                    
                    // Route details
                    Column(
                      children: [
                        // Pickup
                        Row(
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: const BoxDecoration(
                                color: RaahiColors.success,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                rideProvider.pickupLocation.isNotEmpty 
                                    ? rideProvider.pickupLocation 
                                    : 'Pickup location',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: RaahiColors.textPrimary,
                                ),
                              ),
                            ),
                          ],
                        ),
                        
                        const SizedBox(height: 12),
                        
                        // Drop
                        Row(
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                color: RaahiColors.error,
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                rideProvider.dropLocation.isNotEmpty 
                                    ? rideProvider.dropLocation 
                                    : 'Drop location',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: RaahiColors.textPrimary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Cancel button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: _handleCancel,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: RaahiColors.error,
                    side: const BorderSide(color: RaahiColors.error),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Cancel Search',
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                      color: RaahiColors.error,
                    ),
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

// Import for math functions
import 'dart:math' as math;