// Test script to demonstrate API call logging for ride creation
const API_BASE_URL = 'http://localhost:5001/api';

async function testRideCreation() {
  console.log('🚀 Starting ride creation test...\n');
  
  const rideData = {
    pickupLat: 28.6139,
    pickupLng: 77.2090,
    dropLat: 28.5355,
    dropLng: 77.3910,
    pickupAddress: "Connaught Place, New Delhi",
    dropAddress: "India Gate, New Delhi",
    paymentMethod: "CASH",
    vehicleType: "SEDAN"
  };

  console.log('📋 Ride Data:', JSON.stringify(rideData, null, 2));
  console.log('\n🔄 Making API call to create ride...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/rides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(rideData)
    });

    const result = await response.json();
    
    console.log('📊 API Response:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.status === 401) {
      console.log('\n✅ Expected authentication error - this demonstrates the logging is working!');
      console.log('Check the backend logs to see the detailed API call logging.');
    }
    
  } catch (error) {
    console.error('❌ Error making API call:', error.message);
  }
}

// Run the test
testRideCreation();

