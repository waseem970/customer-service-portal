import React, { useState } from 'react';
import { Calendar, Download, Plus, Edit, Trash2, CreditCard, FileText, Bell, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button, Table, H2, H3, Text, TextSmall, TextLarge, Label } from '../components/common';
import SwitchToggle from '../components/common/Toggle';

// Types
interface BillingRecord {
  id: string;
  date: string;
  invoiceNumber: string;
  policyType: string;
  amount: number;
  paymentStatus: 'Paid' | 'Failed' | 'Refunded' | 'Upcoming';
  paymentMethod: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'ach' | 'digital';
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

const BillingPayments: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'methods' | 'autopay' | 'refund' | 'notifications'>('overview');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [autopayEnabled, setAutopayEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editMethodId, setEditMethodId] = useState<string | null>(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState<{
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    type: 'credit' | 'debit' | 'ach' | 'digital';
    isDefault?: boolean;
  }>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    type: 'credit'
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // Sample data
  const [billingHistory] = useState<BillingRecord[]>([
    {
      id: '1',
      date: '2024-12-15',
      invoiceNumber: 'INV-2024-001',
      policyType: 'Auto Insurance',
      amount: 1250.00,
      paymentStatus: 'Paid',
      paymentMethod: 'VISA **** 2345'
    },
    {
      id: '2',
      date: '2024-11-15',
      invoiceNumber: 'INV-2024-002',
      policyType: 'Home Insurance',
      amount: 850.00,
      paymentStatus: 'Paid',
      paymentMethod: 'VISA **** 2345'
    },
    {
      id: '3',
      date: '2024-10-15',
      invoiceNumber: 'INV-2024-003',
      policyType: 'Auto Insurance',
      amount: 1250.00,
      paymentStatus: 'Failed',
      paymentMethod: 'VISA **** 2345'
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit',
      cardNumber: '**** **** **** 2345',
      expiryDate: '12/26',
      cardholderName: 'John Doe',
      isDefault: true
    }
  ]);

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    push: true
  });

  const [newPaymentMethod, setNewPaymentMethod] = useState<{
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    type: 'credit' | 'debit' | 'ach' | 'digital';
  }>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    type: 'credit'
  });

  const [refundRequest, setRefundRequest] = useState({
    transactionId: '',
    reason: '',
    document: null as File | null
  });

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Refunded': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'Upcoming': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  // Improved card number validation: allow spaces, check for 16 digits
  const validateCardNumber = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(digits)) return false;
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiryDate: string): boolean => {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }
    
    return true;
  };

  const handleAddPaymentMethod = () => {
    if (!validateCardNumber(newPaymentMethod.cardNumber)) {
      setError('Invalid card number');
      return;
    }
    
    if (!validateExpiryDate(newPaymentMethod.expiryDate)) {
      setError('Expiry date cannot be in the past');
      return;
    }
    
    const digits = newPaymentMethod.cardNumber.replace(/\s+/g, '');
    const maskedCardNumber = `**** **** **** ${digits.slice(-4)}`;
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newPaymentMethod.type,
      cardNumber: maskedCardNumber,
      expiryDate: newPaymentMethod.expiryDate,
      cardholderName: newPaymentMethod.cardholderName,
      isDefault: paymentMethods.length === 0
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setNewPaymentMethod({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '', type: 'credit' });
    setShowAddPaymentModal(false);
    setSuccessMessage('Payment method added successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Edit Payment Method handlers
  const handleEditClick = (method: PaymentMethod) => {
    setEditMethodId(method.id);
    setEditPaymentMethod({
      cardNumber: '',
      expiryDate: method.expiryDate,
      cvv: '',
      cardholderName: method.cardholderName,
      type: method.type
    });
    setShowEditModal(true);
  };

  const handleEditSave = (id: string) => {
    if (editPaymentMethod.cardNumber && !validateCardNumber(editPaymentMethod.cardNumber)) {
      setError('Invalid card number');
      return;
    }
    if (!validateExpiryDate(editPaymentMethod.expiryDate)) {
      setError('Expiry date cannot be in the past');
      return;
    }
    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === id
          ? {
            ...method,
            cardNumber: editPaymentMethod.cardNumber
              ? `**** **** **** ${editPaymentMethod.cardNumber.replace(/\s+/g, '').slice(-4)}`
              : method.cardNumber,
            expiryDate: editPaymentMethod.expiryDate,
            cardholderName: editPaymentMethod.cardholderName,
            isDefault: editPaymentMethod.isDefault ?? method.isDefault
          }
        : (editPaymentMethod.isDefault ? { ...method, isDefault: false } : method)
      )
    );
    setEditMethodId(null);
    setShowEditModal(false);
    setSuccessMessage('Payment method updated successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleToggleAutopay = () => {
    if (paymentMethods.length === 0) {
      setError('Please add a payment method to enable autopay');
      return;
    }
    setAutopayEnabled(!autopayEnabled);
    setSuccessMessage(`Autopay ${!autopayEnabled ? 'enabled' : 'disabled'} successfully`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleRefundSubmit = () => {
    if (!refundRequest.transactionId || !refundRequest.reason || refundRequest.reason.length < 10) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!refundRequest.document) {
      setError('At least one document is required');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRefundForm(false);
      setRefundRequest({ transactionId: '', reason: '', document: null });
      setSuccessMessage('Refund request submitted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1500);
  };

  const handleNotificationSave = () => {
    setSuccessMessage('Preferences updated successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Filtered billing history with date range and status filter
  const filteredBillingHistory = billingHistory.filter(record => {
    // Status filter
    if (statusFilter !== 'all' && record.paymentStatus !== statusFilter) return false;

    // Date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      const recordDate = new Date(record.date);
      if (recordDate < fromDate) return false;
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      const recordDate = new Date(record.date);
      if (recordDate > toDate) return false;
    }

    return true;
  });

  // Table columns for billing history
  const billingColumns = [
    {
      key: 'date',
      header: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'invoiceNumber',
      header: 'Invoice Number',
      render: (value: string) => (
        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800 font-medium">
          {value}
        </Button>
      )
    },
    {
      key: 'policyType',
      header: 'Policy Type',
      render: (value: string) => value
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value: number) => formatCurrency(value)
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      render: (value: string, row: BillingRecord) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(value)}
          <span className="text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      render: (value: string) => value
    },
    {
      key: 'actions',
      header: 'Action',
      render: (value: any, row: BillingRecord) => (
        <Button variant="outline" size="sm" icon={Download} iconPosition="left">
          Download PDF
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
         
          <Text>Manage your billing history, payment methods, and preferences</Text>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Billing Overview', icon: FileText },
                { id: 'methods', label: 'Payment Methods', icon: CreditCard },
                { id: 'autopay', label: 'Autopay', icon: Clock },
                { id: 'refund', label: 'Request Refund', icon: Download },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'primary' : 'outline'}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="border-b-2 border-transparent"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <H2>Billing History</H2>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="all">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              {/* Billing Table */}
              <Table
                columns={billingColumns}
                data={filteredBillingHistory}
                emptyMessage="No billing records found for the selected criteria."
              />
            </div>
          </div>
        )}

        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <H2>Payment Methods</H2>
                <Button
                  icon={Plus}
                  iconPosition="left"
                  onClick={() => setShowAddPaymentModal(true)}
                >
                  Add Payment Method
                </Button>
              </div>

              {/* Payment Methods List */}
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-8 h-8 text-gray-500" />
                      <div>
                        <TextLarge>{method.cardNumber}</TextLarge>
                        <TextSmall>Expires {method.expiryDate} • {method.cardholderName}</TextSmall>
                        {method.isDefault && <span className="text-xs text-blue-600 font-medium">Default</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" icon={Edit} onClick={() => handleEditClick(method)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" icon={Trash2}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Payment Method Modal */}
              {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <H3>Edit Payment Method</H3>
                    <div className="space-y-4">
                      {/* Remove the Payment Method Type select from edit */}
                      {/* Only show fields relevant to the existing method type */}
                      {/* Credit/Debit Card fields */}
                      {(editPaymentMethod.type === 'credit' || editPaymentMethod.type === 'debit') && (
                        <>
                          <div>
                            <Label>{editPaymentMethod.type === 'credit' ? 'Credit' : 'Debit'} Card Number</Label>
                            <input
                              type="text"
                              placeholder="Card Number (leave blank to keep unchanged)"
                              value={editPaymentMethod.cardNumber}
                              onChange={e => setEditPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Expiry Date</Label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={editPaymentMethod.expiryDate}
                                onChange={e => setEditPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                              />
                            </div>
                            <div>
                              <Label>CVV</Label>
                              <input
                                type="text"
                                placeholder="123"
                                value={editPaymentMethod.cvv}
                                onChange={e => setEditPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Cardholder Name</Label>
                            <input
                              type="text"
                              placeholder="Cardholder Name"
                              value={editPaymentMethod.cardholderName}
                              onChange={e => setEditPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                        </>
                      )}
                      {/* ACH fields */}
                      {editPaymentMethod.type === 'ach' && (
                        <>
                          <div>
                            <Label>Account Holder Name</Label>
                            <input
                              type="text"
                              placeholder="Account Holder Name"
                              value={editPaymentMethod.cardholderName}
                              onChange={e => setEditPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <Label>Bank Account Number</Label>
                            <input
                              type="text"
                              placeholder="Account Number"
                              value={editPaymentMethod.cardNumber}
                              onChange={e => setEditPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <Label>Routing Number</Label>
                            <input
                              type="text"
                              placeholder="Routing Number"
                              value={editPaymentMethod.cvv}
                              onChange={e => setEditPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                        </>
                      )}
                      {/* Digital Wallet fields */}
                      {editPaymentMethod.type === 'digital' && (
                        <>
                          <div>
                            <Label>Wallet Provider</Label>
                            <input
                              type="text"
                              placeholder="PayPal, Google Pay, etc."
                              value={editPaymentMethod.cardholderName}
                              onChange={e => setEditPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <Label>Wallet Email / ID</Label>
                            <input
                              type="text"
                              placeholder="your@email.com"
                              value={editPaymentMethod.cardNumber}
                              onChange={e => setEditPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <Label>
                          <input
                            type="checkbox"
                            checked={!!editPaymentMethod.isDefault}
                            onChange={e =>
                              setEditPaymentMethod(prev => ({
                                ...prev,
                                isDefault: e.target.checked
                              }))
                            }
                            className="mr-2"
                          />
                          Set as default payment method
                        </Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowEditModal(false);
                          setEditMethodId(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleEditSave(editMethodId!)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Payment Method Modal */}
              {showAddPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <H3>Add Payment Method</H3>
                    <div className="space-y-4">
                      <div>
                        <Label>Payment Method Type</Label>
                        <select
                          value={newPaymentMethod.type}
                          onChange={e => setNewPaymentMethod(prev => ({
                            ...prev,
                            type: e.target.value as 'credit' | 'debit' | 'ach' | 'digital'
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="credit">Credit Card</option>
                          <option value="debit">Debit Card</option>
                          <option value="ach">Bank Account (ACH)</option>
                          <option value="digital">Digital Wallet</option>
                        </select>
                      </div>
                      {/* Credit/Debit Card fields */}
                      {(newPaymentMethod.type === 'credit' || newPaymentMethod.type === 'debit') && (
                        <>
                          <div>
                            <Label>{newPaymentMethod.type === 'credit' ? 'Credit' : 'Debit'} Card Number</Label>
                            <input
                              type="text"
                              value={newPaymentMethod.cardNumber}
                              onChange={e => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                              placeholder="1234 5678 9012 3456"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Expiry Date</Label>
                              <input
                                type="text"
                                value={newPaymentMethod.expiryDate}
                                onChange={e => setNewPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                                placeholder="MM/YY"
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                              />
                            </div>
                            <div>
                              <Label>CVV</Label>
                              <input
                                type="text"
                                value={newPaymentMethod.cvv}
                                onChange={e => setNewPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                                placeholder="123"
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Cardholder Name</Label>
                            <input
                              type="text"
                              value={newPaymentMethod.cardholderName}
                              onChange={e => setNewPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                              placeholder="John Doe"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                        </>
                      )}
                      {/* ACH fields */}
                      {newPaymentMethod.type === 'ach' && (
                        <>
                          <div>
                            <Label>Account Holder Name</Label>
                            <input
                              type="text"
                              value={newPaymentMethod.cardholderName}
                              onChange={e => setNewPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                              placeholder="John Doe"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <Label>Bank Account Number</Label>
                            <input
                              type="text"
                              value={newPaymentMethod.cardNumber}
                              onChange={e => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                              placeholder="Account Number"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <Label>Routing Number</Label>
                            <input
                              type="text"
                              value={newPaymentMethod.cvv}
                              onChange={e => setNewPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                              placeholder="Routing Number"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                        </>
                      )}
                      {/* Digital Wallet fields */}
                      {newPaymentMethod.type === 'digital' && (
                        <>
                          <div>
                            <Label>Wallet Provider</Label>
                            <input
                              type="text"
                              value={newPaymentMethod.cardholderName}
                              onChange={e => setNewPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                              placeholder="PayPal, Google Pay, etc."
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <Label>Wallet Email / ID</Label>
                            <input
                              type="text"
                              value={newPaymentMethod.cardNumber}
                              onChange={e => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                              placeholder="your@email.com"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddPaymentModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddPaymentMethod}>
                        Add Method
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'autopay' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <H2>Autopay Settings</H2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <H3>Automatic Payments</H3>
                  <Text>
                    {autopayEnabled 
                      ? 'Your premiums will be automatically charged to your default payment method'
                      : 'Manual payments required before due date'
                    }
                  </Text>
                </div>
                <SwitchToggle
                  checked={autopayEnabled}
                  onChange={setAutopayEnabled}
                />
              </div>
              
              {autopayEnabled && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <TextSmall color="primary">
                    <strong>Next scheduled payment:</strong> January 15, 2025 - $1,250.00
                  </TextSmall>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'refund' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <H2>Request Refund</H2>
            
            {!showRefundForm ? (
              <div className="text-center py-8">
                <Text>Need a refund for a recent payment?</Text>
                <div className="mt-4">
                  <Button onClick={() => setShowRefundForm(true)}>
                    Request a Refund
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label>Select Transaction</Label>
                  <select
                    value={refundRequest.transactionId}
                    onChange={(e) => setRefundRequest(prev => ({ ...prev, transactionId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Choose a transaction...</option>
                    {billingHistory.filter(record => record.paymentStatus === 'Paid').map(record => (
                      <option key={record.id} value={record.id}>
                        {record.invoiceNumber} - {formatCurrency(record.amount)} ({new Date(record.date).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label>Reason for Refund</Label>
                  <textarea
                    value={refundRequest.reason}
                    onChange={(e) => setRefundRequest(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Please provide a detailed reason for your refund request (minimum 10 characters)"
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <TextSmall className="mt-1">
                    {refundRequest.reason.length}/10 characters minimum
                  </TextSmall>
                </div>
                
                <div>
                  <Label>Supporting Document</Label>
                  <input
                    type="file"
                    onChange={(e) => setRefundRequest(prev => ({ ...prev, document: e.target.files?.[0] || null }))}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <TextSmall className="mt-1">
                    PDF, JPG, or PNG files only (max 5MB)
                  </TextSmall>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowRefundForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRefundSubmit}
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <H2>Notification Preferences</H2>
            <div className="space-y-6">
              <div className="space-y-4">
                {Object.entries(notificationPrefs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <H3>{key.charAt(0).toUpperCase() + key.slice(1)} Alerts</H3>
                      <TextSmall>
                        Receive billing alerts via {key === 'push' ? 'push notifications' : `your ${key}`}.
                      </TextSmall>
                    </div>
                    <SwitchToggle
                      checked={value}
                      onChange={checked =>
                        setNotificationPrefs(prev => ({
                          ...prev,
                          [key]: checked
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleNotificationSave}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPayments;