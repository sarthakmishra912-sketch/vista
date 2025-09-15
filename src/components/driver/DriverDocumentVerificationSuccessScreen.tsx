import React, { useState, useRef, useEffect } from 'react';

interface DriverDocumentVerificationSuccessScreenProps {
  onStartEarning: () => void;
  userEmail?: string | null;
}

export default function DriverDocumentVerificationSuccessScreen({
  onStartEarning,
  userEmail
}: DriverDocumentVerificationSuccessScreenProps) {
  const [isSliding, setIsSliding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [showNameste, setShowNameste] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const SLIDE_THRESHOLD = 0.7; // 70% of slider width to trigger start earning
  const CIRCLE_SIZE = 50; // Size of the draggable circle

  console.log("🎉 Rendering Driver Document Verification Success Screen for:", userEmail);
  
  useEffect(() => {
    if (sliderRef.current) {
      // Account for padding on both sides: 10px left + 10px right = 20px total
      const padding = 20;
      setSliderWidth(sliderRef.current.offsetWidth - CIRCLE_SIZE - padding);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isSliding) return;
    
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const leftPadding = 10;
    const rawPosition = e.clientX - rect.left - leftPadding - CIRCLE_SIZE / 2;
    const newPosition = Math.max(0, Math.min(sliderWidth, rawPosition));
    setDragPosition(newPosition);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || isSliding) return;
    
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const touch = e.touches[0];
    const leftPadding = 10;
    const rawPosition = touch.clientX - rect.left - leftPadding - CIRCLE_SIZE / 2;
    const newPosition = Math.max(0, Math.min(sliderWidth, rawPosition));
    setDragPosition(newPosition);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Check if user dragged far enough
    if (dragPosition >= sliderWidth * SLIDE_THRESHOLD) {
      // Success - trigger start earning
      setIsSliding(true);
      setDragPosition(sliderWidth); // Snap to end
      setShowNameste(true); // Show Namaste text
      
      setTimeout(() => {
        onStartEarning();
        // Reset after start earning
        setTimeout(() => {
          setIsSliding(false);
          setDragPosition(0);
          setShowNameste(false);
        }, 500);
      }, 1000);
    } else {
      // Snap back to start
      setDragPosition(0);
    }
  };

  // Global event listeners for mouse/touch
  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
      const handleTouchMoveGlobal = (e: TouchEvent) => handleTouchMove(e);
      
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMoveGlobal);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, dragPosition, sliderWidth]);

  const handleStartEarning = () => {
    console.log("🚀 Start Earning button clicked (fallback)");
    
    // Show the "Namaste!" animation
    setShowNameste(true);
    
    // Wait a moment to show the animation, then call the callback
    setTimeout(() => {
      onStartEarning();
    }, 1000);
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col gap-6 p-4 pt-8">

          {/* Header with Raahi branding */}
          <div 
            className="rounded-2xl w-full py-4 px-4"
            style={{ backgroundColor: '#f6efd8' }}
          >
            <div 
              className="text-2xl text-center"
              style={{ 
                fontFamily: 'Samarkan, sans-serif',
                color: '#11211e'
              }}
            >
              Raahi
            </div>
          </div>

          {/* Congratulations Section */}
          <div className="flex flex-col items-center gap-4 text-center py-6">
            <div className="text-5xl">🎉</div>
            <div 
              className="text-3xl font-medium"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#282828'
              }}
            >
              Congratulations!
            </div>
            <div 
              className="text-base leading-relaxed px-4"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#282828'
              }}
            >
              Decide when, where and how you want to earn using the service below.
            </div>
          </div>

          {/* New Service Badge */}
          <div className="flex justify-center">
            <div 
              className="bg-white border-2 border-[#263d38] rounded-full px-5 py-2"
            >
              <div 
                className="text-sm font-bold"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#353535'
                }}
              >
                New Service
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="flex flex-col gap-6">
            {/* Rescue Ride - Featured */}
            <div className="bg-white border border-[#575757] rounded-xl p-4">
              <div className="bg-gradient-to-r from-[#2a926a] to-[#4ade80] rounded-xl p-4 mb-3">
                <div className="flex items-center justify-center gap-3 text-white">
                  <span className="text-lg">⭐</span>
                  <span 
                    className="text-xl font-medium"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Rescue Ride
                  </span>
                  <span className="text-lg">⭐</span>
                </div>
              </div>
              <div className="px-2">
                <div 
                  className="text-base"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    color: '#000'
                  }}
                >
                  • Earn 20% Extra with Rescues
                </div>
              </div>
            </div>

            {/* Commercial Trips */}
            <div className="bg-[#353535] rounded-xl p-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-lg">🚗</span>
                <span 
                  className="text-lg font-medium"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Commercial Trips
                </span>
              </div>
            </div>

            {/* Independent Drivers */}
            <div className="bg-[#2e7d9a] rounded-xl p-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-lg">👤</span>
                <span 
                  className="text-lg font-medium"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Independent Drivers
                </span>
              </div>
            </div>
          </div>

          {/* Tips Link */}
          <div className="text-center py-4">
            <div 
              className="text-lg underline"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#353330'
              }}
            >
              Want earning tips and hacks?
            </div>
          </div>

          {/* Start Earning Slider */}
          <div className="px-4 pb-4">
            <div className="bg-white shadow-lg rounded-lg p-3">
              <div 
                ref={sliderRef}
                className="bg-[#2e2c2a] rounded-lg h-[60px] w-full relative overflow-hidden select-none"
              >
                {/* Background text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-16">
                  <span 
                    className="text-white font-medium text-lg text-center"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {isSliding ? 'Starting...' : 'Slide to Start Earning'}
                  </span>
                </div>
                
                {/* Draggable circle */}
                <div 
                  className={`absolute top-[5px] bg-white rounded-lg shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
                    isDragging ? 'scale-110' : 'scale-100'
                  } ${isSliding ? 'cursor-not-allowed' : ''}`}
                  style={{ 
                    left: `${10 + dragPosition}px`,
                    width: `${CIRCLE_SIZE}px`,
                    height: `${CIRCLE_SIZE}px`,
                    transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  {/* Earnings Icon */}
                  <div 
                    className="bg-[#2a926a] rounded-lg p-1 shadow-lg flex items-center justify-center"
                    style={{
                      width: '30px',
                      height: '30px'
                    }}
                  >
                    <div 
                      className="text-white text-lg font-medium"
                      style={{ fontFamily: 'SF Pro, sans-serif' }}
                    >
                      ₹
                    </div>
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div 
                  className="absolute top-0 left-0 h-full bg-[#2a926a] rounded-lg transition-all duration-200 opacity-30"
                  style={{ 
                    width: `${Math.max(0, (dragPosition / sliderWidth) * 100)}%`
                  }}
                />
                
                {/* Namaste Container - shows when sliding is complete */}
                <div 
                  className="absolute top-[5px] left-[60px] bg-white border-2 border-[#7e7e7e] rounded-lg px-2 py-1 transition-all duration-500 ease-in-out flex items-center justify-center"
                  style={{
                    width: '70px',
                    height: '50px',
                    opacity: showNameste ? 1 : 0,
                    transform: showNameste ? 'scale(1)' : 'scale(0.8)'
                  }}
                >
                  <div 
                    className="text-xs font-normal"
                    style={{ 
                      fontFamily: 'Samarkan, sans-serif',
                      color: '#303030'
                    }}
                  >
                    Namaste!
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}