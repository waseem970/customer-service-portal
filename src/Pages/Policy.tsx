import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, X, Check, AlertCircle, FileText } from 'lucide-react';
import { Button, Table, H1, H2, H3, Text, TextSmall, TextLarge, Label } from '../components/common';
import { TextField } from '../components/common';
import { Dropdown } from '../components/common';

interface Policy {
  id: string;
  policyNumber: string;
  policyType: 'Auto' | 'Home' | 'Life';
  monthlyPremium: number;
  premiumAmount: number;
  effectiveDate: string;
  expiryDate: string;
  status: 'Active' | 'Inactive' | 'Cancelled';
  documents: string[];
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

const Policy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancellationExplanation, setCancellationExplanation] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sample data - in real app, this would come from API
  useEffect(() => {
    const samplePolicies: Policy[] = [
      {
        id: '1',
        policyNumber: 'POL001234567',
        policyType: 'Auto',
        monthlyPremium: 125.00,
        premiumAmount: 1500.00,
        effectiveDate: '2024-01-15',
        expiryDate: '2025-01-15',
        status: 'Active',
        documents: ['policy-document.pdf', 'coverage-summary.pdf']
      },
      {
        id: '2',
        policyNumber: 'POL002345678',
        policyType: 'Home',
        monthlyPremium: 200.00,
        premiumAmount: 2400.00,
        effectiveDate: '2024-03-01',
        expiryDate: '2025-03-01',
        status: 'Active',
        documents: ['policy-document.pdf']
      },
      {
        id: '3',
        policyNumber: 'POL003456789',
        policyType: 'Life',
        monthlyPremium: 75.00,
        premiumAmount: 900.00,
        effectiveDate: '2023-06-15',
        expiryDate: '2024-06-15',
        status: 'Inactive',
        documents: ['policy-document.pdf']
      }
    ];
    setPolicies(samplePolicies);
  }, []);

  const showToast = (message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesTab = activeTab === 'active' 
      ? policy.status === 'Active' 
      : policy.status === 'Inactive' || policy.status === 'Cancelled';
    
    const matchesSearch = policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || policy.policyType === selectedType;
    
    return matchesTab && matchesSearch && matchesType;
  });

  const handleDocumentDownload = (policyNumber: string, documentName: string) => {
    const policy = policies.find(p => p.policyNumber === policyNumber);
    if (policy?.status !== 'Active') {
      return; // Disabled for inactive policies
    }
    
    try {
      // Simulate download - in real app, this would be an API call
      const link = document.createElement('a');
      link.href = `#${documentName}`;
      link.download = documentName;
      link.click();
      showToast('Document downloaded successfully.', 'success');
    } catch (error) {
      showToast('Unable to download the document. Please try again later.', 'error');
    }
  };

  const handleRenewal = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowRenewalModal(true);
  };

  const confirmRenewal = () => {
    if (selectedPolicy) {
      // Simulate API call
      setPolicies(prev => prev.map(p => 
        p.id === selectedPolicy.id 
          ? { ...p, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
          : p
      ));
      showToast('Policy renewed successfully.', 'success');
      setShowRenewalModal(false);
      setSelectedPolicy(null);
    }
  };

  const handleCancellation = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowCancellationModal(true);
  };

  const confirmCancellation = () => {
    if (selectedPolicy && cancellationReason.trim()) {
      // Simulate API call
      setPolicies(prev => prev.map(p => 
        p.id === selectedPolicy.id 
          ? { ...p, status: 'Cancelled' as const }
          : p
      ));
      showToast('Policy cancelled successfully.', 'success');
      setShowCancellationModal(false);
      setSelectedPolicy(null);
      setCancellationReason('');
      setCancellationExplanation('');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Table columns configuration
  const columns = [
    {
      key: 'policyNumber',
      header: 'Policy Number',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'policyType',
      header: 'Policy Type',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Auto' ? 'bg-blue-100 text-blue-800' :
          value === 'Home' ? 'bg-green-100 text-green-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'monthlyPremium',
      header: 'Monthly Premium',
      render: (value: number) => formatCurrency(value)
    },
    {
      key: 'premiumAmount',
      header: 'Premium Amount',
      render: (value: number) => formatCurrency(value)
    },
    {
      key: 'effectiveDate',
      header: 'Effective Date',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'documents',
      header: 'Documents',
      render: (value: string[], row: Policy) => (
        <div className="flex space-x-2">
          {value.map((doc, index) => (
            <div key={index} className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDocumentDownload(row.policyNumber, doc)}
                disabled={row.status !== 'Active'}
                className={`p-2 ${
                  row.status === 'Active'
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title={row.status !== 'Active' ? 'Download unavailable for expired policies.' : 'Download document'}
              >
                <Download size={16} />
              </Button>
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, row: Policy) => (
        <div className="flex space-x-2">
          {row.status === 'Active' && (
            <>
              <Button
                size="sm"
                onClick={() => handleRenewal(row)}
              >
                Renew
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleCancellation(row)}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg shadow-lg max-w-md ${
              toast.type === 'success' ? 'bg-green-100 text-green-800' :
              toast.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}
          >
            <div className="flex-1">{toast.message}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <H1>Policy Management</H1>
          <Text>View and manage your insurance policies</Text>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'active' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('active')}
            className={activeTab === 'active' ? 'shadow-sm border-2' : ''}
          >
            Active Policies
          </Button>
          <Button
            variant={activeTab === 'inactive' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('inactive')}
            className={activeTab === 'inactive' ? 'shadow-sm border-2' : ''}
          >
            Inactive Policies
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <TextField
                type="text"
                placeholder="Search by Policy Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ paddingLeft: '2.5rem' }}
                aria-label="Search by Policy Number"
              />
            </div>
            <Dropdown
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { value: '', label: 'All Policy Types' },
                { value: 'Auto', label: 'Auto' },
                { value: 'Home', label: 'Home' },
                { value: 'Life', label: 'Life' }
              ]}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Filter by Policy Type"
            />
          </div>
        </div>

        {/* Policy Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Premium
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premium Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effective Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {policy.policyNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        policy.policyType === 'Auto' ? 'bg-blue-100 text-blue-800' :
                        policy.policyType === 'Home' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {policy.policyType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(policy.monthlyPremium)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(policy.premiumAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(policy.effectiveDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(policy.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        {policy.documents.map((doc, index) => (
                          <div key={index} className="relative">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDocumentDownload(policy.policyNumber, doc)}
                              disabled={policy.status !== 'Active'}
                              className={`p-2 rounded-lg transition-colors ${
                                policy.status === 'Active'
                                  ? 'text-gray-600 hover:bg-gray-100'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                              title={policy.status !== 'Active' ? 'Download unavailable for expired policies.' : 'Download document'}
                            >
                              <Download size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        {policy.status === 'Active' && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleRenewal(policy)}
                              className="px-3 py-1 rounded-md text-sm font-medium text-white transition-colors"
                            >
                              Renew
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleCancellation(policy)}
                              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPolicies.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <Text className="text-gray-500">No policies found matching your criteria.</Text>
            </div>
          )}
        </div>
      </div>

      {/* Renewal Modal */}
      {showRenewalModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <H2>Renew Policy</H2>
            <div className="space-y-4">
              <div>
                <Label>Policy Number</Label>
                <TextSmall>{selectedPolicy.policyNumber}</TextSmall>
              </div>
              <div>
                <Label>Updated Premium Amount</Label>
                <TextLarge color="success" weight="semibold">
                  {formatCurrency(selectedPolicy.premiumAmount * 1.05)} {/* 5% increase */}
                </TextLarge>
              </div>
              <div>
                <Label>Coverage Summary</Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <TextSmall>
                    Your {selectedPolicy.policyType} insurance policy will be renewed for another year with enhanced coverage benefits.
                  </TextSmall>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowRenewalModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRenewal}
              >
                Confirm Renewal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancellationModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <H2>Cancel Policy</H2>
            <div className="space-y-4">
              <div>
                <Label>Policy Number</Label>
                <TextSmall>{selectedPolicy.policyNumber}</TextSmall>
              </div>
              <div>
                <Label>
                  Reason for Cancellation *
                </Label>
                <Dropdown
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  options={[
                    { value: '', label: 'Select a reason' },
                    { value: 'Found better coverage', label: 'Found better coverage' },
                    { value: 'Financial constraints', label: 'Financial constraints' },
                    { value: 'No longer need coverage', label: 'No longer need coverage' },
                    { value: 'Dissatisfied with service', label: 'Dissatisfied with service' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  aria-label="Reason for Cancellation"
                />
              </div>
              <div>
                <Label>
                  Additional Comments (Optional)
                </Label>
                <textarea
                  value={cancellationExplanation}
                  onChange={(e) => setCancellationExplanation(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide any additional details..."
                />
                <TextSmall className="mt-1">
                  {cancellationExplanation.length}/500 characters
                </TextSmall>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancellationModal(false);
                  setCancellationReason('');
                  setCancellationExplanation('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmCancellation}
                disabled={!cancellationReason.trim()}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Policy;