import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  CheckCircle2,
  Mail,
  Lock,
  Loader2
} from 'lucide-react';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('worker');
  const [formData, setFormData] = useState({
    email: 'worker@swachhseva.in',
    password: 'password123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Success message passed from registration or other redirects
  const successMessage = (location.state as { message?: string } | null)?.message;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    const defaultEmail = role === 'citizen'
      ? 'citizen@example.com'
      : role === 'authority'
        ? 'officer@municipal.gov.in'
        : 'worker@swachhseva.in';
    setFormData({
      email: defaultEmail,
      password: 'password123'
    });
  };

  const handleQuickDemo = async (role: UserRole) => {
    setIsLoading(true);
    setError('');
    try {
      const email = role === 'citizen' 
        ? 'citizen@example.com' 
        : role === 'authority' 
          ? 'officer@municipal.gov.in' 
          : 'worker@swachhseva.in';
      const result = await login(email, 'password123', role);
      if (result.success && result.data) {
        if (role === 'citizen') {
          navigate('/citizen');
        } else if (role === 'authority') {
          navigate('/authority');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Quick Demo login failed');
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const emailTrimmed = formData.email.trim();
      const result = await login(emailTrimmed, formData.password, selectedRole);

      if (!result.success || !result.data) {
        setError(result.error || 'Login failed. Please verify your credentials and try again.');
        return;
      }

      const loggedInUser = result.data;

      // Role-specific redirect
      if (loggedInUser.role === 'citizen') {
        navigate('/citizen');
      } else if (loggedInUser.role === 'authority') {
        navigate('/authority');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Authentication error. Please check your network and credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const getRoleTheme = () => {
    switch (selectedRole) {
      case 'citizen':
        return {
          title: 'Citizen Cleanliness Portal',
          badge: 'Resident Access',
          color: 'from-blue-600 to-teal-600',
          accent: 'text-blue-600',
          rolePlaceholder: 'citizen@example.com'
        };
      case 'authority':
        return {
          title: 'Municipal Command Desk',
          badge: 'Official Oversight',
          color: 'from-purple-900 to-indigo-900',
          accent: 'text-purple-600',
          rolePlaceholder: 'officer@municipal.gov.in'
        };
      default:
        return {
          title: 'Sanitation Worker Portal',
          badge: 'Field Operations',
          color: 'from-green-600 to-teal-600',
          accent: 'text-green-600',
          rolePlaceholder: 'worker@swachhseva.in'
        };
    }
  };

  const roleTheme = getRoleTheme();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Column: Visual & Project Vision */}
      <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${roleTheme.color} p-12 text-white flex-col justify-between relative overflow-hidden transition-colors duration-500`}>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Recycle className="h-8 w-8 text-green-200" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight">SWACHH SEVA</span>
              <p className="text-xs text-white/80 font-semibold tracking-wider uppercase">Municipal Waste Management Platform</p>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5 text-green-300" />
              <span>PostgreSQL & Supabase Auth Protected</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Transparent, accountable, & digital sanitation operations.
            </h1>

            <p className="text-white/80 text-sm leading-relaxed">
              Empowering municipal field crews with GPS-verified waste collection, digital photo audits, and citizen complaint redressal.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-medium">
              <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                <Globe className="h-5 w-5 mb-1.5 text-teal-300" />
                <p className="font-bold text-white">Full-Stack Security</p>
                <p className="text-white/70 text-[11px] mt-0.5">Row-Level Security on all database entities</p>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                <Award className="h-5 w-5 mb-1.5 text-yellow-300" />
                <p className="font-bold text-white">Role-Based Access</p>
                <p className="text-white/70 text-[11px] mt-0.5">Strict Citizen, Worker & Municipal boundaries</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60">
          © 2026 Swachh Seva. Secure Municipal Operations.
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Mobile Brand */}
          <div className="lg:hidden text-center mb-4">
            <div className="inline-flex items-center space-x-2 bg-green-500 p-2.5 rounded-xl text-white mb-2">
              <Recycle className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">SWACHH SEVA</h2>
          </div>

          <div>
            <span className="inline-block text-[11px] font-bold tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase mb-2">
              {roleTheme.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Access real-time collection metrics, complaints, and verification records.
            </p>
          </div>

          {/* Success Redirect Message */}
          {successMessage && (
            <div className="flex items-center space-x-2 text-teal-800 bg-teal-50 p-3 rounded-2xl border border-teal-200 text-xs">
              <CheckCircle2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Supabase Status / Preview Notice */}
          <div className={`p-3 rounded-2xl border text-xs flex items-start space-x-2.5 ${
            isConfigured 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-teal-50 border-teal-200 text-teal-900'
          }`}>
            <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isConfigured ? 'text-emerald-600' : 'text-teal-600'}`} />
            <div>
              <p className="font-bold">
                {isConfigured ? 'Supabase Backend Connected' : 'Instant Preview Mode Active'}
              </p>
              <p className="text-[11px] mt-0.5 opacity-90">
                {isConfigured 
                  ? 'Authenticated via live PostgreSQL and Row-Level Security.' 
                  : 'Full application is working properly. Click any 1-Click Demo button below or sign in directly.'}
              </p>
            </div>
          </div>

          {/* 1-Click Demo Quick Access */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <span>⚡ 1-Click Demo Access</span>
              </span>
              <span className="text-[10px] text-slate-500">Pick any role to test</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('worker')}
                disabled={isLoading}
                className="p-2 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-left transition-all group"
              >
                <div className="flex items-center space-x-1 text-green-700 text-xs font-bold">
                  <HardHat className="h-3.5 w-3.5" />
                  <span>Worker</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">Rajesh Kumar</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('citizen')}
                disabled={isLoading}
                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all group"
              >
                <div className="flex items-center space-x-1 text-blue-700 text-xs font-bold">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Citizen</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">Pooja Verma</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('authority')}
                disabled={isLoading}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-all group"
              >
                <div className="flex items-center space-x-1 text-purple-700 text-xs font-bold">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Authority</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">Dr. Ananya Roy</div>
              </button>
            </div>
          </div>

          {/* Role Filter Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => handleRoleSelect('worker')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                selectedRole === 'worker'
                  ? 'bg-white text-green-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardHat className="h-4 w-4 mb-1 text-green-600" />
              <span>Worker</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('citizen')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                selectedRole === 'citizen'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="h-4 w-4 mb-1 text-blue-600" />
              <span>Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('authority')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                selectedRole === 'authority'
                  ? 'bg-white text-purple-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="h-4 w-4 mb-1 text-purple-600" />
              <span>Authority</span>
            </button>
          </div>

          {/* Authentication Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-3.5 py-2.5 pl-10 text-sm border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                  placeholder={roleTheme.rolePlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 text-sm border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                  placeholder="Enter your account password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 text-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-150"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>

          {/* Registration Link */}
          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-200">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-teal-600 hover:text-teal-700 underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;