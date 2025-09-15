# 🚀 Raahi API Integration Guide

This comprehensive guide outlines all the API integration points in your Raahi cab application. Use this as a checklist when implementing real backend services.

## 📋 Quick Integration Checklist

### Core APIs (Priority 1 - Essential)
- [ ] **Authentication API** - Login, OTP, Session management
- [ ] **User Management API** - Profile, preferences, account data
- [ ] **Ride Booking API** - Create, track, manage rides
- [ ] **Driver Management API** - Registration, onboarding, status
- [ ] **Location Services API** - Geocoding, routing, ETA calculation

### Advanced APIs (Priority 2 - Enhanced Features)
- [ ] **Document Verification API** - Upload, OCR, verification
- [ ] **Payment Processing API** - Transactions, wallets, refunds
- [ ] **Real-time Communication API** - WebSocket, notifications
- [ ] **Analytics & Tracking API** - Events, metrics, insights
- [ ] **Support System API** - Tickets, chat, help desk

### Optional APIs (Priority 3 - Premium Features)
- [ ] **Facial Recognition API** - Identity verification
- [ ] **Background Check API** - Driver screening
- [ ] **AI/ML Services API** - Fraud detection, optimization
- [ ] **Third-party Integrations** - Maps, payment gateways

---

## 🔧 API Service Structure

### Recommended File Organization
```
/services/
├── auth/
│   ├── authApi.ts          # Authentication endpoints
│   ├── sessionManager.ts   # Token management
│   └── index.ts
├── passenger/
│   ├── passengerApi.ts     # Passenger-specific endpoints
│   ├── profileApi.ts       # Profile management
│   └── index.ts
├── driver/
│   ├── driverApi.ts        # Driver-specific endpoints
│   ├── onboardingApi.ts    # Driver onboarding flow
│   └── index.ts
├── ride/
│   ├── rideApi.ts          # Ride management
│   ├── trackingApi.ts      # Real-time tracking
│   └── index.ts
├── document/
│   ├── documentApi.ts      # Document upload/management
│   ├── verificationApi.ts  # Document verification
│   └── index.ts
├── payment/
│   ├── paymentApi.ts       # Payment processing
│   ├── walletApi.ts        # Wallet management
│   └── index.ts
├── notification/
│   ├── notificationApi.ts  # Push/SMS/Email notifications
│   ├── websocketClient.ts  # Real-time updates
│   └── index.ts
├── location/
│   ├── locationApi.ts      # Geocoding, routing
│   ├── mapsApi.ts          # Map services integration
│   └── index.ts
├── analytics/
│   ├── analyticsApi.ts     # Event tracking
│   ├── metricsApi.ts       # Performance metrics
│   └── index.ts
└── support/
    ├── supportApi.ts       # Support ticket system
    ├── chatApi.ts          # In-app chat
    └── index.ts
```

---

## 🛡️ Security & Authentication

### JWT Token Management
```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Secure token storage
const secureStorage = {
  setTokens: async (tokens: AuthTokens) => {
    // Use secure storage like Keychain/Keystore
    await SecureStore.setItemAsync('raahi_tokens', JSON.stringify(tokens));
  },
  getTokens: async (): Promise<AuthTokens | null> => {
    const tokens = await SecureStore.getItemAsync('raahi_tokens');
    return tokens ? JSON.parse(tokens) : null;
  }
};
```

### API Authentication Headers
```typescript
const getAuthHeaders = async () => {
  const tokens = await secureStorage.getTokens();
  return {
    'Authorization': `Bearer ${tokens?.accessToken}`,
    'X-App-Version': APP_VERSION,
    'X-Platform': 'web',
    'X-Device-ID': await getDeviceId(),
    'Content-Type': 'application/json'
  };
};
```

---

## 📡 Real-time Communication

### WebSocket Integration Points

#### 1. Ride Tracking (Passenger)
```typescript
// Connect to ride updates
const rideSocket = new WebSocket(`${WS_BASE_URL}/rides/${rideId}/updates`);

rideSocket.onmessage = (event) => {
  const update = JSON.parse(event.data);
  switch (update.type) {
    case 'DRIVER_LOCATION_UPDATE':
      updateDriverLocation(update.location);
      break;
    case 'RIDE_STATUS_CHANGE':
      updateRideStatus(update.status);
      break;
    case 'ETA_UPDATE':
      updateETA(update.eta);
      break;
  }
};
```

#### 2. Driver Location Updates (Driver)
```typescript
// Send driver location updates
const driverSocket = new WebSocket(`${WS_BASE_URL}/drivers/${driverId}/location`);

// Send location every 10 seconds when online
setInterval(() => {
  if (isDriverOnline) {
    navigator.geolocation.getCurrentPosition((position) => {
      driverSocket.send(JSON.stringify({
        type: 'LOCATION_UPDATE',
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: Date.now()
      }));
    });
  }
}, 10000);
```

#### 3. Document Verification Status
```typescript
// Listen for verification updates
const verificationSocket = new WebSocket(`${WS_BASE_URL}/drivers/${driverId}/verification`);

verificationSocket.onmessage = (event) => {
  const update = JSON.parse(event.data);
  if (update.type === 'DOCUMENT_VERIFIED') {
    toast.success(`${update.documentType} verified!`);
    updateDocumentStatus(update.documentType, 'VERIFIED');
  }
};
```

---

## 🏗️ API Endpoints Reference

### Authentication Endpoints
```typescript
// Passenger login
POST /api/auth/passenger/login
{
  "method": "truecaller" | "google" | "mobile_otp",
  "token": "auth_token_from_provider",
  "deviceInfo": { "deviceId": "...", "platform": "web" }
}

// Driver registration
POST /api/auth/driver/register
{
  "email": "driver@example.com",
  "platform": "web",
  "deviceInfo": { "deviceId": "...", "userAgent": "..." }
}

// OTP verification
POST /api/auth/verify-otp
{
  "phoneNumber": "+911234567890",
  "otp": "123456",
  "sessionId": "otp_session_id"
}
```

### Ride Management Endpoints
```typescript
// Create ride request
POST /api/rides/create
{
  "passengerId": "passenger_id",
  "pickupLocation": { "lat": 28.6139, "lng": 77.2090, "address": "..." },
  "dropoffLocation": { "lat": 28.7041, "lng": 77.1025, "address": "..." },
  "vehicleType": "sedan" | "hatchback" | "suv",
  "paymentMethod": "cash" | "card" | "wallet"
}

// Get ride status
GET /api/rides/{rideId}/status

// Cancel ride
POST /api/rides/{rideId}/cancel
{
  "reason": "change_of_plans" | "driver_delay" | "other",
  "cancellationFee": 0
}
```

### Driver Onboarding Endpoints
```typescript
// Upload document
POST /api/drivers/{driverId}/documents/upload
FormData: {
  "documentType": "DRIVING_LICENSE" | "PAN_CARD" | "AADHAAR_CARD",
  "file": File,
  "metadata": { "uploadedAt": "...", "fileName": "..." }
}

// Update onboarding status
PATCH /api/drivers/{driverId}/onboarding
{
  "step": "DOCUMENTS_UPLOADED",
  "status": "VERIFICATION_PENDING",
  "completedAt": "2024-01-01T00:00:00Z"
}
```

---

## 🔄 Error Handling Patterns

### Global Error Handler
```typescript
export const handleApiError = (error: any, context: string) => {
  console.error(`API Error in ${context}:`, error);

  switch (error.status) {
    case 400:
      toast.error("Invalid request", {
        description: error.message || "Please check your input and try again"
      });
      break;
    
    case 401:
      // Token expired or invalid
      handleTokenRefresh();
      break;
    
    case 403:
      toast.error("Access denied", {
        description: "You don't have permission for this action"
      });
      break;
    
    case 404:
      toast.error("Not found", {
        description: "The requested resource was not found"
      });
      break;
    
    case 429:
      toast.error("Too many requests", {
        description: "Please wait a moment before trying again"
      });
      break;
    
    case 500:
      toast.error("Server error", {
        description: "Something went wrong on our end. Please try again later"
      });
      break;
    
    case 503:
      toast.error("Service unavailable", {
        description: "The service is temporarily unavailable"
      });
      break;
    
    default:
      toast.error("Connection error", {
        description: "Please check your internet connection and try again"
      });
  }

  // Log error for debugging (in production, send to error tracking service)
  if (process.env.NODE_ENV === 'production') {
    analyticsApi.logError(error, context);
  }
};
```

### Retry Logic
```typescript
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }
  throw new Error('Max retries exceeded');
};
```

---

## 📊 Analytics Integration

### Event Tracking
```typescript
// Track user actions
export const trackEvent = (eventName: string, properties: any) => {
  analyticsApi.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId: getCurrentUserId(),
    platform: 'web',
    appVersion: APP_VERSION
  });
};

// Usage examples
trackEvent('ride_requested', {
  vehicleType: 'sedan',
  estimatedFare: 250,
  distance: 5.2
});

trackEvent('driver_document_uploaded', {
  documentType: 'DRIVING_LICENSE',
  fileSize: 2048576
});
```

---

## 🚨 Production Deployment Checklist

### Environment Configuration
- [ ] Set up separate API endpoints for dev/staging/production
- [ ] Configure SSL certificates for HTTPS
- [ ] Set up API rate limiting and DDoS protection
- [ ] Configure CORS policies
- [ ] Set up API monitoring and alerting

### Security
- [ ] Implement proper authentication and authorization
- [ ] Set up API key rotation
- [ ] Configure secure headers
- [ ] Implement request signing for sensitive endpoints
- [ ] Set up vulnerability scanning

### Performance
- [ ] Implement API caching strategies
- [ ] Set up CDN for static assets
- [ ] Configure database indexing
- [ ] Implement connection pooling
- [ ] Set up load balancing

### Monitoring
- [ ] Set up error tracking (Sentry, Bugsnag)
- [ ] Configure performance monitoring
- [ ] Set up API analytics and metrics
- [ ] Implement health checks
- [ ] Set up logging and log aggregation

---

## 📞 Support & Maintenance

### API Documentation
- Generate comprehensive API documentation using Swagger/OpenAPI
- Include example requests and responses
- Document error codes and their meanings
- Provide SDK/client libraries for common platforms

### Testing Strategy
- Unit tests for all API endpoints
- Integration tests for critical flows
- Load testing for high-traffic scenarios
- Security testing for vulnerability assessment

### Monitoring & Alerts
- Set up alerts for API downtime
- Monitor response times and error rates
- Track API usage patterns and trends
- Set up capacity planning based on usage metrics

---

## 🎯 Next Steps

1. **Phase 1**: Implement core authentication and user management APIs
2. **Phase 2**: Build ride booking and tracking functionality
3. **Phase 3**: Add document verification and driver onboarding
4. **Phase 4**: Implement real-time features and notifications
5. **Phase 5**: Add advanced features like analytics and AI/ML services

For any questions or clarifications about the API integration, refer to the detailed comments in your `App.tsx` file or contact the development team.

---

*Last updated: December 2024*
*Version: 1.0*