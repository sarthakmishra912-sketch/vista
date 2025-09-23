# 🚀 Raahi Web App - Deployment Guide

This guide covers deploying the Raahi web app to production environments.

## 🌐 Web App Deployment

### Static Site Deployment

#### 1. **Prepare Production Build**
```bash
# Build for production
npm run build

# The build output will be in the 'dist' folder
# This folder contains all static files ready for deployment
```

#### 2. **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Or connect your GitHub repository to Vercel for automatic deployments
# 1. Go to vercel.com
# 2. Import your GitHub repository
# 3. Configure build settings (npm run build)
# 4. Deploy automatically on every push to main branch
```

#### 3. **Netlify Deployment**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Or connect your GitHub repository to Netlify
# 1. Go to netlify.com
# 2. Import your GitHub repository
# 3. Set build command: npm run build
# 4. Set publish directory: dist
```

#### 4. **GitHub Pages Deployment**
```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add deploy script to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy to GitHub Pages
npm run build
npm run deploy
```

## ⚙️ Environment Setup

### Production Configuration

#### 1. **API Endpoints**
```typescript
// src/config/prod.config.ts
export const ProdConfig = {
  baseUrl: 'https://api.raahi.com',
  websocketUrl: 'wss://ws.raahi.com',
  googleMapsApiKey: 'your-prod-maps-key',
} as const;
```

#### 2. **Environment Variables**
```bash
# .env.production
VITE_API_BASE_URL=https://api.raahi.com
VITE_GOOGLE_CLIENT_ID=your-prod-google-client-id
VITE_TRUECALLER_APP_KEY=your-prod-truecaller-key
VITE_RAZORPAY_KEY_ID=your-prod-razorpay-key
```

### Firebase Setup (Optional)

#### 1. **Firebase Configuration**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase login
firebase init

# Add Firebase config files:
# - src/firebase.config.ts
# - public/firebase-messaging-sw.js
```

#### 2. **Firebase Features**
```json
{
  "dependencies": {
    "firebase": "^10.7.1",
    "firebase/analytics": "^10.7.1",
    "firebase/auth": "^10.7.1",
    "firebase/firestore": "^10.7.1"
  }
}
```

## 🔒 Security & Performance

### Code Minification
```bash
# Build with minification (enabled by default in Vite)
npm run build

# The build process automatically:
# - Minifies JavaScript and CSS
# - Tree-shakes unused code
# - Optimizes assets
```

### Content Security Policy
```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://apis.google.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;">
```

### HTTPS Configuration
```typescript
// src/services/api.service.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.raahi.com';

// Ensure all API calls use HTTPS
if (!API_BASE_URL.startsWith('https://')) {
  throw new Error('API base URL must use HTTPS in production');
}
```

## 📊 Monitoring & Analytics

### Error Tracking
```typescript
// src/services/error.service.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const logError = (error: Error, context?: string) => {
  console.error('Error:', error, context);
  
  // Send to error tracking service
  logEvent(analytics, 'error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
    context: context || 'unknown'
  });
};
```

### Analytics Tracking
```typescript
// src/services/analytics.service.ts
import { logEvent } from 'firebase/analytics';

export const logRideBooking = (vehicleType: string) => {
  logEvent(analytics, 'ride_booking', {
    vehicle_type: vehicleType,
    timestamp: new Date().toISOString()
  });
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy Raahi Web App

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
```

### Netlify Integration
```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔍 SEO Optimization

### Meta Tags and SEO

#### HTML Meta Tags
```html
<!-- public/index.html -->
<title>Raahi - Cab Booking App | Butter to your जाम</title>
<meta name="description" content="Experience seamless cab booking with Raahi - the premium transportation app that makes every journey smooth as butter! Multiple login options, real-time tracking, and secure payments.">
<meta name="keywords" content="cab booking, taxi app, ride sharing, transportation, Raahi, Delhi NCR">
<meta name="author" content="Raahi">
<meta property="og:title" content="Raahi - Cab Booking App">
<meta property="og:description" content="Butter to your जाम - Premium cab booking experience">
<meta property="og:type" content="website">
<meta property="og:url" content="https://raahi.com">
<meta property="og:image" content="https://raahi.com/og-image.jpg">
```

#### Sitemap and Robots
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://raahi.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://raahi.com/booking</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Performance Optimization
```bash
# Lighthouse audit for performance
npm install -g lighthouse
lighthouse https://raahi.com --output html --output-path ./lighthouse-report.html

# Core Web Vitals to monitor:
# - Largest Contentful Paint (LCP) < 2.5s
# - First Input Delay (FID) < 100ms
# - Cumulative Layout Shift (CLS) < 0.1
```

## 🔧 Post-Deployment

### Version Management
```json
{
  "name": "raahi-web-app",
  "version": "1.0.0",
  "scripts": {
    "version:patch": "npm version patch",
    "version:minor": "npm version minor",
    "version:major": "npm version major"
  }
}
```

### Rollback Strategy
```bash
# If issues arise, rollback steps:
# 1. Revert to previous commit
git revert <commit-hash>

# 2. Rebuild and redeploy
npm run build
npm run deploy

# 3. Or use deployment platform's rollback feature
# Vercel: Dashboard → Deployments → Rollback
# Netlify: Dashboard → Deploys → Rollback
```

### User Feedback Monitoring
```typescript
// In-app feedback collection
export const requestFeedback = () => {
  // Show feedback modal or redirect to feedback form
  const feedbackUrl = 'https://forms.gle/your-feedback-form';
  window.open(feedbackUrl, '_blank');
};

// Google Analytics events for user behavior
export const trackUserAction = (action: string, category: string) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: 'user_interaction'
    });
  }
};
```

---

## 📞 Production Support

### Monitoring Checklist
- [ ] Website uptime > 99.9%
- [ ] Page load times < 3 seconds
- [ ] API response times < 2 seconds
- [ ] User retention rates
- [ ] Ride completion rates
- [ ] Payment success rates
- [ ] Core Web Vitals within acceptable ranges

### Emergency Response
```typescript
// Feature flags for emergency shutdowns
export const FeatureFlags = {
  isRideBookingEnabled: true, // Can be controlled remotely
  isPaymentEnabled: true,
  isTrackingEnabled: true,
  maintenanceMode: false
} as const;

// Emergency maintenance mode
export const enableMaintenanceMode = () => {
  // Redirect to maintenance page or show maintenance message
  window.location.href = '/maintenance';
};
```

**🌐 Your web app is ready for production deployment!**

*Remember: Always test thoroughly across different browsers and devices before releasing to production.*