import React from 'react';

interface DriverLocationSelectionModalProps {
  isVisible: boolean;
  currentLocation: string;
  onLocationSelect: (location: string) => void;
  onClose: () => void;
}

export default function DriverLocationSelectionModal({
  isVisible,
  currentLocation,
  onLocationSelect,
  onClose
}: DriverLocationSelectionModalProps) {

  const locations = [
    'Delhi (NCR)',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara'
  ];

  const handleLocationClick = (location: string) => {
    onLocationSelect(location);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div 
            className="text-lg font-medium"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              color: '#080a24'
            }}
          >
            Select Location
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#080a24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => handleLocationClick(location)}
              className={`w-full px-4 py-3 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                location === currentLocation ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="text-base"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    color: '#080a24'
                  }}
                >
                  {location}
                </div>
                {location === currentLocation && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38a35f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div 
            className="text-xs text-center"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              color: '#888'
            }}
          >
            Select the city where you want to drive and earn with Raahi
          </div>
        </div>
      </div>
    </div>
  );
}