#!/bin/bash

# Setup Test Drivers Script
# Creates two test drivers for testing driver login functionality

echo "🚀 Setting up test drivers for Raahi..."
echo ""

# Check if backend is running
BACKEND_RUNNING=$(lsof -ti:5001)
if [ ! -z "$BACKEND_RUNNING" ]; then
    echo "⚠️  Backend is running on port 5001"
    echo "   The script will work, but you may need to restart backend after."
    echo ""
fi

# Check NODE_ENV
cd raahi-backend
NODE_ENV=$(grep NODE_ENV .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")

if [ "$NODE_ENV" != "development" ]; then
    echo "⚠️  NODE_ENV is not set to 'development'"
    echo "   Current value: $NODE_ENV"
    echo ""
    echo "   Setting NODE_ENV to development..."
    
    # Update NODE_ENV in .env
    if grep -q "NODE_ENV=" .env; then
        # Replace existing NODE_ENV
        sed -i.bak 's/NODE_ENV=.*/NODE_ENV="development"/' .env
        echo "   ✅ Updated NODE_ENV to development"
    else
        # Add NODE_ENV if not exists
        echo 'NODE_ENV="development"' >> .env
        echo "   ✅ Added NODE_ENV=development"
    fi
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run the script
echo "🔧 Running database setup script..."
echo ""

npx ts-node scripts/setup-test-drivers.ts

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ SUCCESS! Test drivers created!"
    echo "=========================================="
    echo ""
    echo "📱 Test Login Instructions:"
    echo ""
    echo "1. Open: http://localhost:3000"
    echo "2. Click: 'Open Driver's App'"
    echo "3. Choose: 'Login with Mobile OTP'"
    echo ""
    echo "🚗 VERIFIED DRIVER:"
    echo "   Phone: +919876543210"
    echo "   OTP: 123456 (or any 6 digits)"
    echo "   Expected: Driver Dashboard (Go online)"
    echo ""
    echo "🆕 FRESH DRIVER:"
    echo "   Phone: +919876543211"
    echo "   OTP: 123456 (or any 6 digits)"
    echo "   Expected: Driver Onboarding"
    echo ""
    echo "💡 Note: Make sure both frontend (port 3000)"
    echo "         and backend (port 5001) are running!"
    echo ""
else
    echo ""
    echo "❌ Failed to create test drivers"
    echo "   Check the error messages above"
    echo ""
    exit 1
fi



