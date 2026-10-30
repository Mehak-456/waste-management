import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Recycle, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  HardHat, 
  User as UserIcon, 
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const SignUp: React.FC = () => {
  const { signUp, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<'citizen' | 'worker'>('citizen');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    workerId: '',
    mobile: '',
    zone: 'Sector A',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (selectedRole === 'worker') {
      if (!formData.workerId.trim()) {
        newErrors.workerId = 'Worker ID is required (e.g., SW-105)';
      } else if (!formData.workerId.match(/^SW-\d+$/)) {
        newErrors.workerId = 'Worker ID must follow format SW-XXX';
      }
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!formData.mobile.match(/^\+?[1-9]\d{9,14}$/)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationNotice(null);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        mobile: formData.mobile.trim(),
        role: selectedRole,
        zone: formData.zone,
        workerId: selectedRole === 'worker' ? formData.workerId.trim() : undefined,
      });

      if (!result.success) {
        setErrors({ general: result.error || 'Registration failed. Please check your details.' });
        return;
      }

      if (result.requiresEmailVerification) {
        setVerificationNotice(
          `A verification link has been dispatched to ${formData.email}. Please verify your email before logging in.`
        );
      } else {
        navigate('/login', { 
          state: { 
            message: 'Account created successfully with Supabase! Please sign in with your credentials.' 
          } 
        });
      }
    } catch (err: unknown) {
      setErrors({ general: (err as Error)?.message || 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-full shadow-lg">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                SWACHH SEVA
              </h1>
              <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Municipal Waste Management</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-600">Register for verified municipal access and tracking</p>
        </div>

        {/* Backend Configuration Alert if Unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Supabase Backend Unconfigured</p>
              <p className="mt-0.5 text-amber-700">
                To enable live account registration in PostgreSQL, update <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code> with your Supabase URL & Anon Key.
              </p>
            </div>
          </div>
        )}

        {/* Email Verification Banner */}
        {verificationNotice && (
          <div className="mb-6 p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-sm space-y-3 shadow-md">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
              <h3 className="font-bold">Verification Email Sent</h3>
            </div>
            <p className="text-xs text-teal-800 leading-relaxed">{verificationNotice}</p>
            <Link
              to="/login"
              className="inline-block w-full text-center py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition"
            >
              Proceed to Sign In
            </Link>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white shadow-xl rounded-3xl p-8 border border-slate-100">
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Select Public Account Role
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => { setSelectedRole('citizen'); setErrors({}); }}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'citizen'
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserIcon className="h-4 w-4 text-blue-600" />
                <span>Citizen Resident</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRole('worker'); setErrors({}); }}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'worker'
                    ? 'bg-white text-green-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HardHat className="h-4 w-4 text-green-600" />
                <span>Sanitation Worker</span>
              </button>
            </div>

            {/* Municipal Authority Role Guard Notice */}
            <div className="mt-3 flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-[11px] text-slate-500">
              <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>
                <strong>Municipal Authority</strong> accounts are restricted and provisioned solely by municipal headquarters.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 text-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className={`w-full px-3.5 py-2.5 pl-10 border rounded-xl shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.fullName
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-teal-500'
                  }`}
                  placeholder="e.g. Ramesh Patel"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <UserIcon className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Official / Personal Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`w-full px-3.5 py-2.5 pl-10 border rounded-xl shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-teal-500'
                  }`}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Sanitation Worker ID Field (Only if Worker role selected) */}
            {selectedRole === 'worker' && (
              <div>
                <label htmlFor="workerId" className="block text-xs font-semibold text-gray-700 mb-1">
                  Worker Employee ID
                </label>
                <div className="relative">
                  <input
                    id="workerId"
                    name="workerId"
                    type="text"
                    required
                    className={`w-full px-3.5 py-2.5 pl-10 border rounded-xl shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      errors.workerId
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-teal-500'
                    }`}
                    placeholder="e.g. SW-105"
                    value={formData.workerId}
                    onChange={handleChange}
                  />
                  <HardHat className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
                {errors.workerId && <p className="mt-1 text-xs text-red-600">{errors.workerId}</p>}
              </div>
            )}

            {/* Mobile Number & Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="mobile" className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    className={`w-full px-3.5 py-2.5 pl-9 border rounded-xl shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      errors.mobile
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-teal-500'
                    }`}
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  <Phone className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-3.5" />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
              </div>

              <div>
                <label htmlFor="zone" className="block text-xs font-semibold text-gray-700 mb-1">
                  Assigned Zone
                </label>
                <div className="relative">
                  <select
                    id="zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 pl-9 border border-gray-300 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Sector A">Sector A</option>
                    <option value="Sector B">Sector B</option>
                    <option value="Sector C">Sector C</option>
                    <option value="Sector D">Sector D</option>
                    <option value="Sector E">Sector E</option>
                  </select>
                  <MapPin className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`w-full px-3.5 py-2.5 pl-10 pr-10 border rounded-xl shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-teal-500'
                  }`}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
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
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`w-full px-3.5 py-2.5 pl-10 pr-10 border rounded-xl shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-teal-500'
                  }`}
                  placeholder="Re-type your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white shadow-lg transition-all ${
                isLoading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : selectedRole === 'citizen'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700'
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register with Supabase</span>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700 underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;