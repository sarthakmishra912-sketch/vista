import React from 'react';
import svgPaths from "../../imports/svg-vxqx14szee";

interface DriverPhotoConfirmationScreenProps {
  onContinue: () => void;
  userEmail?: string | null;
}

export default function DriverPhotoConfirmationScreen({
  onContinue,
  userEmail
}: DriverPhotoConfirmationScreenProps) {

  const handleOKClick = async () => {
    console.log("✅ Photo confirmation OK clicked");
    
    try {
      // TODO: Real API integration for final onboarding step
      // 1. Update driver onboarding status to "verification_pending"
      // 2. Send notification to driver about review process
      // 3. Update backend with completed onboarding timestamp
      // 4. Trigger automated document verification workflow
      
      // Example API call structure:
      // const driverId = localStorage.getItem('raahi_driver_id');
      // await driverApi.finalizeOnboarding(driverId, {
      //   step: 'photo_confirmation_completed',
      //   status: 'documents_under_review',
      //   completedAt: new Date().toISOString(),
      //   nextAction: 'await_verification',
      //   estimatedReviewTime: '24-48 hours'
      // });
      
      // await notificationApi.sendOnboardingNotification(driverId, {
      //   type: 'documents_submitted',
      //   message: 'Your documents are under review. We\'ll notify you once approved.',
      //   channels: ['email', 'sms', 'push']
      // });
      
      // Save completion status for demo purposes
      localStorage.setItem('raahi_driver_photo_confirmed', 'true');
      localStorage.setItem('raahi_driver_onboarding_status', 'documents_under_review');
      
      await onContinue();
    } catch (error) {
      console.error("Error confirming photo:", error);
    }
  };

  return (
    <div className="bg-white relative min-h-screen w-full">
      <div className="relative h-full">
        <div className="box-border flex flex-col gap-6 items-center justify-start pb-20 pt-12 px-4 relative h-full min-h-screen">

          {/* Header with Raahi branding */}
          <div 
            className="relative rounded-2xl shrink-0 w-full"
            style={{ backgroundColor: '#f6efd8' }}
          >
            <div className="flex flex-row items-center relative size-full">
              <div className="box-border flex items-center justify-center px-4 py-4 relative w-full">
                <div 
                  className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-2xl text-center text-nowrap"
                  style={{ 
                    fontFamily: 'Samarkan, sans-serif',
                    color: '#11211e'
                  }}
                >
                  <p className="leading-[normal] whitespace-pre">Raahi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Centered */}
          <div className="flex flex-col items-center justify-center flex-1 gap-6">
            
            {/* Success Checkmark Icon */}
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 bg-[#38a35f] rounded-2xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div 
              className="text-xl font-medium text-center px-6"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#080a24'
              }}
            >
              Thanks for your photo
            </div>

            {/* Subtitle */}
            <div 
              className="text-sm text-center px-6 text-[#6b7280]"
              style={{ 
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Your documents are being reviewed. We'll notify you once approved.
            </div>
          </div>

          {/* OK Button - Fixed at bottom */}
          <div className="absolute box-border flex flex-col gap-3 items-start justify-start left-0 px-4 py-4 shadow-[0px_-2px_10px_0px_rgba(0,0,0,0.1)] bottom-0 w-full bg-white">
            <button
              onClick={handleOKClick}
              className="relative rounded-2xl shrink-0 w-full py-3 px-6 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#282828' }}
            >
              <div className="flex items-center justify-center">
                <div 
                  className="text-base font-medium text-white text-center"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  OK
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}