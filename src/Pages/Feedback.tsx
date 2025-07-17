import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Phone, Mail, MessageCircle, Star, Upload, Check } from 'lucide-react';
import { Button, H1, H2, H3, Text, TextSmall, TextLarge, Label } from '../components/common';
import Dropdown from '../components/common/Dropdown';
import TextField from '../components/common/TextField';
 
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: boolean | null;
}
 
interface FeedbackData {
  rating: number;
  message: string;
  contactConsent: boolean;
  name: string;
  email: string;
}
 
const Feedback: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [emailSupport, setEmailSupport] = useState({
    subject: '',
    message: '',
    file: null as File | null
  });
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    message: '',
    contactConsent: false,
    name: '',
    email: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{
    email: boolean;
    feedback: boolean;
  }>({
    email: false,
    feedback: false
  });
 
  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on the "Forgot Password" link on the login page and follow the instructions sent to your email.',
      category: 'Account & Login',
      helpful: null
    },
    {
      id: '2',
      question: 'What documents do I need to file a claim?',
      answer: 'You will need your policy number, incident report, photos of damage (if applicable), and any relevant receipts or documentation.',
      category: 'Claims & Filing',
      helpful: null
    },
    {
      id: '3',
      question: 'How can I update my billing information?',
      answer: 'Log into your account, go to the Billing section, and click "Update Payment Method" to change your billing information.',
      category: 'Billing & Payments',
      helpful: null
    },
    {
      id: '4',
      question: 'What is covered under my policy?',
      answer: 'Coverage details vary by policy type. Please review your policy documents or contact our support team for specific coverage information.',
      category: 'Policies & Coverage',
      helpful: null
    },
    {
      id: '5',
      question: 'How do I add a new user to my account?',
      answer: 'Navigate to Account Settings, select "Manage Users," and click "Add New User" to send an invitation.',
      category: 'Account & Login',
      helpful: null
    },
    {
      id: '6',
      question: 'When will I receive my claim payment?',
      answer: 'Claim payments are typically processed within 5-10 business days after approval. You will receive a notification when payment is issued.',
      category: 'Claims & Filing',
      helpful: null
    }
  ];
 
  const categories = ['Account & Login', 'Policies & Coverage', 'Claims & Filing', 'Billing & Payments'];
 
  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };
 
  const handleEmailSubmit = () => {
    if (emailSupport.subject && emailSupport.message) {
      setSubmitStatus(prev => ({ ...prev, email: true }));
      // Reset form
      setEmailSupport({ subject: '', message: '', file: null });
      setTimeout(() => setSubmitStatus(prev => ({ ...prev, email: false })), 3000);
    }
  };
 
  const handleFeedbackSubmit = () => {
    if (feedback.rating > 0) {
      setSubmitStatus(prev => ({ ...prev, feedback: true }));
      // Reset form
      setFeedback({
        rating: 0,
        message: '',
        contactConsent: false,
        name: '',
        email: ''
      });
      setTimeout(() => setSubmitStatus(prev => ({ ...prev, feedback: false })), 3000);
    }
  };
 
  const handleStarClick = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };
 
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEmailSupport(prev => ({ ...prev, file }));
  };
 
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
          <H1>Help & Feedback</H1>
          <Text>Find answers, get support, or share your thoughts with us</Text>
        </div>
  
 
        {/* Searchable FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <H2>Frequently Asked Questions</H2>
         
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Common Questions"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
 
          <div className="space-y-4">
            {categories.map(category => {
              const categoryFAQs = filteredFAQs.filter(faq => faq.category === category);
              if (categoryFAQs.length === 0) return null;
 
              return (
                <div key={category} className="border border-gray-200 rounded-lg">
                  <div className="px-4 py-2 bg-gray-100 font-medium text-gray-700">
                    {category}
                  </div>
                  <div className="divide-y divide-gray-200">
                    {categoryFAQs.map(faq => (
                      <div key={faq.id} className="p-4">
                        <Button
                          variant="outline"
                          onClick={() => handleFAQToggle(faq.id)}
                          className="flex justify-between items-center w-full text-left"
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </Button>
                        {expandedFAQ === faq.id && (
                          <div className="mt-3">
                            <Text className="mb-3">{faq.answer}</Text>
                            <div className="flex items-center gap-2 text-sm">
                              <TextSmall>Was this helpful?</TextSmall>
                              <Button variant="outline" size="sm" icon={ThumbsUp} iconPosition="left">
                                Yes
                              </Button>
                              <Button variant="outline" size="sm" icon={ThumbsDown} iconPosition="left">
                                No
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
 
        {/* Contact Support Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <H2>Need More Help? Contact Us</H2>
         
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Live Chat */}
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <MessageCircle className="h-8 w-8 mx-auto mb-2" style={{ color: '#37517e' }} />
              <H3>Live Chat</H3>
              <TextSmall className="mb-3">Available 9 AM - 6 PM EST</TextSmall>
              <Button variant="success">
                Chat Now
              </Button>
            </div>
 
            {/* Phone Support */}
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <Phone className="h-8 w-8 mx-auto mb-2" style={{ color: '#37517e' }} />
              <H3>Phone Support</H3>
              <TextSmall className="mb-1">1-800-HELP-NOW</TextSmall>
              <TextSmall>9 AM - 6 PM EST</TextSmall>
            </div>
 
            {/* Email Support */}
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <Mail className="h-8 w-8 mx-auto mb-2" style={{ color: '#37517e' }} />
              <H3>Email Support</H3>
              <TextSmall>We'll respond within 24 hours</TextSmall>
            </div>
          </div>
 
          {/* Email Support Form */}
          <div className="border-t border-gray-200 pt-6">
            <H3>Send us an Email</H3>
            {submitStatus.email ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <TextSmall color="success">Thank you! Our team will get back to you shortly.</TextSmall>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <Dropdown
                    value={emailSupport.subject}
                    onChange={(e) => setEmailSupport(prev => ({ ...prev, subject: e.target.value }))}
                    options={[
                      { label: 'Select a subject', value: '' },
                      { label: 'Account', value: 'Account' },
                      { label: 'Billing', value: 'Billing' },
                      { label: 'Claims', value: 'Claims' },
                      { label: 'Technical Issue', value: 'Technical Issue' },
                      { label: 'Other', value: 'Other' }
                    ]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
               
                <div>
                  <Label>Message</Label>
                  <textarea
                    value={emailSupport.message}
                    onChange={(e) => setEmailSupport(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your issue or question..."
                    required
                  />
                </div>
 
                <div>
                  <Label>
                    Attachment (optional)
                  </Label>
                  <div className="flex items-center gap-2">
                    <TextField
                      type="file"
                      value={''}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </label>
                    {emailSupport.file && (
                      <TextSmall>{emailSupport.file.name}</TextSmall>
                    )}
                  </div>
                </div>
 
                <Button onClick={handleEmailSubmit}>
                  Send Message
                </Button>
              </div>
            )}
          </div>
        </div>
 
        {/* Feedback Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <H2>Tell Us How We're Doing</H2>
         
          {submitStatus.feedback ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <TextSmall color="success">We appreciate your feedback!</TextSmall>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>
                  Rate your experience
                </Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= feedback.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              </div>
 
              <div>
                <Label>
                  How can we improve? (optional)
                </Label>
                <textarea
                  value={feedback.message}
                  onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share your thoughts..."
                />
              </div>
 
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <TextField
                    type="checkbox"
                    checked={feedback.contactConsent}
                    onChange={(e) => setFeedback(prev => ({ ...prev, contactConsent: e.target.checked }))}
                    className="rounded"
                    value={feedback.contactConsent ? 'on' : ''}
                  />
                  <TextSmall>
                    I'm open to being contacted about my feedback
                  </TextSmall>
                </label>
 
                {feedback.contactConsent && (
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label>Name</Label>
                      <TextField
                        type="text"
                        value={feedback.name}
                        onChange={(e) => setFeedback(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <TextField
                        type="email"
                        value={feedback.email}
                        onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                )}
              </div>
 
              <Button onClick={handleFeedbackSubmit}>
                Submit Feedback
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Feedback;