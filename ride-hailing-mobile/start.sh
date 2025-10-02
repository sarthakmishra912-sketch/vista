#!/bin/bash

# 📱 Ride Hailing Mobile App - Quick Start Script

echo "📱 STARTING RIDE HAILING MOBILE APP"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "📱 Installing Expo CLI..."
    npm install -g @expo/cli
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Expo CLI"
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps --ignore-scripts
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if .env exists, if not copy from example
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "📝 Creating .env file from template..."
        cp .env.example .env
        echo "⚠️  Please edit .env file with your configuration"
        echo "   Required: EXPO_PUBLIC_API_URL, EXPO_PUBLIC_GOOGLE_MAPS_API_KEY"
    else
        echo "⚠️  No .env file found. Creating basic configuration..."
        cat > .env << EOF
# Basic configuration for development
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_WEBSOCKET_URL=ws://localhost:3000
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
EXPO_PUBLIC_JWT_SECRET=development-secret
EOF
    fi
fi

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend is running at http://localhost:3000"
else
    echo "⚠️  Backend is not running at http://localhost:3000"
    echo "   Please start the backend first:"
    echo "   cd ../ride-hailing-backend && ./start.sh"
    echo ""
    echo "   Or update EXPO_PUBLIC_API_URL in .env to point to your backend"
    echo ""
fi

# Prompt for start mode
echo "🚀 How would you like to start the app?"
echo ""
echo "1) 📱 Tunnel mode (Recommended - works with any mobile device)"
echo "2) 🌐 Local network mode (same WiFi required)"
echo "3) 💻 Web mode (browser testing)"
echo "4) 🔧 Development mode (clear cache)"
echo ""
read -p "Choose option (1-4) [default: 1]: " choice

case $choice in
    2)
        echo "🌐 Starting in local network mode..."
        echo "📱 Make sure your mobile device is on the same WiFi"
        npx expo start
        ;;
    3)
        echo "💻 Starting in web mode..."
        echo "🌐 Opening in browser at http://localhost:19006"
        npx expo start --web
        ;;
    4)
        echo "🔧 Starting in development mode (clearing cache)..."
        npx expo start --clear
        ;;
    *)
        echo "📱 Starting in tunnel mode..."
        echo "🌐 This creates a public URL that works from anywhere"
        echo "📱 Scan the QR code with Expo Go app"
        echo ""
        npx expo start --tunnel
        ;;
esac