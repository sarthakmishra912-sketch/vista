import 'package:flutter/material.dart';

class VehicleOption {
  final String id;
  final String name;
  final String time;
  final String price;
  final String image;
  final String description;

  VehicleOption({
    required this.id,
    required this.name,
    required this.time,
    required this.price,
    required this.image,
    required this.description,
  });
}

class RideProvider with ChangeNotifier {
  String _pickupLocation = '';
  String _dropLocation = '';
  String? _selectedVehicleId;
  bool _isLoading = false;
  
  // Vehicle options
  final List<VehicleOption> _vehicles = [
    VehicleOption(
      id: 'raahi-mini',
      name: 'Raahi Mini',
      time: '2 min',
      price: '₹142',
      image: 'assets/images/raahi_mini.png',
      description: 'Comfortable rides for 4',
    ),
    VehicleOption(
      id: 'raahi-sedan',
      name: 'Raahi Sedan',
      time: '3 min',
      price: '₹178',
      image: 'assets/images/raahi_sedan.png',
      description: 'Premium comfort for 4',
    ),
    VehicleOption(
      id: 'raahi-xl',
      name: 'Raahi XL',
      time: '5 min',
      price: '₹234',
      image: 'assets/images/raahi_xl.png',
      description: 'Spacious rides for 6-7',
    ),
  ];

  // Getters
  String get pickupLocation => _pickupLocation;
  String get dropLocation => _dropLocation;
  String? get selectedVehicleId => _selectedVehicleId;
  bool get isLoading => _isLoading;
  List<VehicleOption> get vehicles => _vehicles;
  
  VehicleOption? get selectedVehicle {
    if (_selectedVehicleId == null) return null;
    return _vehicles.firstWhere(
      (vehicle) => vehicle.id == _selectedVehicleId,
      orElse: () => _vehicles.first,
    );
  }

  bool get canBookRide {
    return _pickupLocation.isNotEmpty &&
           _dropLocation.isNotEmpty &&
           _selectedVehicleId != null &&
           !_isLoading;
  }

  // Setters
  void setPickupLocation(String location) {
    _pickupLocation = location;
    notifyListeners();
  }

  void setDropLocation(String location) {
    _dropLocation = location;
    notifyListeners();
  }

  void selectVehicle(String vehicleId) {
    _selectedVehicleId = vehicleId;
    notifyListeners();
  }

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  // Reset all selections
  void reset() {
    _pickupLocation = '';
    _dropLocation = '';
    _selectedVehicleId = null;
    _isLoading = false;
    notifyListeners();
  }

  // Book ride
  Map<String, dynamic> getRideBookingData() {
    return {
      'pickupLocation': _pickupLocation,
      'dropLocation': _dropLocation,
      'selectedVehicle': selectedVehicle?.name,
      'vehicleId': _selectedVehicleId,
      'estimatedPrice': selectedVehicle?.price,
      'estimatedTime': selectedVehicle?.time,
      'bookingTime': DateTime.now().toIso8601String(),
    };
  }
}