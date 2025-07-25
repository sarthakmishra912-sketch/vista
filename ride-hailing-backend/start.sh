#!/bin/bash

# 🚗 Ride Hailing Backend - Quick Start Script

echo "🚗 STARTING RIDE HAILING BACKEND API"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
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
        echo "   Required: JWT_SECRET, GOOGLE_MAPS_API_KEY"
    else
        echo "⚠️  No .env file found. Creating basic configuration..."
        cat > .env << EOF
# Basic configuration for development
PORT=3000
NODE_ENV=development
JWT_SECRET=development-secret-change-in-production
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
ALLOWED_ORIGINS=http://localhost:19006,exp://localhost:19000
EOF
    fi
fi

# Start the server
echo "🚀 Starting backend server..."
echo "📍 API will be available at: http://localhost:3000"
echo "📋 Health check: http://localhost:3000/health"
echo "🔗 API endpoints: http://localhost:3000/api/*"
echo ""
echo "💡 For mobile app development:"
echo "   - Mobile app should use: http://localhost:3000/api"
echo "   - Use tunnel mode: npx expo start --tunnel"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start development server (in-memory database)
npm run start:simple