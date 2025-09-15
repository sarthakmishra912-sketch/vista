import 'package:flutter/material.dart';

enum AppScreen {
  dashboard,
  login,
  contact,
  otp,
  terms,
  booking,
  bookingLoader,
  driverTracking,
}

class AppColors {
  // Primary Brand Colors
  static const Color background = Color(0xFFF6EFD8);
  static const Color brandDark = Color(0xFF11211E);
  static const Color brandGold = Color(0xFFC3AA85);
  
  // Button Colors
  static const Color primaryButton = Color(0xFFCF923D);
  static const Color primaryButtonHover = Color(0xFFB8823A);
  static const Color secondaryButton = Color(0xFFE8DBC9);
  static const Color secondaryButtonHover = Color(0xFFDDD0BD);
  
  // Profile Colors
  static const Color profileBackground = Color(0xFFEEDFCA);
  static const Color profileBorder = Color(0xFFA89C8A);
  
  // Text Colors
  static const Color primaryText = Color(0xFF353535);
  static const Color secondaryText = Color(0xFF606060);
  static const Color darkText = Color(0xFF2F2F2F);
  static const Color lightText = Color(0xFF353330);
  static const Color statusBarText = Color(0xFF170E2B);
  
  // Login Button Colors
  static const Color truecallerButton = Color(0xFF353330);
  static const Color truecallerButtonHover = Color(0xFF2A2926);
  
  // Notch/Dynamic Island Color
  static const Color notchColor = Color(0xFF0F1D1A);
  
  // Driver App Button
  static const Color driverAppBackground = Color(0xFFEEE5CA);
  static const Color driverAppHover = Color(0xFFE5DCC5);
}

class AppFonts {
  static const String samarkan = 'Samarkan';
  static const String poppins = 'Poppins';
  static const String kiteOne = 'KiteOne';
  static const String abhayaLibreSemiBold = 'AbhayaLibreSemiBold';
  static const String roboto = 'Roboto';
}

class AppSizes {
  // Login Screen
  static const double loginButtonHeight = 72.0;
  static const double mobileOTPButtonHeight = 64.0;
  static const double borderRadius = 24.0;
  
  // Profile Section
  static const double profileHeight = 69.46;
  static const double profilePicSize = 52.493;
  static const double profileBorderRadius = 81.947;
  
  // Action Buttons
  static const double findRideButtonHeight = 80.0;
  static const double driversAppButtonHeight = 70.0;
  static const double actionButtonRadius = 40.0;
  
  // Brand Text
  static const double brandTextHeightContainer = 175.725;
  
  // Notch/Dynamic Island
  static const double notchWidth = 180.0;
  static const double notchHeight = 35.0;
  static const double notchRadius = 20.0;
}

class AppTextStyles {
  // Brand Text
  static TextStyle getBrandTextStyle(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    double fontSize = 80;
    
    if (width >= 1024) fontSize = 159.316;
    else if (width >= 768) fontSize = 120;
    else if (width >= 640) fontSize = 100;
    
    return TextStyle(
      fontFamily: AppFonts.samarkan,
      fontSize: fontSize,
      color: AppColors.brandDark,
      fontWeight: FontWeight.normal,
    );
  }
  
  // Tagline Text
  static TextStyle getTaglineTextStyle(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    double fontSize = 32;
    
    if (width >= 768) fontSize = 50.659;
    else if (width >= 640) fontSize = 40;
    
    return TextStyle(
      fontFamily: AppFonts.kiteOne,
      fontSize: fontSize,
      color: AppColors.brandGold,
    );
  }
  
  static TextStyle getDevanagariTextStyle(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    double fontSize = 36;
    
    if (width >= 768) fontSize = 56.8;
    else if (width >= 640) fontSize = 46;
    
    return TextStyle(
      fontFamily: AppFonts.abhayaLibreSemiBold,
      fontSize: fontSize,
      color: AppColors.brandGold,
    );
  }
  
  // Button Text Styles
  static const TextStyle loginButtonText = TextStyle(
    fontFamily: AppFonts.poppins,
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: Colors.white,
  );
  
  static const TextStyle secondaryButtonText = TextStyle(
    fontFamily: AppFonts.poppins,
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: AppColors.darkText,
  );
  
  static const TextStyle profileEmailText = TextStyle(
    fontFamily: AppFonts.poppins,
    fontWeight: FontWeight.w500,
    fontSize: 16,
    color: AppColors.primaryText,
  );
  
  static const TextStyle footerText = TextStyle(
    fontFamily: AppFonts.poppins,
    fontWeight: FontWeight.w300,
    fontSize: 14,
    color: AppColors.secondaryText,
  );
  
  static const TextStyle actionButtonText = TextStyle(
    fontFamily: AppFonts.poppins,
    fontWeight: FontWeight.w500,
    fontSize: 20,
    color: Colors.white,
  );
  
  static const TextStyle switchAccountText = TextStyle(
    fontFamily: AppFonts.poppins,
    fontWeight: FontWeight.normal,
    fontSize: 20,
    color: AppColors.lightText,
    decoration: TextDecoration.underline,
  );
}

class AppAssets {
  static const String flowerBackground = 'assets/images/flower_bg.png';
  static const String truecallerLogo = 'assets/images/truecaller_logo.png';
  static const String googleLogo = 'assets/images/google_logo.png';
  static const String profilePic = 'assets/images/profile_pic.png';
}