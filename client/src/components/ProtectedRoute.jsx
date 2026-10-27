import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Restrict admin routes to Sanskar / Admin role only
  if (
    adminOnly &&
    user.role !== 'admin' &&
    user.email?.toLowerCase() !== 'sanskarbhanderi08@gmail.com'
  ) {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
};

export default ProtectedRoute;
