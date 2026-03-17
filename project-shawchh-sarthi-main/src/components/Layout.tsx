import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  BarChart3, 
  BookOpen, 
  AlertTriangle, 
  User, 
  LogOut,
  Menu,
  X,
  Recycle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/performance', icon: BarChart3, label: 'Performance' },
    { to: '/training', icon: BookOpen, label: 'Training' },
    { to: '/report', icon: AlertTriangle, label: 'Report Issue' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Recycle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SWACHH</h1>
                <p className="text-xs text-green-100">Smart Waste Analytics</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navigationItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'text-green-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-green-100">{user.workerId}</p>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-10 backdrop-blur-sm">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navigationItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'text-green-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium text-red-200 hover:text-red-100 hover:bg-red-500 hover:bg-opacity-20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;