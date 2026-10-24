import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { findUserByCredentials } from '../data/mockData';
import { 
  Home, 
  BarChart3, 
  BookOpen, 
  AlertTriangle, 
  User as UserIcon, 
  LogOut,
  Menu,
  X,
  Recycle,
  ShieldCheck,
  Building2,
  HardHat,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSwitchRoleOpen, setIsSwitchRoleOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickSwitch = (role: UserRole) => {
    let targetUser = null;
    if (role === 'worker') {
      targetUser = findUserByCredentials('SW-101', 'password123');
      if (targetUser) {
        login(targetUser);
        navigate('/dashboard');
      }
    } else if (role === 'citizen') {
      targetUser = findUserByCredentials('CZ-101', 'password123');
      if (targetUser) {
        login(targetUser);
        navigate('/citizen');
      }
    } else if (role === 'authority') {
      targetUser = findUserByCredentials('MUNI-01', 'password123');
      if (targetUser) {
        login(targetUser);
        navigate('/authority');
      }
    }
    setIsSwitchRoleOpen(false);
  };

  // Determine navigation items based on user role
  const getNavigationItems = () => {
    if (user?.role === 'citizen') {
      return [
        { to: '/citizen', icon: ShieldCheck, label: 'Area Cleanliness' },
        { to: '/report', icon: AlertTriangle, label: 'Report Grievance' },
        { to: '/profile', icon: UserIcon, label: 'My Profile' }
      ];
    } else if (user?.role === 'authority') {
      return [
        { to: '/authority', icon: Building2, label: 'Municipal Command Desk' },
        { to: '/citizen', icon: ShieldCheck, label: 'Public Area View' },
        { to: '/profile', icon: UserIcon, label: 'My Profile' }
      ];
    } else {
      // Default: Worker
      return [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/performance', icon: BarChart3, label: 'Performance' },
        { to: '/training', icon: BookOpen, label: 'Training' },
        { to: '/report', icon: AlertTriangle, label: 'Report Issue' },
        { to: '/profile', icon: UserIcon, label: 'Profile' }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const getHeaderTheme = () => {
    if (user?.role === 'citizen') {
      return 'bg-gradient-to-r from-teal-600 to-blue-700';
    } else if (user?.role === 'authority') {
      return 'bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900';
    }
    return 'bg-gradient-to-r from-green-600 via-teal-600 to-blue-600';
  };

  const getRoleBadge = () => {
    if (user?.role === 'citizen') {
      return {
        label: 'Citizen Resident',
        sub: user.citizenId || 'CZ-101',
        icon: UserIcon,
        color: 'bg-blue-500/30 text-blue-100'
      };
    } else if (user?.role === 'authority') {
      return {
        label: 'Municipal Authority',
        sub: user.authorityId || 'MUNI-01',
        icon: Building2,
        color: 'bg-indigo-500/30 text-indigo-100'
      };
    }
    return {
      label: 'Sanitation Worker',
      sub: user?.workerId || 'SW-101',
      icon: HardHat,
      color: 'bg-green-500/30 text-green-100'
    };
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className={`${getHeaderTheme()} text-white shadow-lg sticky top-0 z-40 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => {
              if (user?.role === 'citizen') navigate('/citizen');
              else if (user?.role === 'authority') navigate('/authority');
              else navigate('/dashboard');
            }}>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Recycle className="h-6 w-6 text-green-200" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight">SWACHH SAARTHI</h1>
                <p className="text-[10px] text-green-100 uppercase tracking-widest font-semibold">
                  {user?.role === 'authority' ? 'Municipal Portal' : user?.role === 'citizen' ? 'Citizen Portal' : 'Worker Platform'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-3">
              {navigationItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              {/* Quick Role Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSwitchRoleOpen(!isSwitchRoleOpen)}
                  className="flex items-center space-x-1.5 bg-black/20 hover:bg-black/30 border border-white/20 px-2.5 py-1.5 rounded-xl text-xs font-medium backdrop-blur-sm transition"
                  title="Switch between Worker, Citizen, and Municipal Authority"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-yellow-300" />
                  <span className="hidden sm:inline">Switch Portal</span>
                </button>

                {isSwitchRoleOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 text-xs space-y-1">
                    <p className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-gray-400">
                      Switch Active Persona
                    </p>
                    <button
                      onClick={() => handleQuickSwitch('worker')}
                      className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition ${
                        user?.role === 'worker' ? 'bg-green-50 text-green-900 font-bold' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <HardHat className="h-4 w-4 text-green-600" />
                      <div>
                        <p>Worker Portal</p>
                        <p className="text-[10px] text-gray-500 font-normal">SW-101 (Rajesh Kumar)</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleQuickSwitch('citizen')}
                      className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition ${
                        user?.role === 'citizen' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <UserIcon className="h-4 w-4 text-blue-600" />
                      <div>
                        <p>Citizen Portal</p>
                        <p className="text-[10px] text-gray-500 font-normal">CZ-101 (Pooja Verma)</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleQuickSwitch('authority')}
                      className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition ${
                        user?.role === 'authority' ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Building2 className="h-4 w-4 text-purple-600" />
                      <div>
                        <p>Municipal Authority</p>
                        <p className="text-[10px] text-gray-500 font-normal">MUNI-01 (Dr. Ananya Roy)</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* User Identity Chip */}
              {user && (
                <div className="hidden lg:flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <BadgeIcon className="h-4 w-4 text-white/90" />
                  <div className="text-left text-xs leading-tight">
                    <p className="font-bold text-white">{user.fullName}</p>
                    <p className="text-[10px] text-white/70">{badge.sub}</p>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 bg-red-500/80 hover:bg-red-600 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navigationItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;