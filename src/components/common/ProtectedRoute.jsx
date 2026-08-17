import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, requireShortlist = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19] text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect candidate without Shortlisted status attempting to access hackathon
  if (requireShortlist && user?.synopsisStatus !== 'SHORTLISTED' && user?.role?.toLowerCase() === 'candidate') {
    return <Navigate to="/dashboard" state={{ warning: 'The hackathon environment is only accessible to candidates with Shortlisted synopses.' }} replace />;
  }

  return children;
};
