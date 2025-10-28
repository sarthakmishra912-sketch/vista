#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   🧪 Raahi - OTP API Test Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

API_URL="http://localhost:5001/api"

# Check if backend is running
echo -e "${YELLOW}Checking if backend is running...${NC}"
if ! curl -s "$API_URL/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend is not running on port 5001${NC}"
    echo -e "${YELLOW}Start it with:${NC} cd raahi-backend && npm run dev"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running${NC}"
echo ""

# Get phone number
echo -e "${YELLOW}Enter phone number (without country code, e.g., 9876543210):${NC}"
read -r PHONE

if [ -z "$PHONE" ]; then
    echo -e "${RED}❌ Phone number is required${NC}"
    exit 1
fi

# Send OTP
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📤 Step 1: Sending OTP to +91$PHONE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

SEND_RESPONSE=$(curl -s -X POST "$API_URL/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$PHONE\",\"countryCode\":\"+91\"}")

echo "Response: $SEND_RESPONSE"
echo ""

if echo "$SEND_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ OTP sent successfully!${NC}"
    echo ""
    echo -e "${YELLOW}💡 Check the backend console for the OTP (in development mode)${NC}"
    echo -e "${YELLOW}   It will show: OTP for +91$PHONE: XXXXXX${NC}"
else
    echo -e "${RED}❌ Failed to send OTP${NC}"
    exit 1
fi

# Get OTP from user
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📥 Step 2: Enter the OTP you received:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
read -r OTP

if [ -z "$OTP" ]; then
    echo -e "${RED}❌ OTP is required${NC}"
    exit 1
fi

# Verify OTP
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔍 Step 3: Verifying OTP${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

VERIFY_RESPONSE=$(curl -s -X POST "$API_URL/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$PHONE\",\"otp\":\"$OTP\",\"countryCode\":\"+91\"}")

echo "Response:"
echo "$VERIFY_RESPONSE" | jq '.' 2>/dev/null || echo "$VERIFY_RESPONSE"
echo ""

if echo "$VERIFY_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ OTP verified successfully!${NC}"
    echo ""
    
    # Extract tokens
    ACCESS_TOKEN=$(echo "$VERIFY_RESPONSE" | jq -r '.data.tokens.accessToken' 2>/dev/null)
    
    if [ "$ACCESS_TOKEN" != "null" ] && [ -n "$ACCESS_TOKEN" ]; then
        echo -e "${GREEN}🎉 Authentication successful!${NC}"
        echo ""
        echo -e "${YELLOW}Access Token (first 50 chars):${NC}"
        echo "${ACCESS_TOKEN:0:50}..."
        echo ""
        echo -e "${YELLOW}You can now use this token to make authenticated requests:${NC}"
        echo -e "${BLUE}curl -H \"Authorization: Bearer \$ACCESS_TOKEN\" $API_URL/auth/me${NC}"
    fi
else
    echo -e "${RED}❌ OTP verification failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Test Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""



