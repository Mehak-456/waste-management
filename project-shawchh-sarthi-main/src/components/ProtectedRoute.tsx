import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Session Restoration / Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
          <p className="text-slate-600 font-medium text-sm">Verifying municipal session...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Redirect
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-Based Access Enforcement
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleHome = user.role === 'citizen' ? '/citizen' : user.role === 'authority' ? '/authority' : '/dashboard';

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Access Restricted</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Your current account role (<span className="font-semibold text-slate-900 uppercase">{user.role}</span>) does not have authorization to view this municipal department or portal.
          </p>
          <div className="pt-2">
            <Link
              to={roleHome}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-xl transition-colors shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to My Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;