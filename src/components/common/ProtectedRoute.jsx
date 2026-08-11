import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, requireShortlist = false, requireAdmin = false, requiredRole = null }) => {
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

  const userRole = user?.role?.toLowerCase() || 'candidate';

  // Evaluators must NEVER access /dashboard or candidate-only routes
  if (userRole === 'evaluator') {
    if (location.pathname === '/dashboard' || requiredRole === 'candidate') {
      return <Navigate to="/evaluator/synopsis" replace />;
    }
  }

  // Role check if requiredRole specified
  if (requiredRole) {
    const req = requiredRole.toLowerCase();
    if (userRole !== req && userRole !== 'admin') {
      if (userRole === 'evaluator') return <Navigate to="/evaluator/synopsis" replace />;
      if (userRole === 'admin') return <Navigate to="/admin" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Redirect non-admin attempting to access admin route
  if (requireAdmin && userRole !== 'admin') {
    if (userRole === 'evaluator') return <Navigate to="/evaluator/synopsis" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect admin attempting to access candidate-only routes to /admin
  if (!requireAdmin && !requiredRole && userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Redirect candidate without Shortlisted status attempting to access /hackathon
  if (requireShortlist && user?.synopsisStatus !== 'SHORTLISTED') {
    return <Navigate to="/dashboard" state={{ warning: 'The hackathon environment is only accessible to candidates with Shortlisted synopses.' }} replace />;
  }

  return children;
};
