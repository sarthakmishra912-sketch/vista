import React, { useState, useEffect } from 'react';
import { adminApi, AdminDriver, DriverDocument } from '../services/adminApi';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

interface AdminDashboardScreenProps {
  onBack: () => void;
}

export default function AdminDashboardScreen({ onBack }: AdminDashboardScreenProps) {
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<AdminDriver | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<DriverDocument | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [driversData, statsData] = await Promise.all([
        adminApi.getPendingDrivers({ search: searchQuery, limit: 100 }),
        adminApi.getStatistics()
      ]);
      
      setDrivers(driversData.data.drivers);
      setStatistics(statsData.data);
      console.log('📊 Loaded admin data:', { drivers: driversData.data.drivers.length, stats: statsData.data });
    } catch (error: any) {
      console.error('❌ Error loading admin data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (documentId: string, approved: boolean, rejectionReason?: string) => {
    try {
      toast.loading(approved ? 'Approving document...' : 'Rejecting document...', { id: 'verify-doc' });
      
      const response = await adminApi.verifyDocument(documentId, approved, rejectionReason);
      
      toast.success(response.message, { id: 'verify-doc' });
      
      // Reload data to show updated status
      await loadData();
      
      // Update selected driver's documents
      if (selectedDriver) {
        const updatedDriver = drivers.find(d => d.driver_id === selectedDriver.driver_id);
        if (updatedDriver) {
          setSelectedDriver(updatedDriver);
        }
      }
      
      setSelectedDocument(null);
    } catch (error: any) {
      console.error('❌ Error verifying document:', error);
      toast.error(error?.response?.data?.message || 'Failed to verify document', { id: 'verify-doc' });
    }
  };

  const handleVerifyAllDocuments = async (driverId: string, approved: boolean) => {
    const confirmMessage = approved 
      ? 'Are you sure you want to approve all documents for this driver?' 
      : 'Are you sure you want to reject all documents for this driver?';
    
    if (!confirm(confirmMessage)) return;

    try {
      toast.loading(approved ? 'Approving all documents...' : 'Rejecting all documents...', { id: 'verify-all' });
      
      const response = await adminApi.verifyAllDocuments(driverId, approved);
      
      toast.success(response.message, { id: 'verify-all' });
      
      // Reload data
      await loadData();
      setSelectedDriver(null);
    } catch (error: any) {
      console.error('❌ Error verifying all documents:', error);
      toast.error(error?.response?.data?.message || 'Failed to verify documents', { id: 'verify-all' });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      'DOCUMENT_VERIFICATION': { 
        label: 'Pending Review', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300' 
      },
      'DOCUMENT_UPLOAD': { 
        label: 'Uploading', 
        color: 'bg-blue-100 text-blue-800 border-blue-300' 
      },
      'COMPLETED': { 
        label: 'Verified', 
        color: 'bg-green-100 text-green-800 border-green-300' 
      },
      'REJECTED': { 
        label: 'Rejected', 
        color: 'bg-red-100 text-red-800 border-red-300' 
      }
    };
    
    const config = statusMap[status] || { 
      label: status, 
      color: 'bg-gray-100 text-gray-800 border-gray-300' 
    };
    return (
      <Badge className={`${config.color} border px-3 py-1 font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getDocumentTypeName = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'LICENSE': 'Driving License',
      'PAN_CARD': 'PAN Card',
      'RC': 'RC Certificate',
      'AADHAAR_CARD': 'Aadhaar Card',
      'PROFILE_PHOTO': 'Profile Photo'
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={onBack} 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                ← Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-xl">👨‍💼</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <Button 
              onClick={loadData} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Total Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{statistics.drivers.total}</div>
              </CardContent>
            </Card>
            <Card className="border border-green-200 shadow-sm hover:shadow-md transition-shadow bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700">Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{statistics.drivers.verified}</div>
              </CardContent>
            </Card>
            <Card className="border border-yellow-200 shadow-sm hover:shadow-md transition-shadow bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-yellow-700">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{statistics.drivers.pending_verification}</div>
              </CardContent>
            </Card>
            <Card className="border border-red-200 shadow-sm hover:shadow-md transition-shadow bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-700">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{statistics.drivers.rejected}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drivers List */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Pending Verification
                </CardTitle>
                <CardDescription className="text-gray-600">{drivers.length} drivers</CardDescription>
                <div className="relative mt-3">
                  <input
                    type="text"
                    placeholder="🔍 Search drivers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') loadData();
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {drivers.map((driver) => (
                    <div
                      key={driver.driver_id}
                      onClick={() => setSelectedDriver(driver)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedDriver?.driver_id === driver.driver_id 
                          ? 'bg-indigo-50 border-l-4 border-indigo-600' 
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{driver.user.name}</h3>
                          <p className="text-sm text-gray-600">{driver.user.phone}</p>
                        </div>
                        {getStatusBadge(driver.onboarding_status)}
                      </div>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>✅ {driver.documents_summary.verified}</span>
                        <span>⏳ {driver.documents_summary.pending}</span>
                        <span>❌ {driver.documents_summary.rejected}</span>
                      </div>
                      {driver.submitted_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted {new Date(driver.submitted_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                  {drivers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">✓</div>
                      <p className="font-medium">All Clear!</p>
                      <p className="text-sm">No pending drivers</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Driver Details */}
          <div className="lg:col-span-2">
            {selectedDriver ? (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">👤</span>
                        {selectedDriver.user.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">{selectedDriver.user.email}</CardDescription>
                    </div>
                    {getStatusBadge(selectedDriver.onboarding_status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Driver Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Driver Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium">{selectedDriver.user.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Language:</span>
                        <p className="font-medium">{selectedDriver.preferred_language || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Vehicle Type:</span>
                        <p className="font-medium">{selectedDriver.vehicle_info.type || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Service Types:</span>
                        <p className="font-medium">{selectedDriver.service_types.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">Documents ({selectedDriver.documents.length})</h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVerifyAllDocuments(selectedDriver.driver_id, true)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          ✅ Approve All
                        </Button>
                        <Button
                          onClick={() => handleVerifyAllDocuments(selectedDriver.driver_id, false)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          ❌ Reject All
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedDriver.documents.map((doc) => (
                        <div key={doc.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{getDocumentTypeName(doc.type)}</h4>
                              <p className="text-sm text-gray-600">
                                Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={doc.is_verified ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'}>
                              {doc.is_verified ? '✅ Verified' : '⏳ Pending'}
                            </Badge>
                          </div>
                          
                          {doc.rejection_reason && (
                            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                              <strong>Rejected:</strong> {doc.rejection_reason}
                            </div>
                          )}

                          <div className="mb-3">
                            <a
                              href={`http://localhost:5001${doc.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              📄 View Document
                            </a>
                          </div>

                          {!doc.is_verified && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleVerifyDocument(doc.id, true)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                              >
                                ✅ Approve
                              </Button>
                              <Button
                                onClick={() => setSelectedDocument(doc)}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white flex-1"
                              >
                                ❌ Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Notes */}
                  {selectedDriver.verification_notes && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Notes</h4>
                      <p className="text-blue-800 text-sm">{selectedDriver.verification_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Driver Selected</h3>
                  <p className="text-gray-600">Select a driver from the list to view and verify documents</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border border-gray-200 shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-gray-900">Reject Document</CardTitle>
              <CardDescription className="text-gray-600">
                {getDocumentTypeName(selectedDocument.type)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  id="rejection-reason"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Document is blurry, expired, or doesn't match requirements..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    const reason = (document.getElementById('rejection-reason') as HTMLTextAreaElement)?.value;
                    if (!reason?.trim()) {
                      alert('Please provide a reason for rejection');
                      return;
                    }
                    handleVerifyDocument(selectedDocument.id, false, reason);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white flex-1"
                >
                  Reject Document
                </Button>
                <Button
                  onClick={() => setSelectedDocument(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

