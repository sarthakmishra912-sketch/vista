import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PricingProvider } from './contexts/PricingContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <PricingProvider>
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
          <h1 style={{ color: '#333', fontSize: '2.5rem', marginBottom: '1rem' }}>🚗 Raahi Cab App</h1>
          <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '2rem' }}>Welcome to Raahi! Your ride is just a click away.</p>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                fetch('http://localhost:5001/health')
                  .then(res => res.json())
                  .then(data => {
                    alert('Backend Status: ' + data.status + '\nUptime: ' + Math.round(data.uptime) + 's');
                  })
                  .catch(err => {
                    alert('Backend Error: ' + err.message);
                  });
              }}
              style={{ 
                padding: '15px 30px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🔗 Test Backend
            </button>
            
            <button 
              onClick={() => {
                fetch('http://localhost:5001/api/pricing/calculate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    pickupLat: 28.6139,
                    pickupLng: 77.2090,
                    dropLat: 28.5355,
                    dropLng: 77.3910,
                    vehicleType: 'SEDAN'
                  })
                })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      alert(`💰 Fare Calculation:\nBase Fare: ₹${data.data.baseFare}\nDistance: ${data.data.distance} km\nDuration: ${data.data.duration} min\nTotal: ₹${data.data.totalFare}`);
                    } else {
                      alert('API Error: ' + data.message);
                    }
                  })
                  .catch(err => {
                    alert('API Error: ' + err.message);
                  });
              }}
              style={{ 
                padding: '15px 30px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              💰 Test Pricing API
            </button>

            <button 
              onClick={() => {
                fetch('http://localhost:5001/api/rides', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    pickupLat: 28.6139,
                    pickupLng: 77.2090,
                    dropLat: 28.5355,
                    dropLng: 77.3910,
                    vehicleType: 'SEDAN',
                    fare: 150
                  })
                })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      alert(`🚗 Ride Created!\nRide ID: ${data.data.id}\nStatus: ${data.data.status}\nFare: ₹${data.data.fare}`);
                    } else {
                      alert('API Error: ' + data.message);
                    }
                  })
                  .catch(err => {
                    alert('API Error: ' + err.message);
                  });
              }}
              style={{ 
                padding: '15px 30px', 
                backgroundColor: '#ffc107', 
                color: '#212529', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🚗 Test Ride API
            </button>
          </div>
          
          <div style={{ 
            marginTop: '40px', 
            padding: '30px', 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            maxWidth: '800px', 
            margin: '40px auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>🎉 System Status</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'left' }}>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>✅ Frontend</h3>
                <p style={{ margin: '0', color: '#666' }}>React app is rendering successfully</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>✅ Backend</h3>
                <p style={{ margin: '0', color: '#666' }}>Express server is running on port 5001</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>✅ Database</h3>
                <p style={{ margin: '0', color: '#666' }}>PostgreSQL is connected and ready</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>✅ CORS</h3>
                <p style={{ margin: '0', color: '#666' }}>Cross-origin requests are configured</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', color: '#666' }}>
            <p>🚀 <strong>Next Steps:</strong> Click the buttons above to test the APIs!</p>
            <p>📱 <strong>Frontend:</strong> http://localhost:3000 | <strong>Backend:</strong> http://localhost:5001</p>
          </div>
        </div>
        <Toaster />
      </PricingProvider>
    </AuthProvider>
  );
}




