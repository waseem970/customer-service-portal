import React, { useState } from 'react';
import { Menu, User, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Text, TextSmall } from '../components/common';

// Types
interface HeaderProps {
  onMenuClick: () => void;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

// Header Component
const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  userName = "John Doe", 
  userEmail = "customer@email.com",
  onLogout
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu button for mobile */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Page title - hidden on mobile when sidebar is available */}
          <Text className="text-xl font-semibold text-gray-800 hidden lg:block">
            Customer Service Portal
          </Text>
        </div>

        {/* Right side - Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <TextSmall className="text-sm font-medium text-gray-700">{userName}</TextSmall>
              <TextSmall className="text-xs text-gray-500">Customer</TextSmall>
            </div>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: '#37517e' }}
            >
              <User className="w-4 h-4" />
            </div>
          </button>

          {/* Profile dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <TextSmall className="text-sm font-medium text-gray-700">{userName}</TextSmall>
                <TextSmall className="text-xs text-gray-500">{userEmail}</TextSmall>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile Settings
                </div>
              </button>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Information
                </div>
              </button>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;