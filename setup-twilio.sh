#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   🔐 Raahi - Twilio OTP Setup Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Check if .env exists
ENV_FILE="raahi-backend/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: $ENV_FILE not found!${NC}"
    echo -e "${YELLOW}Creating from env.example...${NC}"
    cp raahi-backend/env.example "$ENV_FILE"
fi

echo -e "${GREEN}✅ Found .env file${NC}"
echo ""

# Check if Twilio is already configured
if grep -q "TWILIO_ACCOUNT_SID=\"AC" "$ENV_FILE"; then
    echo -e "${GREEN}✅ Twilio credentials already configured!${NC}"
    echo ""
    echo -e "${YELLOW}Do you want to update them? (y/n)${NC}"
    read -r UPDATE
    if [ "$UPDATE" != "y" ]; then
        echo -e "${BLUE}Skipping Twilio configuration...${NC}"
        exit 0
    fi
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 Step 1: Get Twilio Credentials${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Go to: https://www.twilio.com/try-twilio"
echo "2. Sign up for a free account (gets \$15 credit)"
echo "3. Get your credentials from: https://console.twilio.com/"
echo ""
echo -e "${YELLOW}Press Enter when ready to continue...${NC}"
read -r

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 Step 2: Enter Your Twilio Credentials${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Get Account SID
echo -e "${YELLOW}Enter your Twilio Account SID (starts with AC):${NC}"
read -r ACCOUNT_SID

# Get Auth Token
echo -e "${YELLOW}Enter your Twilio Auth Token:${NC}"
read -r AUTH_TOKEN

# Get Phone Number
echo -e "${YELLOW}Enter your Twilio Phone Number (with country code, e.g., +1234567890):${NC}"
read -r PHONE_NUMBER

# Validate inputs
if [ -z "$ACCOUNT_SID" ] || [ -z "$AUTH_TOKEN" ] || [ -z "$PHONE_NUMBER" ]; then
    echo -e "${RED}❌ Error: All fields are required!${NC}"
    exit 1
fi

if [[ ! $ACCOUNT_SID == AC* ]]; then
    echo -e "${YELLOW}⚠️  Warning: Account SID should start with 'AC'${NC}"
fi

if [[ ! $PHONE_NUMBER == +* ]]; then
    echo -e "${YELLOW}⚠️  Warning: Phone number should start with '+'${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}💾 Step 3: Updating .env file${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Update or add Twilio configuration
sed -i.backup "s|TWILIO_ACCOUNT_SID=.*|TWILIO_ACCOUNT_SID=\"$ACCOUNT_SID\"|" "$ENV_FILE"
sed -i.backup "s|TWILIO_AUTH_TOKEN=.*|TWILIO_AUTH_TOKEN=\"$AUTH_TOKEN\"|" "$ENV_FILE"
sed -i.backup "s|TWILIO_PHONE_NUMBER=.*|TWILIO_PHONE_NUMBER=\"$PHONE_NUMBER\"|" "$ENV_FILE"

# Change NODE_ENV to development
sed -i.backup 's|NODE_ENV="test"|NODE_ENV="development"|' "$ENV_FILE"

echo -e "${GREEN}✅ Configuration updated successfully!${NC}"
echo ""

# Show configuration
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 Your Configuration:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Account SID: $ACCOUNT_SID"
echo "Auth Token: ${AUTH_TOKEN:0:8}..." # Show only first 8 chars for security
echo "Phone Number: $PHONE_NUMBER"
echo ""

# Clean up backup files
rm -f "$ENV_FILE.backup"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🚀 Step 4: Start Backend Server${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Run these commands:"
echo ""
echo -e "${GREEN}cd raahi-backend${NC}"
echo -e "${GREEN}npm install${NC}"
echo -e "${GREEN}npm run dev${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📚 For detailed instructions, see: TWILIO_OTP_SETUP.md${NC}"
echo ""
echo -e "${YELLOW}💡 Testing without Twilio:${NC}"
echo "   - OTPs will be printed in the backend console"
echo "   - Look for: 'OTP for +XXXXXXXXXXX: 123456'"
echo ""
echo -e "${YELLOW}🎉 Ready to test:${NC}"
echo "   1. Open: http://localhost:3000/auto-clear.html"
echo "   2. Click 'Find a Ride Now'"
echo "   3. Click 'Login with Mobile OTP'"
echo "   4. Enter phone number and OTP"
echo ""

echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""



