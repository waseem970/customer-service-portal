import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';

interface DashboardProps {
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current active item based on the current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/policy')) return 'policy';
    if (path.includes('/claims')) return 'claims';
    if (path.includes('/billing')) return 'billing';
    if (path.includes('/quote')) return 'quote';
    if (path.includes('/feedback')) return 'feedback';
    return 'policy'; // default to policy
  };

  const handleItemClick = (itemId: string) => {
    setSidebarOpen(false); // Close sidebar on mobile
    navigate(`/dashboard/${itemId}`);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Fixed width, full height */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 h-screen fixed inset-y-0 left-0 z-30 bg-white border-r">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeItem={getActiveItem()}
            onItemClick={handleItemClick}
            onLogout={handleLogout}
          />
        </div>
      </div>
      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItem={getActiveItem()}
          onItemClick={handleItemClick}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64 min-w-0 overflow-hidden">
        {/* Header - Fixed at top of main area */}
        <div className="flex-shrink-0">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            userName={user?.name || 'User'}
            userEmail={user?.email || 'user@example.com'}
            onLogout={handleLogout}
          />
        </div>
        {/* Content Area - Scrollable, handles wide content */}
        <main className="flex-1 min-w-0 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;