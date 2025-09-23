# Raahi - Butter to your जाम 🚗

A complete cab booking web application with authentic Raahi branding and seamless user experience.

![Raahi App](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Platform](https://img.shields.io/badge/platform-Web-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

## 📱 About Raahi

Raahi is a comprehensive cab booking web application built with React and TypeScript, featuring:
- **3 Authentication Methods**: Truecaller OTP, Google Sign-In, Mobile OTP
- **Complete Ride Journey**: From booking to completion with real-time tracking
- **Authentic Branding**: Custom Raahi colors, fonts, and immersive mobile UI
- **State Management**: React Context and hooks for robust app state handling
- **Persistent Storage**: LocalStorage for user preferences

## 🚀 Quick Start

### Prerequisites

Before running the web app, ensure you have:

- **Node.js**: 16.0.0 or higher
- **npm** or **yarn**: Latest version
- **VS Code** with React/TypeScript extensions

### Installation

1. **Clone or extract the project files**
   ```bash
   # If you have git access to this project
   git clone <repository-url>
   cd raahi-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.0.0",
  "vite": "^6.3.5"
}
```

### UI Components
```json
{
  "@radix-ui/react-*": "Latest versions",
  "lucide-react": "^0.487.0",
  "tailwindcss": "Latest",
  "class-variance-authority": "^0.7.1"
}
```

### Development Tools
```json
{
  "@vitejs/plugin-react-swc": "^3.10.2",
  "@types/node": "^20.10.0"
}
```

## 🏗️ Project Structure

```
src/
├── App.tsx                    # Main React application
├── components/                # React components
│   ├── auth/                  # Authentication components
│   ├── driver/                # Driver-specific components
│   ├── passenger/             # Passenger components
│   ├── ui/                    # Reusable UI components
│   └── screens/               # Main screen components
├── hooks/                     # Custom React hooks
├── services/                  # API services
├── utils/                     # Utility functions
├── styles/                    # CSS and styling
└── assets/                    # Static assets
```

## 🎨 Raahi Branding

### Color Palette
```typescript
export const RaahiColors = {
  textPrimary: '#11211e',      // Main text
  backgroundPrimary: '#F6EFD8', // Background
  buttonPrimary: '#cf923d',     // Buttons
  tagline: '#c3aa85',           // Tagline
  // ... additional colors
} as const;
```

### Custom Fonts
- **Samarkan**: Main logo and branding
- **Poppins**: Primary UI text (Regular, Medium, SemiBold, Bold)
- **Kite One**: Tagline accent
- **Abhaya Libre**: Hindi text support

## 📱 Features Implementation

### Authentication Flow
```typescript
// Login methods available
- Truecaller OTP (SDK integration ready)
- Google Sign-In (OAuth 2.0 ready)
- Mobile OTP (SMS gateway integration ready)
```

### State Management
```typescript
// Global app state using React Context
const { login, navigateToScreen } = useAppState();
login('truecaller');
navigateToScreen('booking');

// Ride booking state using custom hooks
const { selectVehicle, setPickupLocation } = useRideBooking();
selectVehicle('raahi-mini');
setPickupLocation('Location');
```

### Screen Navigation
```typescript
// React Router navigation flow
/login → /contact → /otp → 
/terms (first-time) → /booking → 
/booking-loader → /driver-tracking
```

## 🔧 Development Setup

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter

### Web Development
1. **Install Node.js** (16.0.0+)
2. **Install dependencies** with `npm install`
3. **Start development server** with `npm run dev`
4. **Open browser** to `http://localhost:5173`

## 🚀 Building for Production

### Web Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to hosting service (e.g., Vercel, Netlify)
# The build output will be in the 'dist' folder
```

## 🔗 API Integration

The app is designed with API integration in mind. All network calls are documented with comments:

### Authentication APIs
```typescript
// Truecaller verification
POST /api/auth/truecaller-verify
{ phone: string, truecaller_token: string }

// Google Sign-In verification  
POST /api/auth/google-verify
{ id_token: string, access_token: string }

// Mobile OTP
POST /api/auth/send-otp
{ phone: string, country_code: string }
```

### Ride Booking APIs
```typescript
// Driver search
POST /api/rides/search
{ pickup_lat: number, pickup_lng: number, vehicle_type: string }

// Real-time tracking
WebSocket: ws://your-api.com/rides/{ride_id}/track
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests (when test framework is added)
npm test

# E2E tests (when Cypress/Playwright is added)
npm run test:e2e

# Type checking
npm run type-check
```

### Debug Tools
```bash
# Development server with debugging
npm run dev

# Build analysis
npm run build -- --analyze

# Browser DevTools
# Open browser DevTools (F12) for debugging
```

## 🔒 Security Considerations

### Secure Storage
```typescript
// Sensitive data storage using browser's secure storage
const setSecureToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  // For more sensitive data, consider using sessionStorage
  // or implementing encryption
};
```

### API Security
- Use HTTPS endpoints only
- Implement certificate pinning
- Add API key protection
- Implement rate limiting

## 📋 Environment Configuration

### Development
```typescript
// src/config/app.config.ts
export const AppConfig = {
  baseUrl: 'https://dev-api.raahi.com',
  googleClientId: 'your-dev-client-id',
  truecallerAppKey: 'your-dev-truecaller-key',
} as const;
```

### Production
```typescript
export const AppConfig = {
  baseUrl: 'https://api.raahi.com',
  googleClientId: 'your-prod-client-id',
  truecallerAppKey: 'your-prod-truecaller-key',
} as const;
```

## 🐛 Troubleshooting

### Common Issues

**1. Node.js Issues**
```bash
node --version  # Check Node.js version
npm --version   # Check npm version
```

**2. Build Issues**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**3. TypeScript Issues**
```bash
npm run type-check
# Fix TypeScript errors in the output
```

**4. Dependency Conflicts**
```bash
npm ls
npm audit
npm update
```

## 📈 Performance Optimization

### Build Optimization
```bash
# Build with optimizations
npm run build

# Analyze bundle size
npm run build -- --analyze

# Optimize images and assets
# Use proper image formats (WebP, AVIF)
# Implement lazy loading for images
```

### Runtime Optimization
- Use React.memo() for component memoization
- Implement code splitting with React.lazy()
- Optimize image assets with proper sizing
- Use virtual scrolling for large lists
- Implement proper caching strategies

## 🤝 Contributing

### Code Style
```bash
# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint

# Type check with TypeScript
npm run type-check
```

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

### Issues & Questions
For technical issues or questions about the Raahi web app:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include browser information and error logs

---

**Built with ❤️ in Delhi, NCR using React & TypeScript**

*Raahi - Making every journey smooth as butter!* 🧈✨