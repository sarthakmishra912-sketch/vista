import React, { useState, useEffect } from 'react';
// ❌ REMOVED: TestVerificationFailure import
import svgPaths from "../../imports/svg-qtsdqzyksq";

interface DocumentStatus {
  id: string;
  title: string;
  status: 'completed' | 'in_review' | 'processing' | 'needs_attention' | 'verifying';
  statusText: string;
  description?: string;
}

interface DriverDocumentVerificationScreenProps {
  onSupport: () => void;
  userEmail?: string | null;
}

// Global callback for document verification success
declare global {
  interface Window {
    handleDocumentVerificationSuccess?: () => void;
  }
}

export default function DriverDocumentVerificationScreen({
  onSupport,
  userEmail
}: DriverDocumentVerificationScreenProps) {

  // ❌ NUCLEAR OPTION: Clear ALL potentially corrupted localStorage data
  React.useEffect(() => {
    const clearAllFakeData = () => {
      console.log('🧹 CLEARING ALL POTENTIALLY FAKE DOCUMENT DATA...');
      
      // List of all localStorage keys that might contain fake document data
      const keysToCheck = [
        'raahi_driver_documents_status',
        'raahi_driver_documents',
        'raahi_driver_license_info', 
        'raahi_driver_profile_photo_info',
        'raahi_driver_documents_uploaded',
        'raahi_driver_photo_confirmed',
        'raahi_driver_onboarding_status'
      ];
      
      keysToCheck.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`🔍 Found data in ${key}:`, data);
          // For safety, we'll clear potentially corrupted data
          // Only keep data that looks legitimate (has actual file info)
          try {
            const parsed = JSON.parse(data);
            if (key === 'raahi_driver_documents_status' && parsed.uploadedDocuments) {
              // Check if any documents have suspicious data
              const docs = parsed.uploadedDocuments;
              let hasSuspiciousData = false;
              
              Object.keys(docs).forEach(docKey => {
                const doc = docs[docKey];
                if (!doc.fileName || !doc.fileSize || doc.fileSize <= 0) {
                  hasSuspiciousData = true;
                  console.log(`❌ Found suspicious document data in ${docKey}:`, doc);
                }
              });
              
              if (hasSuspiciousData) {
                console.log(`🗑️ Clearing suspicious data from ${key}`);
                localStorage.removeItem(key);
              }
            }
          } catch (e) {
            console.log(`🗑️ Clearing malformed data from ${key}`);
            localStorage.removeItem(key);
          }
        }
      });
    };
    
    clearAllFakeData();
  }, []);

  // Function to get ALL uploaded documents from various localStorage keys
  const getUploadedDocuments = () => {
    try {
      console.log('🔍 GETTING ALL UPLOADED DOCUMENTS FROM MULTIPLE SOURCES...');
      
      // Check main document storage
      const uploadedData = JSON.parse(localStorage.getItem('raahi_driver_documents_status') || '{}');
      console.log('📄 Main documents data:', uploadedData);
      
      const uploadedDocuments = uploadedData.uploadedDocuments || {};
      console.log('📄 Uploaded documents from main storage:', uploadedDocuments);
      
      // Check alternative document storage
      const altDocuments = JSON.parse(localStorage.getItem('raahi_driver_documents') || '{}');
      console.log('📄 Alternative documents storage:', altDocuments);
      
      // Check license-specific storage (from earlier onboarding step)
      const licenseInfo = JSON.parse(localStorage.getItem('raahi_driver_license_info') || '{}');
      console.log('📄 License-specific storage:', licenseInfo);
      
      // Check profile photo storage (from earlier onboarding step)
      const profilePhotoInfo = JSON.parse(localStorage.getItem('raahi_driver_profile_photo_info') || '{}');
      console.log('📄 Profile photo storage:', profilePhotoInfo);
      
      // Combine all sources into one object
      const allDocuments: any = {};
      
      // Add documents from main storage
      Object.keys(uploadedDocuments).forEach(docKey => {
        const doc = uploadedDocuments[docKey];
        if (doc && doc.fileName) {
          allDocuments[docKey] = doc;
          console.log(`📋 Added ${docKey} from main storage`);
        }
      });
      
      // Add documents from alternative storage
      Object.keys(altDocuments).forEach(docKey => {
        const doc = altDocuments[docKey];
        if (doc && doc.fileName && !allDocuments[docKey]) {
          allDocuments[docKey] = doc;
          console.log(`📋 Added ${docKey} from alternative storage`);
        }
      });
      
      // Add license from separate storage
      if (licenseInfo.frontImageName) {
        allDocuments['drivingLicense'] = {
          fileName: licenseInfo.frontImageName,
          fileSize: licenseInfo.frontImageSize || 1024, // default size if missing
          uploadedAt: licenseInfo.uploadedAt,
          status: 'uploaded'
        };
        console.log(`📋 Added driving license from separate storage`);
      }
      
      // Add profile photo from separate storage  
      if (profilePhotoInfo.profileImageName) {
        allDocuments['profilePhoto'] = {
          fileName: profilePhotoInfo.profileImageName,
          fileSize: profilePhotoInfo.profileImageSize || 1024, // default size if missing
          uploadedAt: profilePhotoInfo.uploadedAt,
          status: 'uploaded'
        };
        console.log(`📋 Added profile photo from separate storage`);
      }
      
      console.log('📋 COMBINED uploaded documents from all sources:', allDocuments);
      return allDocuments;
    } catch (error) {
      console.error('Error reading document status:', error);
      return {};
    }
  };

  // Function to initialize document statuses - SHOW ALL 5 DOCUMENTS regardless of upload status
  const initializeDocumentStatuses = (): DocumentStatus[] => {
    console.log('🔍 INITIALIZING ALL DOCUMENT STATUSES...');
    
    const uploadedDocs = getUploadedDocuments();
    console.log('📋 Retrieved uploaded docs:', uploadedDocs);
    
    // ALL 5 REQUIRED DOCUMENTS - always show these
    const allRequiredDocuments = [
      {
        key: 'drivingLicense',
        id: 'driving_license',
        title: 'Driving License',
        required: true
      },
      {
        key: 'panCard',
        id: 'pan_card', 
        title: 'PAN Card',
        required: true
      },
      {
        key: 'rcCertificate',
        id: 'rc_certificate',
        title: 'Registration Certificate (RC)',
        required: true
      },
      {
        key: 'aadhaarCard',
        id: 'aadhaar_card',
        title: 'Aadhaar Card',
        required: true
      },
      {
        key: 'profilePhoto',
        id: 'profile_photo',
        title: 'Profile Photo',
        required: true
      }
    ];

    const documentStatuses: DocumentStatus[] = [];

    // Check each required document and assign appropriate status
    allRequiredDocuments.forEach(docInfo => {
      const docData = uploadedDocs[docInfo.key];
      
      console.log(`🔍 Checking ${docInfo.title} (${docInfo.key}):`, docData);
      
      // Determine status based on upload data
      let documentStatus: DocumentStatus;
      
      if (docData) {
        // Document was uploaded - check if it's valid
        const hasRealFile = docData.fileName && 
                           docData.fileSize && 
                           docData.fileSize > 0 && 
                           docData.uploadedAt;
        
        const isRecent = docData.uploadedAt && 
                        (new Date().getTime() - new Date(docData.uploadedAt).getTime()) < 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (hasRealFile && isRecent) {
          // Valid upload - show as processing
          documentStatus = {
            id: docInfo.id,
            title: docInfo.title,
            status: 'processing' as const,
            statusText: 'Processing',
            description: `Document uploaded and being verified`
          };
          console.log(`✅ ${docInfo.title} is uploaded and valid`);
        } else {
          // Invalid or old upload - needs attention
          documentStatus = {
            id: docInfo.id,
            title: docInfo.title,
            status: 'needs_attention' as const,
            statusText: 'Upload Required',
            description: 'Please upload a valid document'
          };
          console.log(`⚠️ ${docInfo.title} needs reupload - invalid data`);
        }
      } else {
        // Document not uploaded - needs upload
        documentStatus = {
          id: docInfo.id,
          title: docInfo.title,
          status: 'needs_attention' as const,
          statusText: 'Not Uploaded',
          description: 'Document required for verification'
        };
        console.log(`❌ ${docInfo.title} not uploaded`);
      }
      
      documentStatuses.push(documentStatus);
    });

    console.log(`📊 All 5 documents status initialized:`, documentStatuses);
    return documentStatuses;
  };

  const [documents, setDocuments] = useState<DocumentStatus[]>(initializeDocumentStatuses());

  // ✅ AUTO-VERIFICATION: Simulate document verification process for demo
  React.useEffect(() => {
    const autoVerifyDocuments = () => {
      console.log('🔄 Starting auto-verification simulation...');
      
      // Check if any documents are in processing state
      const hasProcessingDocs = documents.some(doc => doc.status === 'processing');
      
      if (hasProcessingDocs) {
        console.log('📋 Found processing documents, starting verification...');
        
        // After 3 seconds, start verifying documents one by one
        setTimeout(() => {
          console.log('✅ Auto-verifying all documents...');
          
          setDocuments(prevDocs => {
            const updatedDocs = prevDocs.map(doc => ({
              ...doc,
              status: 'completed' as const,
              statusText: 'Verified ✓',
              description: 'Document approved and verified'
            }));
            
            console.log('📊 All documents now verified:', updatedDocs);
            
            // Save verified status to localStorage
            const verifiedDocsStatus = {
              allDocumentsVerified: true,
              verifiedAt: new Date().toISOString(),
              documentStatuses: updatedDocs.reduce((acc, doc) => {
                acc[doc.id] = {
                  status: 'completed',
                  verifiedAt: new Date().toISOString()
                };
                return acc;
              }, {} as any)
            };
            
            localStorage.setItem('raahi_driver_documents_verified', JSON.stringify(verifiedDocsStatus));
            localStorage.setItem('raahi_driver_onboarding_status', 'documents_verified');
            
            // Auto-navigate to success screen after short delay
            setTimeout(() => {
              console.log('🎉 All documents verified! Auto-navigating to success screen...');
              
              // Trigger navigation to success screen via global callback
              if (window.handleDocumentVerificationSuccess) {
                window.handleDocumentVerificationSuccess();
              }
            }, 2000); // 2 second delay to show completed status
            
            return updatedDocs;
          });
        }, 3000); // 3 second delay before verification starts
      } else {
        console.log('ℹ️ No processing documents found, checking if we should auto-verify...');
        
        // Check if we have uploaded documents that should be processing
        const hasUploadedDocs = documents.some(doc => 
          doc.status === 'needs_attention' && 
          getUploadedDocuments()[doc.id.replace('_', '').toLowerCase()] // Check if actually uploaded
        );
        
        if (hasUploadedDocs) {
          console.log('📋 Found uploaded documents, marking as processing first...');
          
          // First mark uploaded docs as processing
          setDocuments(prevDocs => 
            prevDocs.map(doc => {
              const docKey = doc.id.replace('_', '').toLowerCase();
              const uploadedDoc = getUploadedDocuments()[docKey];
              
              if (uploadedDoc && uploadedDoc.fileName) {
                return {
                  ...doc,
                  status: 'processing' as const,
                  statusText: 'Processing',
                  description: 'Document uploaded and being verified'
                };
              }
              return doc;
            })
          );
        }
      }
    };
    
    // Run verification check after component mounts and whenever documents change
    const timeoutId = setTimeout(autoVerifyDocuments, 1000);
    return () => clearTimeout(timeoutId);
  }, [documents]);

  const handleSupportClick = async () => {
    console.log("📞 Support clicked from document verification");
    
    try {
      await onSupport();
    } catch (error) {
      console.error("Support request error:", error);
    }
  };

  const getStatusIcon = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-12 h-12 rounded-lg bg-[#38a35f] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
              <path d={svgPaths.p183907c0} stroke="white" strokeLinecap="round" strokeWidth="3.37778" />
            </svg>
          </div>
        );
      
      case 'needs_attention':
        return (
          <div className="w-12 h-12 rounded-lg bg-[#d14544] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        );
      
      case 'processing':
        return (
          <div className="w-12 h-12 rounded-lg bg-[#c9c9c9] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
              <path d="M21 12a9 9 0 1 1-9-9c2.12 0 4.07.74 5.6 1.98" />
            </svg>
          </div>
        );
      
      case 'verifying':
        return (
          <div className="w-12 h-12 rounded-lg bg-[#ffa500] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
            </svg>
          </div>
        );
      
      default: // in_review
        return (
          <div className="w-12 h-12 rounded-lg bg-[#c9c9c9] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'completed':
        return 'text-[#38a35f]';
      case 'needs_attention':
        return 'text-[#d14544]';
      case 'processing':
        return 'text-[#636363]';
      case 'verifying':
        return 'text-[#ffa500]';
      default: // in_review
        return 'text-[#636363]';
    }
  };

  const getDocumentBackground = (status: DocumentStatus['status']) => {
    if (status === 'needs_attention') {
      return 'bg-[#ffefef]';
    }
    return 'bg-white';
  };

  // Calculate progress based on all document statuses
  const completedCount = documents.filter(doc => doc.status === 'completed').length;
  const processingCount = documents.filter(doc => doc.status === 'processing').length;
  const uploadedCount = documents.filter(doc => doc.status === 'processing' || doc.status === 'completed').length;
  const totalDocuments = 5; // Always 5 required documents
  
  // Progress calculation: uploaded + processing documents count as progress
  const progressPercentage = Math.round((uploadedCount / totalDocuments) * 100);
  
  console.log('📊 Progress calculation:', {
    totalDocuments,
    uploadedCount,
    processingCount, 
    completedCount,
    progressPercentage
  });

  return (
    <div className="bg-white w-full">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col gap-6 p-4 pt-8">

          {/* Header with Raahi branding and Support */}
          <div 
            className="rounded-2xl w-full"
            style={{ backgroundColor: '#f6efd8' }}
          >
            <div className="flex flex-row items-center justify-between px-4 py-4">
              <div 
                className="text-2xl"
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

          {/* Header Text */}
          <div className="flex flex-col gap-4">
            <div 
              className="text-xl font-medium leading-tight"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#080a24'
              }}
            >
              Retrieving and verifying your information
            </div>
            <div 
              className="text-sm leading-normal"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#535353'
              }}
            >
              We're reviewing your document information. This usually takes a few minutes and up to one day. After that we'll start your enhanced background check.
            </div>
          </div>

          {/* Progress indicator */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-sm font-medium"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#080a24'
                }}
              >
                Verification Progress
              </span>
              <div className="text-sm font-medium text-right">
                <span 
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    color: uploadedCount > 0 ? '#38a35f' : '#d14544'
                  }}
                >
                  {uploadedCount}/{totalDocuments} Uploaded ({progressPercentage}%)
                </span>
                {processingCount > 0 && (
                  <div 
                    className="text-xs mt-1"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      color: '#ffa500' 
                    }}
                  >
                    {processingCount} processing • {completedCount} verified
                  </div>
                )}
                {uploadedCount === 0 && (
                  <div 
                    className="text-xs mt-1"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      color: '#d14544' 
                    }}
                  >
                    Upload required
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#38a35f] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Documents Status List */}
          <div className="w-full">
            <div className="border-2 border-[#d8d8d8] rounded-2xl p-4 bg-white">
              <div className="space-y-4">
                {documents.map((document, index) => (
                  <div 
                    key={`${document.id}-${index}`}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${getDocumentBackground(document.status)}`}
                  >
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(document.status)}
                    </div>
                    
                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div 
                        className="text-base font-medium mb-1"
                        style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          color: '#080a24'
                        }}
                      >
                        {document.title}
                      </div>
                      <div 
                        className={`text-sm font-medium mb-1 ${getStatusColor(document.status)} flex items-center`}
                        style={{ 
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {document.statusText}
                        {document.status === 'needs_attention' && (
                          <svg className="ml-2 w-4 h-4 flex-shrink-0" viewBox="0 0 28 24" fill="none">
                            <path d={svgPaths.p3116e700} fill="#d14544" />
                          </svg>
                        )}
                      </div>
                      {document.description && (
                        <div 
                          className="text-xs"
                          style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            color: '#888'
                          }}
                        >
                          {document.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Verification Button (REMOVE IN PRODUCTION) */}
          <div className="w-full">
            <button
              onClick={() => {
                console.log('🧪 TEST: Manually triggering document verification success');
                setDocuments(prevDocs => 
                  prevDocs.map(doc => ({
                    ...doc,
                    status: 'completed' as const,
                    statusText: 'Verified ✓',
                    description: 'Document approved and verified'
                  }))
                );
                
                setTimeout(() => {
                  if (window.handleDocumentVerificationSuccess) {
                    window.handleDocumentVerificationSuccess();
                  }
                }, 1000);
              }}
              className="w-full bg-[#cf923d] text-white py-3 px-6 rounded-xl font-medium text-sm"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              🧪 TEST: Verify All Documents
            </button>
          </div>

          {/* Footer Info */}
          <div className="w-full pb-4">
            <div 
              className="text-xs text-center"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#888'
              }}
            >
              You'll receive notifications when your documents are verified. 
              <br />
              Estimated completion time: 24-48 hours
              <br />
              <span className="text-[#cf923d] font-medium">
                (Demo: Documents will auto-verify in 3 seconds, or use test button above)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}