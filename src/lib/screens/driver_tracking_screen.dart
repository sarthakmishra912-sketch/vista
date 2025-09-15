import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/app_state_provider.dart';
import '../utils/raahi_colors.dart';

class DriverData {
  final String id;
  final String name;
  final String phone;
  final String vehicle;
  final String vehicleModel;
  final String rating;
  final String eta;
  final String photo;
  final Map<String, double> location;

  DriverData({
    required this.id,
    required this.name,
    required this.phone,
    required this.vehicle,
    required this.vehicleModel,
    required this.rating,
    required this.eta,
    required this.photo,
    required this.location,
  });
}

class DriverTrackingScreen extends StatefulWidget {
  const DriverTrackingScreen({super.key});

  @override
  State<DriverTrackingScreen> createState() => _DriverTrackingScreenState();
}

class _DriverTrackingScreenState extends State<DriverTrackingScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _carController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _carAnimation;
  
  // Demo driver data - in real app this would come from API
  final DriverData _driver = DriverData(
    id: 'driver_123',
    name: 'SANTH',
    phone: '+91 98765 43210',
    vehicle: 'KA15AK00-0',
    vehicleModel: 'White Suzuki S-Presso LXI',
    rating: '4.9',
    eta: '2 min',
    photo: 'assets/images/driver_photo.jpg',
    location: {'lat': 12.9716, 'lng': 77.5946},
  );

  final String _otp = '2323';
  bool _isDriverArrived = false;
  bool _isTripStarted = false;
  bool _showCallOptions = false;

  @override
  void initState() {
    super.initState();
    
    _pulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    _carController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    );
    
    _pulseAnimation = Tween<double>(begin: 1, end: 1.3).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
    
    _carAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _carController, curve: Curves.easeInOut),
    );
    
    _startAnimations();
    _simulateDriverJourney();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _carController.dispose();
    super.dispose();
  }

  void _startAnimations() {
    _pulseController.repeat(reverse: true);
    _carController.repeat();
  }

  void _simulateDriverJourney() async {
    /*
      🚀 FLUTTER API INTEGRATION - REAL-TIME TRACKING:
      
      1. WebSocket Connection:
         - WebSocket: ws://your-api.com/rides/{ride_id}/track
         - Real-time driver location updates
         - ETA calculations and traffic updates
         - Trip status changes (approaching, arrived, started, completed)
         
      2. Location Services:
         - API: GET /api/rides/{ride_id}/driver-location
         - Response: { lat, lng, bearing, speed, eta_minutes }
         - Update frequency: every 5-10 seconds
         
      3. Trip States:
         - DRIVER_ASSIGNED → DRIVER_APPROACHING → DRIVER_ARRIVED → TRIP_STARTED → TRIP_COMPLETED
         - Push notifications for each state change
         - Automatic state transitions based on location
         
      4. Communication Features:
         - In-app calling via SDK (Twilio, Agora)
         - SMS integration for OTP sharing
         - Emergency contact features
         
      5. Real-time Features:
         - Live map with driver movement
         - Route optimization and traffic updates
         - Geofencing for pickup/drop zones
         - Battery optimization for location tracking
    */
    
    // Simulate driver approaching
    await Future.delayed(const Duration(seconds: 5));
    if (mounted) {
      debugPrint("🚗 Driver is approaching...");
    }
    
    // Simulate driver arrived
    await Future.delayed(const Duration(seconds: 8));
    if (mounted) {
      setState(() {
        _isDriverArrived = true;
      });
      
      // Show arrival notification
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${_driver.name} has arrived at pickup location'),
          backgroundColor: RaahiColors.success,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          action: SnackBarAction(
            label: 'OK',
            textColor: RaahiColors.white,
            onPressed: () {
              ScaffoldMessenger.of(context).hideCurrentSnackBar();
            },
          ),
        ),
      );
      
      debugPrint("📍 Driver arrived at pickup location");
    }
  }

  void _handleCall() {
    setState(() {
      _showCallOptions = !_showCallOptions;
    });
    
    if (_showCallOptions) {
      HapticFeedback.lightImpact();
    }
  }

  void _makeCall(String type) {
    /*
      🚀 FLUTTER API INTEGRATION - COMMUNICATION:
      
      1. Voice Calling:
         - Use url_launcher package for direct calls
         - Or implement VoIP calling with Agora/Twilio
         - API: POST /api/rides/{ride_id}/call-driver
         - Track call duration and quality
         
      2. Masked Numbers:
         - Use proxy numbers to protect privacy
         - API: GET /api/rides/{ride_id}/call-proxy
         - Both rider and driver get masked numbers
         
      3. In-App Messaging:
         - Quick messages: "On my way", "Waiting outside"
         - API: POST /api/rides/{ride_id}/message
         - Push notification for new messages
    */
    
    setState(() {
      _showCallOptions = false;
    });
    
    if (type == 'direct') {
      debugPrint("📞 Calling driver directly: ${_driver.phone}");
      // TODO: Implement direct call using url_launcher
      // await launchUrl(Uri.parse('tel:${_driver.phone}'));
    } else {
      debugPrint("🔒 Calling driver via masked number");
      // TODO: Implement masked calling via API
    }
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Calling ${_driver.name}...'),
        duration: const Duration(seconds: 2),
        backgroundColor: RaahiColors.info,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  void _startTrip() {
    setState(() {
      _isTripStarted = true;
    });
    
    debugPrint("🛣️ Trip started - OTP verified: $_otp");
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Trip Started! Enjoy your ride'),
        backgroundColor: RaahiColors.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  void _completeTrip() {
    context.read<AppStateProvider>().completeTripAndGoToBooking();
  }

  void _cancelTrip() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Cancel Trip'),
          content: const Text('Are you sure you want to cancel this trip?'),
          backgroundColor: RaahiColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Keep Trip',
                style: TextStyle(color: RaahiColors.gray),
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<AppStateProvider>().cancelTripAndGoToBooking();
              },
              child: Text(
                'Cancel Trip',
                style: TextStyle(color: RaahiColors.error),
              ),
            ),
          ],
        );
      },
    );
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
                    onPressed: _cancelTrip,
                    icon: const Icon(
                      Icons.arrow_back_ios,
                      color: RaahiColors.textPrimary,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      _isTripStarted ? 'Trip in Progress' : 
                      _isDriverArrived ? 'Driver Arrived' : 'Driver Coming',
                      style: const TextStyle(
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
            
            // Map area (placeholder)
            Expanded(
              flex: 2,
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 24),
                decoration: BoxDecoration(
                  color: RaahiColors.lightGray,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    // Map placeholder
                    Container(
                      width: double.infinity,
                      height: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            RaahiColors.lightGray,
                            RaahiColors.borderGray,
                          ],
                        ),
                      ),
                      child: const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.map_outlined,
                              size: 48,
                              color: RaahiColors.gray,
                            ),
                            SizedBox(height: 8),
                            Text(
                              'Live Map Integration',
                              style: TextStyle(
                                color: RaahiColors.gray,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              '(Google Maps / MapBox)',
                              style: TextStyle(
                                color: RaahiColors.placeholderGray,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    // Animated driver car
                    AnimatedBuilder(
                      animation: _carAnimation,
                      builder: (context, child) {
                        // Simulate car movement along a path
                        final progress = _carAnimation.value;
                        final x = 50 + (200 * progress);
                        final y = 100 + (50 * math.sin(progress * math.pi));
                        
                        return Positioned(
                          left: x,
                          top: y,
                          child: AnimatedBuilder(
                            animation: _pulseAnimation,
                            builder: (context, child) {
                              return Transform.scale(
                                scale: _pulseAnimation.value,
                                child: Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: RaahiColors.buttonPrimary,
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(
                                        color: RaahiColors.buttonPrimary.withOpacity(0.3),
                                        blurRadius: 10,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: const Icon(
                                    Icons.directions_car,
                                    color: RaahiColors.white,
                                    size: 20,
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),
                    
                    // ETA badge
                    Positioned(
                      top: 16,
                      left: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: RaahiColors.buttonPrimary,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.access_time,
                              color: RaahiColors.white,
                              size: 16,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              _driver.eta,
                              style: const TextStyle(
                                color: RaahiColors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Driver details card
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
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
                children: [
                  // Driver info
                  Row(
                    children: [
                      // Driver photo
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: RaahiColors.lightGray,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: RaahiColors.success,
                            width: 3,
                          ),
                        ),
                        child: const Icon(
                          Icons.person,
                          color: RaahiColors.gray,
                          size: 30,
                        ),
                      ),
                      
                      const SizedBox(width: 16),
                      
                      // Driver details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  _driver.name,
                                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                    color: RaahiColors.textPrimary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const Spacer(),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: RaahiColors.success.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(
                                        Icons.star,
                                        color: RaahiColors.warning,
                                        size: 16,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        _driver.rating,
                                        style: const TextStyle(
                                          color: RaahiColors.textPrimary,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _driver.vehicle,
                              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: RaahiColors.textPrimary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              _driver.vehicleModel,
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: RaahiColors.gray,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 20),
                  
                  // Action buttons
                  Row(
                    children: [
                      // Call button
                      Expanded(
                        child: Stack(
                          children: [
                            OutlinedButton.icon(
                              onPressed: _handleCall,
                              icon: const Icon(Icons.phone),
                              label: const Text('Call'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: RaahiColors.buttonPrimary,
                                side: const BorderSide(color: RaahiColors.buttonPrimary),
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                            
                            // Call options popup
                            if (_showCallOptions)
                              Positioned(
                                bottom: 60,
                                left: 0,
                                right: 0,
                                child: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: RaahiColors.white,
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.2),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      InkWell(
                                        onTap: () => _makeCall('direct'),
                                        child: const Padding(
                                          padding: EdgeInsets.symmetric(vertical: 8),
                                          child: Row(
                                            children: [
                                              Icon(Icons.phone_direct, size: 20),
                                              SizedBox(width: 12),
                                              Text('Call Direct'),
                                            ],
                                          ),
                                        ),
                                      ),
                                      const Divider(height: 1),
                                      InkWell(
                                        onTap: () => _makeCall('masked'),
                                        child: const Padding(
                                          padding: EdgeInsets.symmetric(vertical: 8),
                                          child: row(
                                            children: [
                                              Icon(Icons.security, size: 20),
                                              SizedBox(width: 12),
                                              Text('Call (Secure)'),
                                            ],
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
                      
                      const SizedBox(width: 12),
                      
                      // Message button
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            debugPrint("💬 Opening chat with driver");
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: const Text('Chat feature coming soon'),
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                            );
                          },
                          icon: const Icon(Icons.message),
                          label: const Text('Message'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: RaahiColors.gray,
                            side: const BorderSide(color: RaahiColors.borderGray),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  // OTP section (only show when driver arrived and trip not started)
                  if (_isDriverArrived && !_isTripStarted) ...[
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: RaahiColors.lightGray,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Share this OTP with your driver',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: RaahiColors.gray,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: _otp.split('').map((digit) {
                              return Container(
                                margin: const EdgeInsets.symmetric(horizontal: 8),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: RaahiColors.buttonPrimary,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  digit,
                                  style: const TextStyle(
                                    color: RaahiColors.white,
                                    fontSize: 20,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: _startTrip,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: RaahiColors.success,
                              foregroundColor: RaahiColors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text('Start Trip'),
                          ),
                        ],
                      ),
                    ),
                  ],
                  
                  // Trip completion button (only show when trip started)
                  if (_isTripStarted) ...[
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _completeTrip,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: RaahiColors.success,
                          foregroundColor: RaahiColors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Complete Trip',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

// Import for math functions
import 'dart:math' as math;