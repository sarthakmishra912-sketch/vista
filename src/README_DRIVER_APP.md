# Raahi Driver App Documentation

## Overview
The Raahi Driver App is a complete driver onboarding and management system integrated within the main Raahi application. It provides a separate workflow for drivers while maintaining the same codebase.

## New File Structure

### Driver-Specific Components
```
/components/driver/
├── DriverEmailCollectionScreen.tsx  # Email/password collection (Figma design)
├── index.ts                        # Driver components exports
└── [Future components]
    ├── DriverDashboard.tsx
    ├── DriverProfile.tsx
    ├── DriverEarnings.tsx
    ├── DriverRideRequests.tsx
    └── DriverSupport.tsx
```

### Driver API Services
```
/services/driver/
├── driverApi.ts                    # All driver API calls
├── index.ts                       # Driver services exports
└── [Future services]
    ├── driverLocationService.ts
    ├── driverEarningsService.ts
    └── driverNotificationService.ts
```

### Passenger-Specific (Separated)
```
/components/passenger/              # For future passenger components
/services/passenger/               # For future passenger API services
```

## Driver App Flow

### 1. Entry Point
- User clicks "Open Drivers' App" on main dashboard
- App switches to `isDriverMode: true`
- Navigates to `driver-email-collection` screen

### 2. Email Collection Screen
- **Design**: Exact replica of Figma design provided
- **Functionality**: 
  - Email address input (pre-filled with existing user email)
  - Password input for account security
  - Support button with actual API integration
  - Continue button triggers driver registration

### 3. API Integration Points

#### Driver Registration
```typescript
// API Endpoint: POST /api/v1/driver/register
// Request Body:
{
  email: string,
  password: string,
  device_info: {
    platform: 'web',
    user_agent: string,
    app_version: string
  }
}

// Response:
{
  success: boolean,
  driver_id: string,
  token: string,
  onboarding_status: 'pending' | 'documents_required' | 'verification_pending' | 'approved' | 'rejected',
  message: string
}
```

#### Driver Support
```typescript
// API Endpoint: POST /api/v1/driver/support
// Request Body:
{
  driver_id: string,
  issue_type: string,
  description: string,
  timestamp: string,
  priority: 'low' | 'medium' | 'high'
}
```

## Environment Variables Required

Create a `.env` file with the following variables:

```env
# API Configuration
REACT_APP_API_BASE_URL=https://api.raahi.com
REACT_APP_API_KEY=your-api-key-here

# Driver App Specific
REACT_APP_DRIVER_SUPPORT_PHONE=+91-1234567890
REACT_APP_DRIVER_SUPPORT_EMAIL=support@raahi.com

# Feature Flags
REACT_APP_ENABLE_DRIVER_CHAT=false
REACT_APP_ENABLE_DRIVER_PHONE_SUPPORT=true
```

## Key Features Implemented

### 1. Exact Figma Design Replication
- ✅ Status bar with time and battery indicators
- ✅ Raahi branding header with Support button
- ✅ "Sign-in Details Required" title and description
- ✅ Email Address input field with proper styling
- ✅ Password input field (additional security)
- ✅ Continue button at bottom with proper styling
- ✅ All colors match Raahi brand guidelines

### 2. State Management
- ✅ Separate `isDriverMode` state tracking
- ✅ Driver-specific screen routing
- ✅ Proper navigation flow (back buttons, etc.)
- ✅ Local storage for driver data persistence

### 3. API Integration Ready
- ✅ Complete driver API service structure
- ✅ Mock responses for development
- ✅ Error handling and loading states
- ✅ Token management for authentication
- ✅ Support system integration

## Future Implementation Tasks

### Phase 1: Complete Onboarding
- [ ] Document upload screen (license, insurance, etc.)
- [ ] Vehicle information collection
- [ ] Background verification process
- [ ] Driver approval workflow

### Phase 2: Driver Dashboard
- [ ] Online/offline status toggle
- [ ] Earnings tracking and display
- [ ] Trip history and statistics
- [ ] Driver profile management

### Phase 3: Ride Management
- [ ] Incoming ride request notifications
- [ ] Accept/decline ride functionality
- [ ] Navigation integration
- [ ] Trip completion and rating

### Phase 4: Advanced Features
- [ ] Real-time location tracking
- [ ] In-app messaging with passengers
- [ ] Earnings withdrawal system
- [ ] Driver referral program

## API Endpoints to Implement

### Authentication & Registration
- `POST /api/v1/driver/register` - Driver registration
- `POST /api/v1/driver/login` - Driver login
- `POST /api/v1/driver/logout` - Driver logout
- `POST /api/v1/driver/refresh-token` - Token refresh

### Profile Management
- `GET /api/v1/driver/{id}/profile` - Get driver profile
- `PUT /api/v1/driver/{id}/profile` - Update driver profile
- `POST /api/v1/driver/{id}/documents` - Upload documents
- `GET /api/v1/driver/{id}/verification-status` - Check verification status

### Ride Management
- `PATCH /api/v1/driver/{id}/status` - Update online/offline status
- `GET /api/v1/driver/{id}/ride-requests` - Get incoming ride requests
- `POST /api/v1/driver/{id}/accept-ride` - Accept ride request
- `POST /api/v1/driver/{id}/decline-ride` - Decline ride request
- `POST /api/v1/driver/{id}/complete-ride` - Complete ride

### Earnings & Analytics
- `GET /api/v1/driver/{id}/earnings` - Get earnings data
- `GET /api/v1/driver/{id}/trips` - Get trip history
- `GET /api/v1/driver/{id}/analytics` - Get performance analytics

### Support & Communication
- `POST /api/v1/driver/support` - Create support ticket
- `GET /api/v1/driver/{id}/support-tickets` - Get support tickets
- `POST /api/v1/driver/{id}/chat` - Send message to passenger

## Testing the Driver Flow

1. Start the application
2. Click "Open Drivers' App" on the main dashboard
3. You should see the exact email collection screen from the Figma design
4. Fill in email and password
5. Click "Continue" to trigger the registration API call
6. Check browser console for API call logs
7. Verify state transitions and navigation flow

## Styling Notes

- All colors follow Raahi brand guidelines:
  - Background: `#F6EFD8`
  - Text: `#11211e` (main), `#080a24` (titles), `#2e2e2e` (descriptions)
  - Buttons: `#282828` (dark), `#cf923d` (brand)
  - Taglines: `#c3aa85`
- Fonts: Samarkan for branding, Poppins for content
- Exact pixel spacing and sizing from Figma design
- Mobile-first responsive design

## Support Integration

The Support button is fully functional and includes:
- API call to create support ticket
- Fallback to display contact information
- Proper error handling
- Toast notifications for user feedback

This driver app structure provides a solid foundation for a complete driver management system while maintaining separation from the passenger app functionality.