import React, { useState, useRef } from 'react';
import { toast } from "sonner@2.0.3";

interface DriverProfilePhotoScreenProps {
  onContinue: (photoData: { profileImage: File | null }) => void;
  onBack: () => void;
  onSupport: () => void;
  userEmail?: string | null;
}

export default function DriverProfilePhotoScreen({
  onContinue,
  onBack,
  onSupport,
  userEmail
}: DriverProfilePhotoScreenProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection from input (camera or gallery)
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type - only images allowed
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file", {
          description: "Only image files (PNG, JPG, JPEG) are supported",
          duration: 3000,
        });
        return;
      }

      // Validate file size (max 10MB for profile photos)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please select an image smaller than 10MB",
          duration: 3000,
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL for immediate feedback
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast.success("Profile photo selected!", {
        description: "Review the photo and click Continue to proceed",
        duration: 2500,
      });
    }
  };

  // Handle camera/gallery button click
  const handleTakePhoto = () => {
    // Trigger file input which will open camera on mobile or file picker on desktop
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

  // Handle continue with validation and upload
  const handleContinue = async () => {
    if (!selectedImage) {
      toast.error("Please take a photo", {
        description: "A profile photo is required to continue",
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload and verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage for demo purposes
      const profilePhotoData = {
        profileImage: selectedImage,
        uploadedAt: new Date().toISOString(),
        fileName: selectedImage.name,
        fileSize: selectedImage.size,
        verificationStatus: 'pending',
        verificationSessionId: `session_${Date.now()}`,
      };
      
      const currentData = JSON.parse(localStorage.getItem('raahi_driver_profile_data') || '{}');
      const updatedData = { ...currentData, ...profilePhotoData };
      localStorage.setItem('raahi_driver_profile_data', JSON.stringify(updatedData));

      await onContinue({
        profileImage: selectedImage
      });
    } catch (error) {
      console.error("Profile photo upload error:", error);
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
        <div className="box-border flex flex-col gap-4 items-center justify-start pb-20 pt-4 px-4 relative h-full min-h-screen">
          
          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-2 rounded-full z-20 bg-white bg-opacity-80 shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#11211e" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>

          {/* Header with Raahi branding and Support */}
          <div 
            className="bg-[#f6efd8] relative rounded-2xl shrink-0 w-full"
          >
            <div className="flex flex-row items-center justify-between relative w-full px-4 py-3">
              <div 
                className="text-xl"
                style={{ 
                  fontFamily: 'Samarkan, sans-serif',
                  color: '#11211e'
                }}
              >
                Raahi
              </div>
              
              {/* Support Button */}
              <button
                onClick={handleSupportClick}
                className="bg-[#282828] flex items-center gap-2 px-3 py-2 rounded-lg"
              >
                <div 
                  className="text-sm text-white"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Support
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6 items-center justify-start flex-1 relative w-full">
            
            {/* Title */}
            <div className="w-full">
              <h1 
                className="text-2xl font-medium text-[#080a24]"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Take your profile photo
              </h1>
            </div>

            {/* Instructions */}
            <div className="w-full space-y-4">
              {/* Verification Notice */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p 
                  className="text-sm text-[#606060]"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Raahi uses Veriff to verify your profile photo. Once submitted, it can only be changed in limited circumstances.
                </p>
              </div>

              {/* Photo Guidelines */}
              <div 
                className="text-sm text-[#606060]"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <p className="font-medium mb-2">Photo requirements:</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Face the camera with eyes and mouth clearly visible</li>
                  <li>Ensure good lighting, no glare, and sharp focus</li>
                  <li>No photos of photos, filters, or alterations</li>
                </ol>
              </div>
            </div>

            {/* Photo Preview/Placeholder Area */}
            <div className="relative flex-1 flex items-center justify-center min-h-[200px]">
              {imagePreview ? (
                /* Selected Image Preview */
                <div className="relative">
                  <div 
                    className="bg-center bg-cover bg-no-repeat h-48 w-48 rounded-2xl border-2 border-green-500"
                    style={{ backgroundImage: `url('${imagePreview}')` }}
                  />
                  <button
                    onClick={handleRetakePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                /* Default Placeholder */
                <div className="h-48 w-48 rounded-2xl border-2 border-dashed border-[#d1d5db] flex items-center justify-center bg-gray-50">
                  <div className="text-center space-y-2">
                    <div className="bg-gray-200 rounded-full p-4 mx-auto w-fit">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No photo taken</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hidden file input for camera/gallery access */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            capture="user" // Use front camera for selfies
            className="hidden"
          />

          {/* Bottom Section */}
          <div className="absolute left-0 bottom-0 w-full bg-white">
            
            {/* Verification Notice */}
            <div className="bg-gray-50 p-4 border-t border-gray-100">
              <p 
                className="text-xs text-[#828282] text-center"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Veriff will verify that your photo is of a live person, taken in real-time. 
                <span className="text-[#0e6ab5] ml-1">Learn More</span>
              </p>
            </div>

            {/* Action Button */}
            <div className="p-4">
              {!selectedImage ? (
                <button
                  onClick={handleTakePhoto}
                  className="bg-[#282828] w-full py-3 px-6 rounded-2xl text-white font-medium transition-opacity hover:opacity-90"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    Take photo
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleContinue}
                  disabled={isUploading}
                  className="bg-[#38a35f] w-full py-3 px-6 rounded-2xl text-white font-medium disabled:opacity-50 transition-opacity hover:opacity-90"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isUploading && (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"></path>
                      </svg>
                    )}
                    {isUploading ? 'Uploading...' : 'Continue'}
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}