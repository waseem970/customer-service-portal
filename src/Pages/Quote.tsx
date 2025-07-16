import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { Button, H1, H2, H3, Text, TextSmall, TextLarge, Label } from '../components/common';
import TextField from '../components/common/TextField';
import Dropdown from '../components/common/Dropdown';

// Move these field components OUTSIDE the main function to prevent remounting and input focus loss
const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  className = '',
  errors = {}
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  errors?: Record<string, string>;
}) => (
  <div className={`mb-4 ${className}`}>
    <Label>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <TextField
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors[name] ? 'border-red-500' : 'border-gray-300'
      }`}
      required={required}
    />
    {errors[name] && (
      <div className="flex items-center mt-1 text-red-500 text-sm">
        <AlertCircle className="w-4 h-4 mr-1" />
        {errors[name]}
      </div>
    )}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className = '',
  errors = {}
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  className?: string;
  errors?: Record<string, string>;
}) => (
  <div className={`mb-4 ${className}`}>
    <Label>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Dropdown
      name={name}
      value={value}
      onChange={onChange}
      options={[
        { label: `Select ${label}`, value: '' },
        ...options.map((option) => ({ label: option, value: option }))
      ]}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors[name] ? 'border-red-500' : 'border-gray-300'
      }`}
      required={required}
    />
    {errors[name] && (
      <div className="flex items-center mt-1 text-red-500 text-sm">
        <AlertCircle className="w-4 h-4 mr-1" />
        {errors[name]}
      </div>
    )}
  </div>
);

const TextAreaField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = '',
  className = '',
  errors = {}
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  errors?: Record<string, string>;
}) => (
  <div className={`mb-4 ${className}`}>
    <Label>{label}</Label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors[name] && (
      <div className="flex items-center mt-1 text-red-500 text-sm">
        <AlertCircle className="w-4 h-4 mr-1" />
        {errors[name]}
      </div>
    )}
  </div>
);

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AutoInsurance {
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin: string;
  usageType: string;
  annualMileage: string;
  garageLocation: string;
  accidents: string;
  claims: string;
  violations: string;
  currentCarrier: string;
  currentCoverage: string;
  desiredCoverage: string;
  deductible: string;
}

interface HomeInsurance {
  propertyAddress: string;
  propertyType: string;
  yearBuilt: string;
  squareFootage: string;
  constructionMaterial: string;
  lenderName: string;
  loanAmount: string;
  securityFeatures: string[];
  claimsHistory: string;
  desiredCoverage: string;
  personalPropertyValue: string;
}

interface LifeInsurance {
  healthConditions: string;
  medications: string;
  smoking: string;
  drinking: string;
  riskyHobbies: string;
  beneficiaryName: string;
  beneficiaryRelationship: string;
  beneficiaryPercentage: string;
  desiredCoverageAmount: string;
  coverageTerm: string;
  annualIncome: string;
  debts: string;
  medicalExamConsent: boolean;
}

type InsuranceType = 'auto' | 'home' | 'life';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const SECURITY_FEATURES = [
  'Security Alarm', 'Smoke Detector', 'Security Cameras', 'Deadbolt Locks', 'Motion Sensors'
];

export default function InsuranceQuoteForm() {
  const [step, setStep] = useState(1);
  const [policyType, setPolicyType] = useState<InsuranceType>('auto');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [autoInsurance, setAutoInsurance] = useState<AutoInsurance>({
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vin: '',
    usageType: '',
    annualMileage: '',
    garageLocation: '',
    accidents: '',
    claims: '',
    violations: '',
    currentCarrier: '',
    currentCoverage: '',
    desiredCoverage: '',
    deductible: ''
  });

  const [homeInsurance, setHomeInsurance] = useState<HomeInsurance>({
    propertyAddress: '',
    propertyType: '',
    yearBuilt: '',
    squareFootage: '',
    constructionMaterial: '',
    lenderName: '',
    loanAmount: '',
    securityFeatures: [],
    claimsHistory: '',
    desiredCoverage: '',
    personalPropertyValue: ''
  });

  const [lifeInsurance, setLifeInsurance] = useState<LifeInsurance>({
    healthConditions: '',
    medications: '',
    smoking: '',
    drinking: '',
    riskyHobbies: '',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    beneficiaryPercentage: '',
    desiredCoverageAmount: '',
    coverageTerm: '',
    annualIncome: '',
    debts: '',
    medicalExamConsent: false
  });

  const validatePersonalInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!personalInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!personalInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!personalInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) newErrors.email = 'Email is invalid';
    if (!personalInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!personalInfo.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!personalInfo.city.trim()) newErrors.city = 'City is required';
    if (!personalInfo.state) newErrors.state = 'State is required';
    if (!personalInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(personalInfo.zipCode)) newErrors.zipCode = 'ZIP code is invalid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInsuranceForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (policyType === 'auto') {
      if (!autoInsurance.vehicleYear) newErrors.vehicleYear = 'Vehicle year is required';
      if (!autoInsurance.vehicleMake) newErrors.vehicleMake = 'Vehicle make is required';
      if (!autoInsurance.vehicleModel) newErrors.vehicleModel = 'Vehicle model is required';
      if (!autoInsurance.vin) newErrors.vin = 'VIN is required';
      if (!autoInsurance.usageType) newErrors.usageType = 'Usage type is required';
      if (!autoInsurance.annualMileage) newErrors.annualMileage = 'Annual mileage is required';
    } else if (policyType === 'home') {
      if (!homeInsurance.propertyAddress) newErrors.propertyAddress = 'Property address is required';
      if (!homeInsurance.propertyType) newErrors.propertyType = 'Property type is required';
      if (!homeInsurance.yearBuilt) newErrors.yearBuilt = 'Year built is required';
      if (!homeInsurance.squareFootage) newErrors.squareFootage = 'Square footage is required';
    } else if (policyType === 'life') {
      if (!lifeInsurance.beneficiaryName) newErrors.beneficiaryName = 'Beneficiary name is required';
      if (!lifeInsurance.beneficiaryRelationship) newErrors.beneficiaryRelationship = 'Beneficiary relationship is required';
      if (!lifeInsurance.desiredCoverageAmount) newErrors.desiredCoverageAmount = 'Coverage amount is required';
      if (!lifeInsurance.annualIncome) newErrors.annualIncome = 'Annual income is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validatePersonalInfo()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateInsuranceForm()) {
        setStep(3);
      }
    }
  };

  const handleSubmit = () => {
    if (validatePersonalInfo() && validateInsuranceForm()) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#37517e' }}>
            <Check className="w-8 h-8 text-white" />
          </div>
          <H2>Quote Request Submitted!</H2>
          <Text className="mb-6">
            Thank you for your interest. An advisor will contact you within 24 hours with your personalized quote.
          </Text>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setStep(1);
              setPersonalInfo({
                firstName: '', lastName: '', email: '', phone: '',
                streetAddress: '', city: '', state: '', zipCode: ''
              });
            }}
          >
            Submit Another Quote
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
            <H1>Get Your Insurance Quote</H1>
        
          <Text>
            Complete the form below to receive a personalized quote from our advisors
          </Text>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <TextSmall>Step {step} of 3</TextSmall>
            <TextSmall>{Math.round((step / 3) * 100)}%</TextSmall>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: '#37517e',
                width: `${(step / 3) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 1 && (
            <div>
              <H2>Personal Information</H2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="firstName"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                  required
                  errors={errors}
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                  required
                  errors={errors}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  required
                  errors={errors}
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  required
                  errors={errors}
                />
                <InputField
                  label="Street Address"
                  name="streetAddress"
                  value={personalInfo.streetAddress}
                  onChange={(e) => setPersonalInfo({...personalInfo, streetAddress: e.target.value})}
                  required
                  className="md:col-span-2"
                  errors={errors}
                />
                <InputField
                  label="City"
                  name="city"
                  value={personalInfo.city}
                  onChange={(e) => setPersonalInfo({...personalInfo, city: e.target.value})}
                  required
                  errors={errors}
                />
                <SelectField
                  label="State"
                  name="state"
                  value={personalInfo.state}
                  onChange={(e) => setPersonalInfo({...personalInfo, state: e.target.value})}
                  options={US_STATES}
                  required
                  errors={errors}
                />
                <InputField
                  label="ZIP Code"
                  name="zipCode"
                  value={personalInfo.zipCode}
                  onChange={(e) => setPersonalInfo({...personalInfo, zipCode: e.target.value})}
                  required
                  placeholder="12345 or 12345-6789"
                  errors={errors}
                />
              </div>

              <div className="mt-8">
                <H3>Select Policy Type</H3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'auto', label: 'Auto Insurance', icon: '🚗' },
                    { value: 'home', label: 'Home Insurance', icon: '🏠' },
                    { value: 'life', label: 'Life Insurance', icon: '❤️' }
                  ].map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="policyType"
                        value={option.value}
                        checked={policyType === option.value}
                        onChange={(e) => setPolicyType(e.target.value as InsuranceType)}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                        policyType === option.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="font-medium">{option.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && policyType === 'auto' && (
            <div>
              <H2>🚗 Auto Insurance Details</H2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Vehicle Year"
                  name="vehicleYear"
                  value={autoInsurance.vehicleYear}
                  onChange={(e) => setAutoInsurance({...autoInsurance, vehicleYear: e.target.value})}
                  required
                  errors={errors}
                />
                <InputField
                  label="Vehicle Make"
                  name="vehicleMake"
                  value={autoInsurance.vehicleMake}
                  onChange={(e) => setAutoInsurance({...autoInsurance, vehicleMake: e.target.value})}
                  required
                  errors={errors}
                />
                <InputField
                  label="Vehicle Model"
                  name="vehicleModel"
                  value={autoInsurance.vehicleModel}
                  onChange={(e) => setAutoInsurance({...autoInsurance, vehicleModel: e.target.value})}
                  required
                  errors={errors}
                />
                <InputField
                  label="VIN"
                  name="vin"
                  value={autoInsurance.vin}
                  onChange={(e) => setAutoInsurance({...autoInsurance, vin: e.target.value})}
                  required
                  errors={errors}
                />
                <SelectField
                  label="Usage Type"
                  name="usageType"
                  value={autoInsurance.usageType}
                  onChange={(e) => setAutoInsurance({...autoInsurance, usageType: e.target.value})}
                  options={['Personal', 'Business', 'Commuting']}
                  required
                  errors={errors}
                />
                <InputField
                  label="Annual Mileage"
                  name="annualMileage"
                  value={autoInsurance.annualMileage}
                  onChange={(e) => setAutoInsurance({...autoInsurance, annualMileage: e.target.value})}
                  required
                  errors={errors}
                />
                <InputField
                  label="Garage/Parking Location"
                  name="garageLocation"
                  value={autoInsurance.garageLocation}
                  onChange={(e) => setAutoInsurance({...autoInsurance, garageLocation: e.target.value})}
                  placeholder="ZIP code or Address"
                  className="md:col-span-2"
                  errors={errors}
                />
              </div>

              <div className="mt-6">
                <H3>Driving History</H3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextAreaField
                    label="Accidents (with dates)"
                    name="accidents"
                    value={autoInsurance.accidents}
                    onChange={(e) => setAutoInsurance({...autoInsurance, accidents: e.target.value})}
                    placeholder="List any accidents with dates"
                    errors={errors}
                  />
                  <TextAreaField
                    label="Claims (with dates)"
                    name="claims"
                    value={autoInsurance.claims}
                    onChange={(e) => setAutoInsurance({...autoInsurance, claims: e.target.value})}
                    placeholder="List any claims with dates"
                    errors={errors}
                  />
                  <TextAreaField
                    label="Violations (with dates)"
                    name="violations"
                    value={autoInsurance.violations}
                    onChange={(e) => setAutoInsurance({...autoInsurance, violations: e.target.value})}
                    placeholder="List any violations with dates"
                    errors={errors}
                  />
                </div>
              </div>

              <div className="mt-6">
                <H3>Current & Desired Coverage</H3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Current Insurance Carrier"
                    name="currentCarrier"
                    value={autoInsurance.currentCarrier}
                    onChange={(e) => setAutoInsurance({...autoInsurance, currentCarrier: e.target.value})}
                    errors={errors}
                  />
                  <InputField
                    label="Current Coverage"
                    name="currentCoverage"
                    value={autoInsurance.currentCoverage}
                    onChange={(e) => setAutoInsurance({...autoInsurance, currentCoverage: e.target.value})}
                    errors={errors}
                  />
                  <InputField
                    label="Desired Coverage Types & Limits"
                    name="desiredCoverage"
                    value={autoInsurance.desiredCoverage}
                    onChange={(e) => setAutoInsurance({...autoInsurance, desiredCoverage: e.target.value})}
                    errors={errors}
                  />
                  <InputField
                    label="Deductible Preferences"
                    name="deductible"
                    value={autoInsurance.deductible}
                    onChange={(e) => setAutoInsurance({...autoInsurance, deductible: e.target.value})}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && policyType === 'home' && (
            <div>
              <H2>🏠 Home Insurance Details</H2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Property Address"
                  name="propertyAddress"
                  value={homeInsurance.propertyAddress}
                  onChange={(e) => setHomeInsurance({...homeInsurance, propertyAddress: e.target.value})}
                  required
                  className="md:col-span-2"
                  errors={errors}
                />
                <SelectField
                  label="Property Type"
                  name="propertyType"
                  value={homeInsurance.propertyType}
                  onChange={(e) => setHomeInsurance({...homeInsurance, propertyType: e.target.value})}
                  options={['Single Family', 'Condo', 'Rental']}
                  required
                  errors={errors}
                />
                <InputField
                  label="Year Built"
                  name="yearBuilt"
                  value={homeInsurance.yearBuilt}
                  onChange={(e) => setHomeInsurance({...homeInsurance, yearBuilt: e.target.value})}
                  required
                  errors={errors}
                />
                <InputField
                  label="Square Footage"
                  name="squareFootage"
                  value={homeInsurance.squareFootage}
                  onChange={(e) => setHomeInsurance({...homeInsurance, squareFootage: e.target.value})}
                  required
                  errors={errors}
                />
                <SelectField
                  label="Construction Materials"
                  name="constructionMaterial"
                  value={homeInsurance.constructionMaterial}
                  onChange={(e) => setHomeInsurance({...homeInsurance, constructionMaterial: e.target.value})}
                  options={['Wood', 'Brick', 'Stone', 'Vinyl', 'Stucco']}
                  errors={errors}
                />
                <InputField
                  label="Lender Name"
                  name="lenderName"
                  value={homeInsurance.lenderName}
                  onChange={(e) => setHomeInsurance({...homeInsurance, lenderName: e.target.value})}
                  errors={errors}
                />
                <InputField
                  label="Loan Amount"
                  name="loanAmount"
                  value={homeInsurance.loanAmount}
                  onChange={(e) => setHomeInsurance({...homeInsurance, loanAmount: e.target.value})}
                  placeholder="$"
                  errors={errors}
                />
              </div>

              <div className="mt-6">
                <H3>Security Features</H3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SECURITY_FEATURES.map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={homeInsurance.securityFeatures.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHomeInsurance({
                              ...homeInsurance,
                              securityFeatures: [...homeInsurance.securityFeatures, feature]
                            });
                          } else {
                            setHomeInsurance({
                              ...homeInsurance,
                              securityFeatures: homeInsurance.securityFeatures.filter(f => f !== feature)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <TextSmall>{feature}</TextSmall>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextAreaField
                    label="Claims History (Past 5 years)"
                    name="claimsHistory"
                    value={homeInsurance.claimsHistory}
                    onChange={(e) => setHomeInsurance({...homeInsurance, claimsHistory: e.target.value})}
                    placeholder="List any claims in the past 5 years"
                    errors={errors}
                  />
                  <div>
                    <InputField
                      label="Desired Coverage Amounts"
                      name="desiredCoverage"
                      value={homeInsurance.desiredCoverage}
                      onChange={(e) => setHomeInsurance({...homeInsurance, desiredCoverage: e.target.value})}
                      placeholder="$"
                      errors={errors}
                    />
                    <InputField
                      label="Personal Property Value Estimate"
                      name="personalPropertyValue"
                      value={homeInsurance.personalPropertyValue}
                      onChange={(e) => setHomeInsurance({...homeInsurance, personalPropertyValue: e.target.value})}
                      placeholder="$"
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && policyType === 'life' && (
            <div>
              <H2>❤️ Life Insurance Details</H2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextAreaField
                  label="Health Conditions"
                  name="healthConditions"
                  value={lifeInsurance.healthConditions}
                  onChange={(e) => setLifeInsurance({...lifeInsurance, healthConditions: e.target.value})}
                  placeholder="List any health conditions"
                  errors={errors}
                />
                <TextAreaField
                  label="Current Medications"
                  name="medications"
                  value={lifeInsurance.medications}
                  onChange={(e) => setLifeInsurance({...lifeInsurance, medications: e.target.value})}
                  placeholder="List current medications"
                  errors={errors}
                />
                <SelectField
                  label="Smoking Status"
                  name="smoking"
                  value={lifeInsurance.smoking}
                  onChange={(e) => setLifeInsurance({...lifeInsurance, smoking: e.target.value})}
                  options={['Never', 'Former', 'Current']}
                  errors={errors}
                />
                <SelectField
                  label="Drinking Habits"
                  name="drinking"
                  value={lifeInsurance.drinking}
                  onChange={(e) => setLifeInsurance({...lifeInsurance, drinking: e.target.value})}
                  options={['Never', 'Occasionally', 'Regularly']}
                  errors={errors}
                />
                <TextAreaField
                  label="Risky Hobbies"
                  name="riskyHobbies"
                  value={lifeInsurance.riskyHobbies}
                  onChange={(e) => setLifeInsurance({...lifeInsurance, riskyHobbies: e.target.value})}
                  placeholder="List any risky hobbies (skydiving, racing, etc.)"
                  errors={errors}
                />
              </div>

              <div className="mt-6">
                <H3>Beneficiary Details</H3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Beneficiary Name"
                    name="beneficiaryName"
                    value={lifeInsurance.beneficiaryName}
                    onChange={(e) => setLifeInsurance({...lifeInsurance, beneficiaryName: e.target.value})}
                    required
                    errors={errors}
                  />
                  <InputField
                    label="Relationship"
                    name="beneficiaryRelationship"
                    value={lifeInsurance.beneficiaryRelationship}
                    onChange={(e) => setLifeInsurance({...lifeInsurance, beneficiaryRelationship: e.target.value})}
                    required
                    errors={errors}
                  />
                  <InputField
                    label="Percentage"
                    name="beneficiaryPercentage"
                    value={lifeInsurance.beneficiaryPercentage}
                    onChange={(e) => setLifeInsurance({...lifeInsurance, beneficiaryPercentage: e.target.value})}
                    placeholder="100%"
                    errors={errors}
                  />
                </div>
              </div>

              <div className="mt-6">
                <H3>Coverage & Financial Details</H3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Desired Coverage Amount"
                    name="desiredCoverageAmount"
                    value={lifeInsurance.desiredCoverageAmount}
                    onChange={(e) => setLifeInsurance({...lifeInsurance, desiredCoverageAmount: e.target.value})}
                    placeholder="$"
                    required
                    errors={errors}
                  />
                  <SelectField
                    label="Coverage Term"
                    name="coverageTerm"
                    value={lifeInsurance.coverageTerm}
                    onChange={(e) => setLifeInsurance({...lifeInsurance, coverageTerm: e.target.value})}
                    options={['10 years', '20 years', '30 years', 'Whole Life']}
                    errors={errors}
                  />
                  <InputField
                    label="Annual Income"
                    name="annualIncome"
                    value={lifeInsurance.annualIncome}
                    onChange={(e) => setLifeInsurance({...lifeInsurance, annualIncome: e.target.value})}
                    placeholder="$"
                    required
                    errors={errors}
                  />
                  <InputField
                    label="Total Debts"
                    name="debts"
                    value={lifeInsurance.debts}
                    onChange={(e) => setLifeInsurance({...lifeInsurance, debts: e.target.value})}
                    placeholder="$"
                    errors={errors}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={lifeInsurance.medicalExamConsent}
                    onChange={(e) => setLifeInsurance({...lifeInsurance, medicalExamConsent: e.target.checked})}
                    className="mr-2"
                  />
                  <TextSmall>
                    I agree to undergo a medical exam if required.
                  </TextSmall>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <H2>Review Your Information</H2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <H3>Personal Information</H3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <TextSmall><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</TextSmall>
                    <TextSmall><strong>Email:</strong> {personalInfo.email}</TextSmall>
                    <TextSmall><strong>Phone:</strong> {personalInfo.phone}</TextSmall>
                    <TextSmall><strong>Address:</strong> {personalInfo.streetAddress}, {personalInfo.city}, {personalInfo.state} {personalInfo.zipCode}</TextSmall>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <H3>
                    Policy Type: {policyType === 'auto' ? '🚗 Auto Insurance' : policyType === 'home' ? '🏠 Home Insurance' : '❤️ Life Insurance'}
                  </H3>
                  
                  {policyType === 'auto' && (
                    <div className="text-sm">
                      <TextSmall><strong>Vehicle:</strong> {autoInsurance.vehicleYear} {autoInsurance.vehicleMake} {autoInsurance.vehicleModel}</TextSmall>
                      <TextSmall><strong>VIN:</strong> {autoInsurance.vin}</TextSmall>
                      <TextSmall><strong>Usage:</strong> {autoInsurance.usageType}</TextSmall>
                      <TextSmall><strong>Annual Mileage:</strong> {autoInsurance.annualMileage}</TextSmall>
                    </div>
                  )}
                  
                  {policyType === 'home' && (
                    <div className="text-sm">
                      <TextSmall><strong>Property:</strong> {homeInsurance.propertyAddress}</TextSmall>
                      <TextSmall><strong>Type:</strong> {homeInsurance.propertyType}</TextSmall>
                      <TextSmall><strong>Year Built:</strong> {homeInsurance.yearBuilt}</TextSmall>
                      <TextSmall><strong>Square Footage:</strong> {homeInsurance.squareFootage}</TextSmall>
                    </div>
                  )}
                  
                  {policyType === 'life' && (
                    <div className="text-sm">
                      <TextSmall><strong>Beneficiary:</strong> {lifeInsurance.beneficiaryName} ({lifeInsurance.beneficiaryRelationship})</TextSmall>
                      <TextSmall><strong>Coverage Amount:</strong> {lifeInsurance.desiredCoverageAmount}</TextSmall>
                      <TextSmall><strong>Term:</strong> {lifeInsurance.coverageTerm}</TextSmall>
                      <TextSmall><strong>Annual Income:</strong> {lifeInsurance.annualIncome}</TextSmall>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <TextSmall>
                  <strong>Disclaimer:</strong> By clicking the Submit Quote Request button, you agree to our 
                  <a href="#" className="text-blue-600 hover:underline ml-1">Terms and Conditions</a> and 
                  consent to be contacted by an Advisor.
                </TextSmall>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              icon={ChevronLeft}
              iconPosition="left"
            >
              Back
            </Button>

            {step < 3 ? (
              <Button
                onClick={handleNext}
                icon={ChevronRight}
                iconPosition="right"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                icon={Check}
                iconPosition="right"
              >
                Submit Quote Request
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}