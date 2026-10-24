import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { findUserByCredentials } from '../data/mockData';
import { 
  Recycle, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Globe, 
  Award, 
  Shield,
  User as UserIcon,
  Building2,
  HardHat,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('worker');
  const [formData, setFormData] = useState({
    loginId: 'SW-101',
    password: 'password123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    if (role === 'worker') {
      setFormData({ loginId: 'SW-101', password: 'password123' });
    } else if (role === 'citizen') {
      setFormData({ loginId: 'CZ-101', password: 'password123' });
    } else if (role === 'authority') {
      setFormData({ loginId: 'MUNI-01', password: 'password123' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = findUserByCredentials(formData.loginId, formData.password);
      if (user) {
        login(user);
        if (user.role === 'citizen') {
          navigate('/citizen');
        } else if (user.role === 'authority') {
          navigate('/authority');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid ID or password. Please check your credentials.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (id: string, pass: string, role: UserRole) => {
    setSelectedRole(role);
    setFormData({ loginId: id, password: pass });
    const user = findUserByCredentials(id, pass);
    if (user) {
      login(user);
      if (user.role === 'citizen') {
        navigate('/citizen');
      } else if (user.role === 'authority') {
        navigate('/authority');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const getRoleLabel = () => {
    switch (selectedRole) {
      case 'citizen':
        return 'Citizen ID / Mobile Number';
      case 'authority':
        return 'Municipal Officer ID';
      default:
        return 'Sanitation Worker ID';
    }
  };

  const getRolePlaceholder = () => {
    switch (selectedRole) {
      case 'citizen':
        return 'e.g., CZ-101 or +91-9876500001';
      case 'authority':
        return 'e.g., MUNI-01';
      default:
        return 'e.g., SW-101';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-[1px]"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-2xl shadow-inner backdrop-blur-md">
                <Recycle className="h-9 w-9 text-green-200" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">SWACHH SAARTHI</h1>
                <p className="text-sm text-green-100 font-medium">Smart Waste Analytics & Neighborhood Cleanliness</p>
              </div>
            </div>
            <p className="text-sm text-green-50 max-w-md leading-relaxed">
              A unified digital ecosystem connecting Sanitation Workers, Citizens, and Municipal Authorities for real-time accountability and spotless cities.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start space-x-4 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="bg-green-400/20 p-2 rounded-lg flex-shrink-0 text-green-200">
                <HardHat className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Sanitation Worker Portal</h3>
                <p className="text-xs text-green-100">GPS route verification, before/after proof capture, and incentive tracking</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="bg-blue-400/20 p-2 rounded-lg flex-shrink-0 text-blue-200">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Citizen Cleanliness Checker</h3>
                <p className="text-xs text-green-100">Check neighborhood clean status, inspect proof photos & report garbage</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="bg-purple-400/20 p-2 rounded-lg flex-shrink-0 text-purple-200">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Municipal Regular Oversight</h3>
                <p className="text-xs text-green-100">Live ward inspection, worker photo audits, and grievance redressal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-16 right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-12 left-12 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 bg-slate-50">
        <div className="max-w-md w-full space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2.5 rounded-xl shadow-md">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  SWACHH SAARTHI
                </h1>
                <p className="text-xs text-gray-500">Smart Waste & Cleanliness Platform</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sign In to Platform</h2>
            <p className="mt-1 text-sm text-gray-600">Select your role to access your personalized portal</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-200/80 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleSelect('worker')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'worker'
                  ? 'bg-white text-green-700 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <HardHat className="h-4 w-4 mb-1 text-green-600" />
              Worker
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('citizen')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'citizen'
                  ? 'bg-white text-blue-700 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserIcon className="h-4 w-4 mb-1 text-blue-600" />
              Citizen
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('authority')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'authority'
                  ? 'bg-white text-purple-700 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-4 w-4 mb-1 text-purple-600" />
              Authority
            </button>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="loginId" className="block text-xs font-medium text-gray-700 mb-1.5">
                  {getRoleLabel()}
                </label>
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                  placeholder={getRolePlaceholder()}
                  value={formData.loginId}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3.5 py-2.5 text-sm pr-11 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200 text-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-150"
              >
                {isLoading ? 'Signing In...' : `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
              </button>
            </div>
          </form>

          {/* Quick Demo Logins Card */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                1-Click Demo Accounts
              </h3>
              <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">
                Ready to Test
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('SW-101', 'password123', 'worker')}
                className="flex items-center justify-between p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-900 border border-green-200 transition text-left"
              >
                <div className="flex items-center space-x-2">
                  <HardHat className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-semibold">Worker: Rajesh Kumar</p>
                    <p className="text-[10px] text-green-700">ID: SW-101 (Sector A Crew)</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-green-700">Login →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('CZ-101', 'password123', 'citizen')}
                className="flex items-center justify-between p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition text-left"
              >
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-semibold">Citizen: Pooja Verma</p>
                    <p className="text-[10px] text-blue-700">ID: CZ-101 (Sector A Resident)</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-blue-700">Login →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('MUNI-01', 'password123', 'authority')}
                className="flex items-center justify-between p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition text-left"
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="font-semibold">Municipal Officer: Dr. Ananya Roy</p>
                    <p className="text-[10px] text-purple-700">ID: MUNI-01 (Solid Waste Dept)</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-700">Login →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;