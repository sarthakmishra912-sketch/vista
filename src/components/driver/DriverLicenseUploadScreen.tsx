import React, { useState, useRef } from 'react';
import { toast } from "sonner";

interface DriverLicenseUploadScreenProps {
  onContinue: (licenseData: { frontImage: File | null }) => void;
  onBack: () => void;
  onSupport: () => void;
  userEmail?: string | null;
}

export default function DriverLicenseUploadScreen({
  onContinue,
  onBack,
  onSupport,
  userEmail
}: DriverLicenseUploadScreenProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection from input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file", {
          description: "Only image files (PNG, JPG, JPEG) are supported",
          duration: 3000,
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please select an image smaller than 10MB",
          duration: 3000,
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast.success("License image selected!", {
        description: "Review the image and click Continue to proceed",
        duration: 2500,
      });
    }
  };

  // Handle camera/gallery button click
  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  // Handle support click
  const handleSupportClick = async () => {
    try {
      await onSupport();
    } catch (error) {
      console.error("Support error:", error);
    }
  };

  // Handle continue with validation
  const handleContinue = async () => {
    if (!selectedImage) {
      toast.error("Please select an image", {
        description: "Take a photo or select an image of your driving license",
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demo purposes
      const licenseData = {
        frontImage: selectedImage,
        uploadedAt: new Date().toISOString(),
        fileName: selectedImage.name,
        fileSize: selectedImage.size
      };
      
      localStorage.setItem('raahi_driver_license_data', JSON.stringify(licenseData));

      await onContinue({
        frontImage: selectedImage
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle retake photo
  const handleRetakePhoto = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white relative min-h-screen w-full">
      <div className="relative h-full">
        <div className="box-border flex flex-col gap-6 items-start justify-start pb-20 pt-12 px-4 relative h-full min-h-screen">
          
          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-1.5 rounded-full z-20"
            style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#11211e" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>

          {/* Header with Raahi branding and Support */}
          <div 
            className="relative rounded-2xl shrink-0 w-full"
            style={{ backgroundColor: '#f6efd8' }}
          >
            <div className="flex flex-row items-center relative size-full">
              <div className="box-border flex items-center justify-between px-4 py-4 relative w-full">
                <div 
                  className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-2xl text-center text-nowrap"
                  style={{ 
                    fontFamily: 'Samarkan, sans-serif',
                    color: '#11211e'
                  }}
                >
                  <p className="leading-[normal] whitespace-pre">Raahi</p>
                </div>
                
                {/* Support Button */}
                <button
                  onClick={handleSupportClick}
                  className="box-border flex gap-1.5 h-8 items-center justify-center px-3 py-2 relative rounded-lg shrink-0"
                  style={{ backgroundColor: '#282828' }}
                >
                  <div 
                    className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-sm text-nowrap"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '500',
                      color: 'white'
                    }}
                  >
                    <p className="leading-[normal] whitespace-pre">Support</p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-4 items-start justify-start relative shrink-0 w-full">
            
            {/* Title Section */}
            <div className="relative shrink-0 w-full px-2">
              <div 
                className="relative shrink-0 w-full text-xl font-medium mb-1"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#080a24'
                }}
              >
                Upload your Driving License
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="relative shrink-0 w-full">
              <div 
                className={`bg-white relative rounded-2xl shrink-0 w-full border-2 border-dashed ${
                  selectedImage ? 'border-[#38a35f]' : 'border-[#d1d5db]'
                } transition-colors`}
              >
                <div className="relative size-full">
                  <div className="box-border flex flex-col gap-4 items-center justify-center p-6 relative w-full min-h-[240px]">
                    
                    {imagePreview ? (
                      /* Image Preview */
                      <div className="relative w-full max-w-sm">
                        <img 
                          src={imagePreview} 
                          alt="License preview"
                          className="w-full h-auto rounded-xl object-cover border border-[#e5e5e5]"
                        />
                        <button
                          onClick={handleRetakePhoto}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      /* Placeholder */
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-16 h-16 bg-[#f3f4f6] rounded-xl flex items-center justify-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="9" cy="9" r="2"/>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                          </svg>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div 
                            className="text-base font-medium text-[#374151]"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            Upload your driving license
                          </div>
                          <div 
                            className="text-sm text-[#6b7280]"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            Tap to take photo or select from gallery
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="relative shrink-0 w-full px-2">
              <div 
                className="text-sm text-[#6b7280] leading-relaxed"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Please take a clear photo of your driver's license. Make sure all information is readable, not blurry and that all corners of the document are visible.
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            capture="environment" // Use back camera on mobile
            className="hidden"
          />

          {/* Action Buttons - Fixed at bottom */}
          <div className="absolute box-border flex flex-col gap-3 items-start justify-start left-0 px-4 py-4 shadow-[0px_-2px_10px_0px_rgba(0,0,0,0.1)] bottom-0 w-full bg-white">
            
            {/* Take Photo Button */}
            {!selectedImage && (
              <button
                onClick={handleTakePhoto}
                className="relative rounded-2xl shrink-0 w-full py-3 px-6 transition-opacity"
                style={{ backgroundColor: '#282828' }}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <div 
                    className="text-base font-medium text-white text-center"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Take photo
                  </div>
                </div>
              </button>
            )}

            {/* Continue Button */}
            {selectedImage && (
              <button
                onClick={handleContinue}
                disabled={isUploading}
                className="relative rounded-2xl shrink-0 w-full py-3 px-6 disabled:opacity-50 transition-opacity"
                style={{ backgroundColor: '#38a35f' }}
              >
                <div className="flex items-center justify-center gap-2">
                  {isUploading && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"></path>
                    </svg>
                  )}
                  <div 
                    className="text-base font-medium text-white text-center"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {isUploading ? 'Uploading...' : 'Continue'}
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}