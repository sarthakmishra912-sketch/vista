import React from 'react';

// Simple test component to simulate verification failure
export default function TestVerificationFailure() {
  
  const simulateRCFailure = () => {
    console.log("🔴 Simulating RC verification failure...");
    
    // Create test failed documents
    const failedDocuments = [
      {
        id: 'rcCertificate',
        title: 'Registration Certificate (RC)',
        reason: "We couldn't verify your vehicle insurance",
        description: "We weren't able to automatically access your vehicle insurance. please take a photo fo your document so we can review it."
      }
    ];
    
    // Save to localStorage to simulate real API failure
    localStorage.setItem('raahi_driver_failed_documents', JSON.stringify(failedDocuments));
    
    // Redirect to verification failure screen (in a real app this would be handled by the parent)
    console.log("🔄 Redirecting to verification failure screen...");
    
    // For testing purposes, directly manipulate the URL or use a callback
    if (window.location.hash) {
      window.location.hash = '#driver-document-verification-failure';
    } else {
      alert('Verification failure simulated! Check localStorage for raahi_driver_failed_documents');
      // Force reload to trigger document upload screen with failed documents
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>🧪 Test Document Verification Failure</h3>
      <p>Click the button below to simulate an RC document verification failure:</p>
      <button 
        onClick={simulateRCFailure}
        style={{
          padding: '10px 20px',
          backgroundColor: '#d14544',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        🔴 Simulate RC Verification Failure
      </button>
    </div>
  );
}