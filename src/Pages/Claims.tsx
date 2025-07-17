import React, { useState } from 'react';
import { Upload, FileText, Eye, Download, X } from 'lucide-react';
import { Button, Table, H1, H2, H3, Text, TextSmall, TextLarge, Label } from '../components/common';
import { TextField, Dropdown } from '../components/common';

interface ClaimData {
  id: string;
  policyNumber: string;
  claimType: string;
  incidentDate: string;
  filedOn: string;
  status: 'Submitted' | 'In Review' | 'Approved' | 'Rejected';
  lastUpdated: string;
  claimAmount: string;
  supportingDocs: number;
}

interface FileUpload {
  name: string;
  size: number;
  type: string;
}



const Claims: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');
  const [formData, setFormData] = useState({
    policyNumber: '',
    policyType: '',
    insuredName: '',
    phone: '',
    email: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    incidentType: '',
    description: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleVIN: '',
    otherParties: '',
    damageType: '',
    damagedItems: '',
    tempRepairs: '',
    treatmentDate: '',
    providerName: '',
    diagnosis: '',
    beneficiaryName: '',
    relationship: '',
    payoutMethod: '',
    confirmAccuracy: false,
    consentProcessing: false,
    digitalSignature: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [claimReference, setClaimReference] = useState('');

  // Mock existing claims data
  const existingClaims: ClaimData[] = [
    {
      id: 'CLM001',
      policyNumber: 'POL123456',
      claimType: 'Auto',
      incidentDate: '2024-12-15',
      filedOn: '2024-12-16',
      status: 'In Review',
      lastUpdated: '2024-12-20',
      claimAmount: '$5,200',
      supportingDocs: 3
    },
    {
      id: 'CLM002',
      policyNumber: 'POL789012',
      claimType: 'Health',
      incidentDate: '2024-11-28',
      filedOn: '2024-11-29',
      status: 'Approved',
      lastUpdated: '2024-12-01',
      claimAmount: '$1,850',
      supportingDocs: 2
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: FileUpload[] = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reference = 'CLM' + Date.now().toString().slice(-6);
    setClaimReference(reference);
    setShowConfirmation(true);
  };

  const renderClaimTypeFields = () => {
    switch (formData.policyType) {
      case 'Auto':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vehicle Make</Label>
                <TextField
                  value={formData.vehicleMake}
                  onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Vehicle Make"
                />
              </div>
              <div>
                <Label>Vehicle Model</Label>
                <TextField
                  value={formData.vehicleModel}
                  onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Vehicle Model"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vehicle Year</Label>
                <TextField
                  type="number"
                  value={formData.vehicleYear}
                  onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Vehicle Year"
                />
              </div>
              <div>
                <Label>VIN Number</Label>
                <TextField
                  value={formData.vehicleVIN}
                  onChange={(e) => handleInputChange('vehicleVIN', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Vehicle VIN"
                />
              </div>
            </div>
            <div>
              <Label>Other Parties Involved</Label>
              <textarea
                value={formData.otherParties}
                onChange={(e) => handleInputChange('otherParties', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      case 'Homeowners':
        return (
          <div className="space-y-4">
            <div>
              <Label>Type of Damage</Label>
              <Dropdown
                value={formData.damageType}
                onChange={(e) => handleInputChange('damageType', e.target.value)}
                options={[
                  { value: '', label: 'Select damage type' },
                  { value: 'Fire', label: 'Fire' },
                  { value: 'Water', label: 'Water' },
                  { value: 'Theft', label: 'Theft' },
                  { value: 'Storm', label: 'Storm' },
                  { value: 'Vandalism', label: 'Vandalism' }
                ]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Type of Damage"
              />
            </div>
            <div>
              <Label>Damaged or Lost Items</Label>
              <textarea
                value={formData.damagedItems}
                onChange={(e) => handleInputChange('damagedItems', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label>Temporary Repairs Made?</Label>
              <Dropdown
                value={formData.tempRepairs}
                onChange={(e) => handleInputChange('tempRepairs', e.target.value)}
                options={[
                  { value: '', label: 'Select option' },
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' }
                ]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Temporary Repairs Made"
              />
            </div>
          </div>
        );
      case 'Health':
        return (
          <div className="space-y-4">
            <div>
              <Label>Date of Treatment</Label>
              <TextField
                type="date"
                value={formData.treatmentDate}
                onChange={(e) => handleInputChange('treatmentDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Treatment Date"
              />
            </div>
            <div>
              <Label>Provider Name & Facility</Label>
              <TextField
                value={formData.providerName}
                onChange={(e) => handleInputChange('providerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provider Name"
              />
            </div>
            <div>
              <Label>Diagnosis/ICD Code</Label>
              <TextField
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Diagnosis"
              />
            </div>
          </div>
        );
      case 'Life':
        return (
          <div className="space-y-4">
            <div>
              <Label>Beneficiary Full Name</Label>
              <TextField
                value={formData.beneficiaryName}
                onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Beneficiary Name"
              />
            </div>
            <div>
              <Label>Relationship to Insured</Label>
              <TextField
                value={formData.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Relationship"
              />
            </div>
            <div>
              <Label>Preferred Payout Method</Label>
              <Dropdown
                value={formData.payoutMethod}
                onChange={(e) => handleInputChange('payoutMethod', e.target.value)}
                options={[
                  { value: '', label: 'Select payout method' },
                  { value: 'Lump Sum', label: 'Lump Sum' },
                  { value: 'Installments', label: 'Installments' }
                ]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Preferred Payout Method"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600';
      case 'Rejected': return 'text-red-600';
      case 'In Review': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  // Table columns for existing claims
  const claimsColumns = [
    {
      key: 'id',
      header: 'Claim ID',
      render: (value: string, row: ClaimData) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" icon={Eye} iconPosition="left">
            View
          </Button>
          {row.status === 'Submitted' && (
            <Button variant="danger" size="sm">
              Withdraw
            </Button>
          )}
        </div>
      )
    },
    {
      key: 'policyNumber',
      header: 'Policy Number',
      render: (value: string) => value
    },
    {
      key: 'claimType',
      header: 'Claim Type',
      render: (value: string) => value
    },
    {
      key: 'incidentDate',
      header: 'Incident Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'filedOn',
      header: 'Filed On',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <span className={getStatusColor(value)}>{value}</span>
      )
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'claimAmount',
      header: 'Claim Amount',
      render: (value: string) => value
    },
    {
      key: 'supportingDocs',
      header: 'Supporting Docs',
      render: (value: number) => value
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <H1>Want to raise a claim?</H1>
          
          <Text>Submit a new claim or view your existing claims</Text>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <Button
                variant={activeTab === 'new' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('new')}
                className="border-b-2 border-transparent"
              >
                New Claim
              </Button>
              <Button
                variant={activeTab === 'existing' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('existing')}
                className="border-b-2 border-transparent"
              >
                Existing Claims
              </Button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'new' ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Policy Information */}
              <div className="border-b border-gray-200 pb-6">
                <H2>Policy Information</H2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Policy Number</Label>
                    <TextField
                      value={formData.policyNumber}
                      onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Policy Number"
                    />
                  </div>
                  <div>
                    <Label>Policy Type</Label>
                    <Dropdown
                      value={formData.policyType}
                      onChange={(e) => handleInputChange('policyType', e.target.value)}
                      options={[
                        { value: '', label: 'Select policy type' },
                        { value: 'Auto', label: 'Auto' },
                        { value: 'Homeowners', label: 'Homeowners' },
                        { value: 'Health', label: 'Health' },
                        { value: 'Life', label: 'Life' }
                      ]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      aria-label="Policy Type"
                    />
                  </div>
                  <div>
                    <Label>Insured Person's Full Name</Label>
                    <TextField
                      value={formData.insuredName}
                      onChange={(e) => handleInputChange('insuredName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Insured Person's Full Name"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <TextField
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Phone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Email</Label>
                    <TextField
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Email"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Incident Details */}
              <div className="border-b border-gray-200 pb-6">
                <H2>Incident Details</H2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date of Incident</Label>
                    <TextField
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Date of Incident"
                    />
                  </div>
                  <div>
                    <Label>Time of Incident</Label>
                    <TextField
                      type="time"
                      value={formData.incidentTime}
                      onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Time of Incident"
                    />
                  </div>
                  <div>
                    <Label>Location of Incident</Label>
                    <TextField
                      value={formData.incidentLocation}
                      onChange={(e) => handleInputChange('incidentLocation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Location of Incident"
                    />
                  </div>
                  <div>
                    <Label>Type of Incident</Label>
                    <Dropdown
                      value={formData.incidentType}
                      onChange={(e) => handleInputChange('incidentType', e.target.value)}
                      options={[
                        { value: '', label: 'Select incident type' },
                        { value: 'Accident', label: 'Accident' },
                        { value: 'Theft', label: 'Theft' },
                        { value: 'Damage', label: 'Damage' },
                        { value: 'Injury', label: 'Injury' },
                        { value: 'Other', label: 'Other' }
                      ]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      aria-label="Type of Incident"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Brief Description</Label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Claim Type Specific Fields */}
              {formData.policyType && (
                <div className="border-b border-gray-200 pb-6">
                  <H2>{formData.policyType} Insurance Details</H2>
                  {renderClaimTypeFields()}
                </div>
              )}

              {/* Section 4: Supporting Documents */}
              <div className="border-b border-gray-200 pb-6">
                <H2>Supporting Documents</H2>
                <div className="space-y-4">
                  <div>
                    <Label>
                      Upload Documents (PDF, JPG, PNG, DOCX - Max 10MB, 5 files)
                    </Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <TextSmall className="text-xs text-gray-500">PDF, JPG, PNG, DOCX (MAX. 10MB)</TextSmall>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <H3>Uploaded Files:</H3>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <TextSmall>{file.name}</TextSmall>
                            <TextSmall>
                              ({Math.round(file.size / 1024)}KB)
                            </TextSmall>
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 5: Declaration & Consent */}
              <div className="border-b border-gray-200 pb-6">
                <H2>Declaration & Consent</H2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.confirmAccuracy}
                      onChange={(e) => handleInputChange('confirmAccuracy', e.target.checked)}
                      className="mt-1"
                      required
                    />
                    <TextSmall>
                      I confirm that all information provided is accurate and complete
                    </TextSmall>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.consentProcessing}
                      onChange={(e) => handleInputChange('consentProcessing', e.target.checked)}
                      className="mt-1"
                      required
                    />
                    <TextSmall>
                      I consent to data processing and third-party sharing as required for claim processing
                    </TextSmall>
                  </div>
                  <div>
                    <Label>Digital Signature (Type Full Name)</Label>
                    <TextField
                      value={formData.digitalSignature}
                      onChange={(e) => handleInputChange('digitalSignature', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Digital Signature (Type Full Name)"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Submit */}
              <div className="flex justify-end">
                <Button type="submit">
                  Submit Claim
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Existing Claims Tab */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <H2>Your Claims History</H2>
            </div>
            <Table
              columns={claimsColumns}
              data={existingClaims}
              emptyMessage="No claims found."
            />
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <H3>Claim Submitted Successfully!</H3>
                <div className="space-y-3 text-sm text-gray-600">
                  <TextSmall>
                    <strong>Claim Reference Number:</strong> {claimReference}
                  </TextSmall>
                  <TextSmall>
                    <strong>Estimated Review Timeline:</strong> 7-10 business days
                  </TextSmall>
                  <TextSmall>
                    For questions or updates, contact our support team at:
                    <br />
                    Phone: 1-800-CLAIMS-1
                    <br />
                    Email: claims@insurance.com
                  </TextSmall>
                </div>
                <div className="mt-6 space-y-3">
                  <Button
                    icon={Download}
                    iconPosition="left"
                    className="w-full"
                  >
                    Download Claim Summary
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Claims;