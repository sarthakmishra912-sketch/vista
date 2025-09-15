import React, { useState, useRef } from 'react';
import DriverLocationSelectionModal from './DriverLocationSelectionModal';

interface DocumentUploadData {
  file: File | null;
  uploaded: boolean;
  status: 'pending' | 'uploaded' | 'verified' | 'failed';
}

interface DriverDocumentUploadScreenProps {
  onNext: (uploadedDocuments: any) => void;
  onSupport: () => void;
  userEmail?: string | null;
}

export default function DriverDocumentUploadScreen({
  onNext,
  onSupport,
  userEmail
}: DriverDocumentUploadScreenProps) {
  
  // Function to initialize document states from localStorage (only legitimate uploads)
  const initializeDocumentStates = () => {
    try {
      // Check for documents that have been truly uploaded with file data
      const existingDocuments = JSON.parse(localStorage.getItem('raahi_driver_documents') || '{}');
      const licenseInfo = JSON.parse(localStorage.getItem('raahi_driver_license_info') || '{}');
      const profilePhotoInfo = JSON.parse(localStorage.getItem('raahi_driver_profile_photo_info') || '{}');
      
      // More stringent check - document must have actual file data or be uploaded in current session
      const isActuallyUploaded = (doc: any) => {
        return doc && 
               doc.status === 'uploaded' && 
               doc.uploadedAt && 
               doc.fileName && 
               doc.fileSize > 0 && // Must have actual file size
               // Only consider uploaded if it was in the last 24 hours (current session)
               (new Date().getTime() - new Date(doc.uploadedAt).getTime()) < 24 * 60 * 60 * 1000;
      };
      
      // For license, only consider uploaded if it has proper file data
      const isLicenseActuallyUploaded = licenseInfo.frontImageName && 
                                       licenseInfo.frontImageSize && 
                                       licenseInfo.uploadedAt &&
                                       (new Date().getTime() - new Date(licenseInfo.uploadedAt).getTime()) < 24 * 60 * 60 * 1000;
      
      // For profile photo, check if it was uploaded in the earlier profile photo step
      const isProfilePhotoActuallyUploaded = profilePhotoInfo.profileImageName && 
                                            profilePhotoInfo.profileImageSize && 
                                            profilePhotoInfo.uploadedAt &&
                                            profilePhotoInfo.profileImageSize > 0 &&
                                            (new Date().getTime() - new Date(profilePhotoInfo.uploadedAt).getTime()) < 24 * 60 * 60 * 1000;
      
      console.log('📋 Document verification:', {
        existingDocuments,
        licenseInfo,
        profilePhotoInfo,
        isLicenseActuallyUploaded,
        isProfilePhotoActuallyUploaded
      });
      
      // Start with all documents as pending - only mark as uploaded if they have real file data
      return {
        drivingLicense: isLicenseActuallyUploaded || isActuallyUploaded(existingDocuments.drivingLicense) ? 
          { file: null, uploaded: true, status: 'uploaded' as const } :
          { file: null, uploaded: false, status: 'pending' as const },
        panCard: isActuallyUploaded(existingDocuments.panCard) ? 
          { file: null, uploaded: true, status: 'uploaded' as const } :
          { file: null, uploaded: false, status: 'pending' as const },
        rcCertificate: isActuallyUploaded(existingDocuments.rcCertificate) ? 
          { file: null, uploaded: true, status: 'uploaded' as const } :
          { file: null, uploaded: false, status: 'pending' as const },
        aadhaarCard: isActuallyUploaded(existingDocuments.aadhaarCard) ? 
          { file: null, uploaded: true, status: 'uploaded' as const } :
          { file: null, uploaded: false, status: 'pending' as const },
        profilePhoto: isProfilePhotoActuallyUploaded || isActuallyUploaded(existingDocuments.profilePhoto) ? 
          { file: null, uploaded: true, status: 'uploaded' as const } :
          { file: null, uploaded: false, status: 'pending' as const }
      };
    } catch (error) {
      console.error('Error initializing document states:', error);
      // Return default pending state if there's an error
      return {
        drivingLicense: { file: null, uploaded: false, status: 'pending' as const },
        panCard: { file: null, uploaded: false, status: 'pending' as const },
        rcCertificate: { file: null, uploaded: false, status: 'pending' as const },
        aadhaarCard: { file: null, uploaded: false, status: 'pending' as const },
        profilePhoto: { file: null, uploaded: false, status: 'pending' as const }
      };
    }
  };

  // Document upload states
  const [documents, setDocuments] = useState(() => {
    try {
      const initialState = initializeDocumentStates();
      console.log('📋 Initial document states:', initialState);
      return initialState;
    } catch (error) {
      console.error('Error initializing documents state:', error);
      return {
        drivingLicense: { file: null, uploaded: false, status: 'pending' as const },
        panCard: { file: null, uploaded: false, status: 'pending' as const },
        rcCertificate: { file: null, uploaded: false, status: 'pending' as const },
        aadhaarCard: { file: null, uploaded: false, status: 'pending' as const },
        profilePhoto: { file: null, uploaded: false, status: 'pending' as const }
      };
    }
  });

  // Debug logging
  React.useEffect(() => {
    console.log('🏗️ DriverDocumentUploadScreen mounted');
    
    // ❌ REMOVED: Failed documents handling - verification failure functionality removed
    
    return () => {
      console.log('🏗️ DriverDocumentUploadScreen unmounted');
    };
  }, []);

  const [selectedLocation, setSelectedLocation] = useState('Delhi (NCR)');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  
  // File input refs
  const drivingLicenseRef = useRef<HTMLInputElement>(null);
  const panCardRef = useRef<HTMLInputElement>(null);
  const rcCertificateRef = useRef<HTMLInputElement>(null);
  const aadhaarCardRef = useRef<HTMLInputElement>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);

  // Helper function to get document name
  const getDocumentName = (documentId: string, fileName?: string) => {
    try {
      if (fileName) {
        return `Uploaded: ${fileName}`;
      }
      
      // Check localStorage for existing document name
      const existingDocuments = JSON.parse(localStorage.getItem('raahi_driver_documents') || '{}');
      const doc = existingDocuments[documentId];
      
      if (doc && doc.fileName) {
        return `Uploaded: ${doc.fileName}`;
      }
      
      // Special check for driving license from separate storage
      if (documentId === 'drivingLicense') {
        const licenseInfo = JSON.parse(localStorage.getItem('raahi_driver_license_info') || '{}');
        if (licenseInfo.frontImageName) {
          return `Uploaded: ${licenseInfo.frontImageName}`;
        }
      }
      
      // Special check for profile photo from separate storage (from earlier onboarding step)
      if (documentId === 'profilePhoto') {
        const profilePhotoInfo = JSON.parse(localStorage.getItem('raahi_driver_profile_photo_info') || '{}');
        if (profilePhotoInfo.profileImageName) {
          return `Uploaded: ${profilePhotoInfo.profileImageName}`;
        }
      }
      
      // Default names for different document types
      const defaultNames = {
        'profilePhoto': 'Uploaded: Profile selfie',
        'drivingLicense': 'Uploaded: License document',
        'panCard': 'Uploaded: PAN card',
        'rcCertificate': 'Uploaded: RC certificate',
        'aadhaarCard': 'Uploaded: Aadhaar card'
      };
      
      return defaultNames[documentId as keyof typeof defaultNames] || 'Document uploaded successfully';
    } catch (error) {
      console.error('Error getting document name:', error);
      return 'Document uploaded successfully';
    }
  };

  // Document configuration
  const documentConfig = [
    {
      id: 'drivingLicense',
      title: 'Driving License',
      description: 'Clear photo of your driving license',
      ref: drivingLicenseRef,
      required: true
    },
    {
      id: 'panCard',
      title: 'PAN Card',
      description: 'Clear photo of your PAN card',
      ref: panCardRef,
      required: true
    },
    {
      id: 'rcCertificate',
      title: 'Registration Certificate (RC)',
      description: 'Vehicle registration certificate',
      ref: rcCertificateRef,
      required: true
    },
    {
      id: 'aadhaarCard',
      title: 'Aadhaar Card',
      description: 'Clear photo of your Aadhaar card',
      ref: aadhaarCardRef,
      required: true
    },
    {
      id: 'profilePhoto',
      title: 'Profile Photo',
      description: 'Clear selfie photo for verification',
      ref: profilePhotoRef,
      required: true,
      accept: 'image/*',
      capture: 'user'
    }
  ];

  const handleDocumentClick = (documentId: keyof typeof documents) => {
    console.log(`📋 ${documentId} document upload clicked`);
    
    try {
      const config = documentConfig.find(doc => doc.id === documentId);
      if (config?.ref.current) {
        // Reset the input value to allow selecting the same file again
        config.ref.current.value = '';
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          config.ref.current?.click();
        }, 10);
      }
    } catch (error) {
      console.error(`Error opening file picker for ${documentId}:`, error);
      alert('Unable to open file picker. Please try again.');
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    documentId: keyof typeof documents
  ) => {
    try {
      // Safety check for event and target
      if (!event || !event.target) {
        console.error('Invalid event or target');
        return;
      }

      const file = event.target.files?.[0];
      
      // Check if file was actually selected
      if (!file) {
        console.log('No file selected or file selection cancelled');
        return;
      }

      console.log(`📋 ${documentId} file selected:`, file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Validate file type and size
      const validTypes = documentId === 'profilePhoto' 
        ? ['image/jpeg', 'image/png', 'image/webp']
        : ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      // Type validation
      if (!validTypes.includes(file.type)) {
        console.warn(`Invalid file type: ${file.type} for ${documentId}`);
        alert(`Please select a valid file format for ${documentId}.\nAccepted formats: ${validTypes.join(', ')}`);
        // Reset input
        event.target.value = '';
        return;
      }
      
      // Size validation
      if (file.size > maxSize) {
        console.warn(`File too large: ${file.size} bytes for ${documentId}`);
        alert(`File size should be less than 5MB.\nSelected file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        // Reset input
        event.target.value = '';
        return;
      }

      // Additional safety checks
      if (file.size === 0) {
        console.warn(`Empty file selected for ${documentId}`);
        alert('The selected file appears to be empty. Please select a valid file.');
        event.target.value = '';
        return;
      }
      
      console.log(`✅ File validation passed for ${documentId}`);
      
      // Update document state with error handling
      try {
        setDocuments(prev => ({
          ...prev,
          [documentId]: {
            file,
            uploaded: true,
            status: 'uploaded'
          }
        }));
        
        console.log(`✅ Document state updated for ${documentId}`);
      } catch (stateError) {
        console.error('Error updating document state:', stateError);
        alert('Error updating document status. Please try again.');
        return;
      }
      
      // Save to localStorage for demo purposes
      try {
        const documentData = {
          [documentId]: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadedAt: new Date().toISOString(),
            status: 'uploaded'
          }
        };
        
        const existingData = JSON.parse(localStorage.getItem('raahi_driver_documents') || '{}');
        localStorage.setItem('raahi_driver_documents', JSON.stringify({
          ...existingData,
          ...documentData
        }));
        
        console.log(`✅ Document data saved to localStorage for ${documentId}`);
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
        // Don't show alert for localStorage error as the main functionality still works
      }

    } catch (error) {
      console.error(`Error handling file change for ${documentId}:`, error);
      
      // Reset the input to prevent stuck state
      if (event && event.target) {
        event.target.value = '';
      }
      
      alert('An error occurred while processing the file. Please try again.');
    }
  };

  const handleSupportClick = async () => {
    console.log("📞 Support clicked from document upload");
    
    try {
      await onSupport();
    } catch (error) {
      console.error("Support request error:", error);
    }
  };

  const handleLocationClick = () => {
    console.log("📍 Location clicked - opening location selection modal");
    setIsLocationModalVisible(true);
  };

  const handleLocationSelect = (location: string) => {
    console.log("📍 Location selected:", location);
    setSelectedLocation(location);
    localStorage.setItem('raahi_driver_selected_location', location);
  };

  const handleLocationModalClose = () => {
    console.log("📍 Location modal closed");
    setIsLocationModalVisible(false);
  };

  const handleNextClick = async () => {
    console.log("➡️ Next clicked from document upload");
    
    try {
      // Check which required documents are uploaded
      const requiredDocs = documentConfig.filter(doc => doc.required);
      const uploadedRequiredDocs = requiredDocs.filter(doc => 
        documents[doc.id as keyof typeof documents].uploaded
      );
      
      if (uploadedRequiredDocs.length < requiredDocs.length) {
        const missingDocs = requiredDocs.filter(doc => 
          !documents[doc.id as keyof typeof documents].uploaded
        ).map(doc => doc.title);
        
        alert(`Please upload the following required documents: ${missingDocs.join(', ')}`);
        return;
      }
      
      // Prepare uploaded documents data
      const uploadedDocuments = Object.entries(documents)
        .filter(([_, data]) => data.uploaded)
        .reduce((acc, [key, data]) => {
          const config = documentConfig.find(doc => doc.id === key);
          return {
            ...acc,
            [key]: {
              title: config?.title,
              fileName: data.file?.name,
              fileSize: data.file?.size,
              status: data.status,
              uploadedAt: new Date().toISOString()
            }
          };
        }, {});
      
      // Save completion status
      localStorage.setItem('raahi_driver_documents_status', JSON.stringify({
        uploadedDocuments,
        location: selectedLocation,
        completed_at: new Date().toISOString()
      }));
      
      await onNext(uploadedDocuments);
    } catch (error) {
      console.error("Error proceeding to next step:", error);
    }
  };

  const getDocumentIcon = (documentId: keyof typeof documents) => {
    const docData = documents[documentId];
    
    if (docData.uploaded) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      );
    }
    
    if (documentId === 'profilePhoto') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      );
    }
    
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10,9 9,9 8,9"></polyline>
      </svg>
    );
  };

  // Calculate completion percentage
  const totalDocs = documentConfig.length;
  const uploadedDocs = Object.values(documents).filter(doc => doc.uploaded).length;
  const completionPercentage = Math.round((uploadedDocs / totalDocs) * 100);

  return (
    <div className="bg-white relative min-h-screen w-full">
      <div className="relative h-full">
        <div className="box-border flex flex-col gap-6 items-center justify-start pb-20 pt-12 px-4 relative h-full min-h-screen">

          {/* Hidden file inputs */}
          {documentConfig.map(config => (
            <input
              key={config.id}
              ref={config.ref}
              type="file"
              accept={config.accept || ".pdf,.jpg,.jpeg,.png"}
              capture={config.capture}
              onChange={(e) => {
                try {
                  handleFileChange(e, config.id as keyof typeof documents);
                } catch (error) {
                  console.error(`Error in file input onChange for ${config.id}:`, error);
                }
              }}
              className="hidden"
              style={{ display: 'none' }}
              multiple={false}
            />
          ))}

          {/* Header with Raahi branding and Support */}
          <div 
            className="relative rounded-2xl shrink-0 w-full"
            style={{ backgroundColor: '#f6efd8' }}
          >
            <div className="flex flex-row items-center justify-between relative w-full px-4 py-4">
              <div 
                className="text-2xl text-center"
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
                className="bg-[#282828] flex items-center gap-2 px-3 py-2 rounded-lg transition-opacity hover:opacity-90"
              >
                <div 
                  className="text-sm text-white"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Support
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Welcome and Progress */}
          <div className="flex flex-col gap-4 w-full">
            <div 
              className="text-xl font-medium"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#080a24'
              }}
            >
              Upload Documents
            </div>
            
            {/* Progress Bar */}
            <div className="flex flex-col gap-2 w-full">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#38a35f] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div 
                className="text-sm text-right"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#444343'
                }}
              >
                <span className="font-semibold">{uploadedDocs}/{totalDocs}</span> Documents Uploaded ({completionPercentage}%)
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="w-full">
            <div 
              className="text-base mb-2"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#080a24'
              }}
            >
              Registered Location
            </div>
            <button
              onClick={handleLocationClick}
              className="bg-gray-100 rounded-2xl p-3 w-full flex items-center justify-between hover:bg-gray-200 transition-colors"
            >
              <div 
                className="text-base font-medium"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#444343'
                }}
              >
                {selectedLocation}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </div>

          {/* Documents Section */}
          <div className="flex flex-col gap-4 w-full flex-1">
            {documentConfig.map(config => {
              const docData = documents[config.id as keyof typeof documents];
              const isUploaded = docData.uploaded;
              const isFailed = docData.status === 'failed';
              
              // Determine the styling based on document status
              const getDocumentStyling = () => {
                if (isFailed) {
                  return {
                    container: 'bg-[#ffefef] border-[#d14544]',
                    text: 'text-[#d14544]',
                    icon: 'bg-[#d14544]',
                    description: 'Verification failed - please reupload'
                  };
                } else if (isUploaded) {
                  return {
                    container: 'bg-[#f0f9f4] border-[#38a35f]',
                    text: 'text-[#38a35f]',
                    icon: 'bg-[#38a35f]',
                    description: getDocumentName(config.id, docData.file?.name)
                  };
                } else {
                  return {
                    container: 'bg-[#fff4f4] border-[#d14544]',
                    text: 'text-[#d14544]',
                    icon: 'bg-[#d14544]',
                    description: config.description
                  };
                }
              };
              
              const styling = getDocumentStyling();
              
              return (
                <button
                  key={config.id}
                  onClick={(e) => {
                    try {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(`🖱️ Document button clicked: ${config.id}${isFailed ? ' (FAILED - needs reupload)' : ''}`);
                      handleDocumentClick(config.id as keyof typeof documents);
                    } catch (error) {
                      console.error(`Error in document button click for ${config.id}:`, error);
                    }
                  }}
                  className={`relative rounded-2xl w-full p-4 border-2 transition-all hover:opacity-90 ${styling.container}`}
                  type="button"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 text-left">
                      <div 
                        className="text-base font-medium mb-1"
                        style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          color: '#080a24'
                        }}
                      >
                        {config.title}
                        {config.required && <span className="text-red-500 ml-1">*</span>}
                        {isFailed && <span className="text-red-500 ml-2 text-xs">(Failed)</span>}
                      </div>
                      <div 
                        className={`text-sm font-medium ${styling.text}`}
                        style={{ 
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {styling.description}
                      </div>
                    </div>
                    
                    {/* Status Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${styling.icon}`}>
                      {getDocumentIcon(config.id as keyof typeof documents)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button - Fixed at bottom */}
          <div className="absolute box-border flex flex-col gap-3 items-start justify-start left-0 px-4 py-4 shadow-[0px_-2px_10px_0px_rgba(0,0,0,0.1)] bottom-0 w-full bg-white">
            <button
              onClick={handleNextClick}
              className="relative rounded-2xl w-full py-3 px-6 transition-opacity bg-[#282828] hover:opacity-90"
            >
              <div 
                className="text-base font-medium text-white text-center"
                style={{ 
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Next
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Location Selection Modal */}
      <DriverLocationSelectionModal
        isVisible={isLocationModalVisible}
        currentLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
        onClose={handleLocationModalClose}
      />
    </div>
  );
}