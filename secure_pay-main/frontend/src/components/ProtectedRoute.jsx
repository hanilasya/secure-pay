import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="status-pill info" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
          Verifying Secure Session...
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check -> If admin role required and user is customer, redirect to unauthorized
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          attemptedPath: location.pathname,
          requiredRole,
          currentRole: user.role,
        }}
        replace
      />
    );
  }

  return children;
}
