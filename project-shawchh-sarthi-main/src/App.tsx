import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Performance from './pages/Performance';
import Training from './pages/Training';
import ReportIssue from './pages/ReportIssue';
import Profile from './pages/Profile';
import CitizenPortal from './pages/CitizenPortal';
import AuthorityPortal from './pages/AuthorityPortal';

// Component to redirect to appropriate dashboard based on user's role
const RoleHomeRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'citizen') {
    return <Navigate to="/citizen" replace />;
  } else if (user?.role === 'authority') {
    return <Navigate to="/authority" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Home Route */}
          <Route path="/" element={
            <ProtectedRoute>
              <RoleHomeRedirect />
            </ProtectedRoute>
          } />
          
          {/* Sanitation Worker Routes (Workers & Authorities for oversight) */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['worker', 'authority']}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/performance" element={
            <ProtectedRoute allowedRoles={['worker', 'authority']}>
              <Layout>
                <Performance />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/training" element={
            <ProtectedRoute allowedRoles={['worker', 'authority']}>
              <Layout>
                <Training />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Citizen Cleanliness Portal (Citizens & Authorities for public transparency) */}
          <Route path="/citizen" element={
            <ProtectedRoute allowedRoles={['citizen', 'authority']}>
              <Layout>
                <CitizenPortal />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Municipal Authority Command Desk (Strictly Municipal Authorities only) */}
          <Route path="/authority" element={
            <ProtectedRoute allowedRoles={['authority']}>
              <Layout>
                <AuthorityPortal />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Shared / General Routes */}
          <Route path="/report" element={
            <ProtectedRoute allowedRoles={['citizen', 'worker', 'authority']}>
              <Layout>
                <ReportIssue />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['citizen', 'worker', 'authority']}>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={
            <ProtectedRoute>
              <RoleHomeRedirect />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;