import React from 'react';
import { 
  FileText, 
  AlertCircle, 
  CreditCard, 
  Calculator, 
  MessageSquare, 
  X, 
  Home,
  LogOut
} from 'lucide-react';
import { H2, Text, TextSmall } from '../components/common';

// Types
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  onItemClick: (itemId: string) => void;
  onLogout?: () => void;
}

// Menu items configuration
const menuItems: MenuItem[] = [
  {
    id: 'policy',
    label: 'Policy',
    icon: <FileText className="w-5 h-5" />,
    path: '/dashboard/policy'
  },
  {
    id: 'claims',
    label: 'Claims',
    icon: <AlertCircle className="w-5 h-5" />,
    path: '/dashboard/claims'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: <CreditCard className="w-5 h-5" />,
    path: '/dashboard/billing'
  },
  {
    id: 'quote',
    label: 'Quote',
    icon: <Calculator className="w-5 h-5" />,
    path: '/dashboard/quote'
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: <MessageSquare className="w-5 h-5" />,
    path: '/dashboard/feedback'
  }
];

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeItem, 
  onItemClick,
  onLogout 
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar - Full height from top to bottom */}
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200 lg:h-screen
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#37517e' }}>
              <span className="text-white font-bold text-sm">IS</span>
            </div>
            <H2 className="text-lg font-semibold text-gray-800 mt-3">InsureSecure</H2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Menu - Flexible height */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`
                w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200
                ${activeItem === item.id
                  ? 'text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              style={{
                backgroundColor: activeItem === item.id ? '#37517e' : 'transparent'
              }}
            >
              <span className={activeItem === item.id ? 'text-white' : 'text-gray-500'}>
                {item.icon}
              </span>
              <Text className={`font-medium ${activeItem === item.id ? 'text-white' : ''}`}>{item.label}</Text>
            </button>
          ))}
        </nav>


      </div>
    </>
  );
};

export default Sidebar;