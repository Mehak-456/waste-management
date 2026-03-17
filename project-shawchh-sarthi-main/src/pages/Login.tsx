import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { findUserByCredentials } from '../data/mockData';
import { Recycle, Eye, EyeOff, AlertCircle, Globe, Award, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    workerId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = findUserByCredentials(formData.workerId, formData.password);
      if (user) {
        login(user);
        navigate('/dashboard');
      } else {
        setError('Invalid Worker ID or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Recycle className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">SWACHH</h1>
                <p className="text-sm text-green-100">Smart Waste Analytics for Clean & Healthy Habitat</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-full flex-shrink-0">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Global Impact</h3>
                <p className="text-green-100">Join millions in creating a cleaner world</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-full flex-shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Earn Rewards</h3>
                <p className="text-green-100">Get Green Coins for eco-friendly actions</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-full flex-shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure & Transparent</h3>
                <p className="text-green-100">Blockchain-based tracking system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-full">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  SWACHH
                </h1>
                <p className="text-sm text-gray-500">Smart Waste Analytics</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to continue your green journey</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="workerId" className="block text-sm font-medium text-gray-700 mb-2">
                  Worker ID
                </label>
                <input
                  id="workerId"
                  name="workerId"
                  type="text"
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your Worker ID (e.g., SW-101)"
                  value={formData.workerId}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            <div className="text-center">
              <Link 
                to="#" 
                className="text-sm text-green-600 hover:text-green-500 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-medium text-green-600 hover:text-green-500 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Worker 1:</strong> SW-101 / password123</p>
              <p><strong>Worker 2:</strong> SW-102 / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;