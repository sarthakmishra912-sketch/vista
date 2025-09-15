import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/app_state_provider.dart';
import '../providers/ride_provider.dart';
import '../utils/raahi_colors.dart';

class RideBookingScreen extends StatefulWidget {
  const RideBookingScreen({super.key});

  @override
  State<RideBookingScreen> createState() => _RideBookingScreenState();
}

class _RideBookingScreenState extends State<RideBookingScreen>
    with TickerProviderStateMixin {
  final TextEditingController _pickupController = TextEditingController();
  final TextEditingController _dropController = TextEditingController();
  final FocusNode _pickupFocusNode = FocusNode();
  final FocusNode _dropFocusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    
    // Pre-fill some demo data
    _pickupController.text = 'Kaikondrahalli, Bengaluru, Karnataka';
    _dropController.text = 'Whitefield, Bengaluru, Karnataka';
    
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final rideProvider = context.read<RideProvider>();
      rideProvider.setPickupLocation(_pickupController.text);
      rideProvider.setDropLocation(_dropController.text);
      rideProvider.selectVehicle('raahi-mini'); // Select first vehicle by default
    });
  }

  @override
  void dispose() {
    _pickupController.dispose();
    _dropController.dispose();
    _pickupFocusNode.dispose();
    _dropFocusNode.dispose();
    super.dispose();
  }

  void _handleRideBook() {
    final rideProvider = context.read<RideProvider>();
    final appStateProvider = context.read<AppStateProvider>();
    
    if (rideProvider.canBookRide) {
      final bookingData = rideProvider.getRideBookingData();
      
      debugPrint("🚗 Booking ride with data: $bookingData");
      
      // Store booking data and navigate to booking loader
      appStateProvider.setBookingData(bookingData);
      appStateProvider.goToBookingLoader();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RaahiColors.backgroundPrimary,
      body: SafeArea(
        child: Column(
          children: [
            // Header with logout
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const SizedBox(width: 48), // Balance the logout button
                  Text(
                    'Book Your Ride',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: RaahiColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      context.read<AppStateProvider>().logout();
                    },
                    icon: const Icon(
                      Icons.logout,
                      color: RaahiColors.gray,
                    ),
                  ),
                ],
              ),
            ),
            
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Location inputs
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
                        children: [
                          // Pickup location
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                Container(
                                  width: 12,
                                  height: 12,
                                  decoration: const BoxDecoration(
                                    color: RaahiColors.success,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: TextField(
                                    controller: _pickupController,
                                    focusNode: _pickupFocusNode,
                                    onChanged: (value) {
                                      context.read<RideProvider>().setPickupLocation(value);
                                    },
                                    style: const TextStyle(
                                      fontSize: 16,
                                      color: RaahiColors.textPrimary,
                                    ),
                                    decoration: const InputDecoration(
                                      hintText: 'Enter pickup location',
                                      hintStyle: TextStyle(
                                        color: RaahiColors.placeholderGray,
                                      ),
                                      border: InputBorder.none,
                                      contentPadding: EdgeInsets.zero,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          
                          // Divider
                          Container(
                            height: 1,
                            margin: const EdgeInsets.only(left: 44),
                            color: RaahiColors.borderGray,
                          ),
                          
                          // Drop location
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                Container(
                                  width: 12,
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: RaahiColors.error,
                                    borderRadius: BorderRadius.circular(2),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: TextField(
                                    controller: _dropController,
                                    focusNode: _dropFocusNode,
                                    onChanged: (value) {
                                      context.read<RideProvider>().setDropLocation(value);
                                    },
                                    style: const TextStyle(
                                      fontSize: 16,
                                      color: RaahiColors.textPrimary,
                                    ),
                                    decoration: const InputDecoration(
                                      hintText: 'Enter destination',
                                      hintStyle: TextStyle(
                                        color: RaahiColors.placeholderGray,
                                      ),
                                      border: InputBorder.none,
                                      contentPadding: EdgeInsets.zero,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Vehicle selection
                    const VehicleSelection(),
                    
                    const SizedBox(height: 32),
                    
                    // Payment slider
                    PaymentSlider(onRideBook: _handleRideBook),
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

class VehicleSelection extends StatelessWidget {
  const VehicleSelection({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<RideProvider>(
      builder: (context, rideProvider, child) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Choose Vehicle',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                color: RaahiColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
            ),
            
            const SizedBox(height: 16),
            
            ...rideProvider.vehicles.map((vehicle) => VehicleOptionWidget(
              vehicle: vehicle,
              isSelected: rideProvider.selectedVehicleId == vehicle.id,
              onTap: () => rideProvider.selectVehicle(vehicle.id),
            )).toList(),
          ],
        );
      },
    );
  }
}

class VehicleOptionWidget extends StatelessWidget {
  final VehicleOption vehicle;
  final bool isSelected;
  final VoidCallback onTap;

  const VehicleOptionWidget({
    super.key,
    required this.vehicle,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? RaahiColors.selectedVehicle : RaahiColors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? RaahiColors.buttonPrimary : RaahiColors.borderGray,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: [
            if (isSelected)
              BoxShadow(
                color: RaahiColors.buttonPrimary.withOpacity(0.2),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
          ],
        ),
        child: Row(
          children: [
            // Vehicle icon placeholder
            Container(
              width: 60,
              height: 40,
              decoration: BoxDecoration(
                color: isSelected ? RaahiColors.white : RaahiColors.lightGray,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.directions_car,
                color: isSelected ? RaahiColors.selectedVehicle : RaahiColors.gray,
                size: 24,
              ),
            ),
            
            const SizedBox(width: 16),
            
            // Vehicle details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        vehicle.name,
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: isSelected ? RaahiColors.white : RaahiColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        vehicle.time,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: isSelected ? RaahiColors.white.withOpacity(0.8) : RaahiColors.gray,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        vehicle.description,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: isSelected ? RaahiColors.white.withOpacity(0.8) : RaahiColors.gray,
                        ),
                      ),
                      Text(
                        vehicle.price,
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: isSelected ? RaahiColors.white : RaahiColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class PaymentSlider extends StatefulWidget {
  final VoidCallback onRideBook;
  
  const PaymentSlider({
    super.key,
    required this.onRideBook,
  });

  @override
  State<PaymentSlider> createState() => _PaymentSliderState();
}

class _PaymentSliderState extends State<PaymentSlider>
    with TickerProviderStateMixin {
  late AnimationController _slideController;
  double _dragPosition = 0.0;
  bool _isDragging = false;
  bool _isSliding = false;
  static const double _circleSize = 80.0;
  double _sliderWidth = 0.0;
  final GlobalKey _sliderKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _updateSliderWidth();
    });
  }

  @override
  void dispose() {
    _slideController.dispose();
    super.dispose();
  }

  void _updateSliderWidth() {
    final RenderBox? renderBox =
        _sliderKey.currentContext?.findRenderObject() as RenderBox?;
    if (renderBox != null) {
      const padding = 20; // 10px left + 10px right
      setState(() {
        _sliderWidth = renderBox.size.width - _circleSize - padding;
      });
    }
  }

  void _onPanStart(DragStartDetails details) {
    if (_isSliding) return;
    setState(() {
      _isDragging = true;
    });
  }

  void _onPanUpdate(DragUpdateDetails details) {
    if (!_isDragging || _isSliding) return;

    final RenderBox? renderBox =
        _sliderKey.currentContext?.findRenderObject() as RenderBox?;
    if (renderBox != null) {
      final localPosition = renderBox.globalToLocal(details.globalPosition);
      const leftPadding = 10;
      final rawPosition = localPosition.dx - leftPadding - _circleSize / 2;
      final newPosition = rawPosition.clamp(0.0, _sliderWidth);

      setState(() {
        _dragPosition = newPosition;
      });
    }
  }

  void _onPanEnd(DragEndDetails details) {
    if (!_isDragging || _isSliding) return;

    setState(() {
      _isDragging = false;
    });

    // Check if slider reached the end
    if (_dragPosition >= _sliderWidth * 0.8) {
      _completeSlide();
    } else {
      _resetSlider();
    }
  }

  void _completeSlide() {
    setState(() {
      _isSliding = true;
    });

    _slideController.forward().then((_) {
      // Trigger booking
      widget.onRideBook();
      
      // Reset after a delay
      Future.delayed(const Duration(milliseconds: 500), () {
        if (mounted) {
          _resetSlider();
        }
      });
    });
  }

  void _resetSlider() {
    setState(() {
      _dragPosition = 0.0;
      _isSliding = false;
    });
    _slideController.reset();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<RideProvider>(
      builder: (context, rideProvider, child) {
        final canBook = rideProvider.canBookRide;
        
        return Container(
          key: _sliderKey,
          height: 100,
          decoration: BoxDecoration(
            color: canBook ? RaahiColors.buttonPrimary : RaahiColors.placeholderGray,
            borderRadius: BorderRadius.circular(50),
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
              // Background text
              Center(
                child: Text(
                  canBook ? 'Slide to Book Ride' : 'Select pickup, drop & vehicle',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: RaahiColors.white.withOpacity(0.8),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              
              // Draggable circle
              AnimatedPositioned(
                duration: _isDragging ? Duration.zero : const Duration(milliseconds: 300),
                curve: Curves.easeOutCubic,
                left: 10 + _dragPosition,
                top: 10,
                child: GestureDetector(
                  onPanStart: canBook ? _onPanStart : null,
                  onPanUpdate: canBook ? _onPanUpdate : null,
                  onPanEnd: canBook ? _onPanEnd : null,
                  child: AnimatedScale(
                    scale: _isDragging ? 1.1 : 1.0,
                    duration: const Duration(milliseconds: 200),
                    child: Container(
                      width: _circleSize,
                      height: _circleSize,
                      decoration: BoxDecoration(
                        color: RaahiColors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.arrow_forward_ios,
                        color: RaahiColors.textPrimary,
                        size: 24,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}