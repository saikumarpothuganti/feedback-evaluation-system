import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate page based on user role
    switch (userRole) {
      case 'student':
        return <Navigate to="/student" replace />;
      case 'faculty':
        return <Navigate to="/faculty" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
