import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from sessionStorage
    const storedUser = sessionStorage.getItem('currentUser');
    const storedRole = sessionStorage.getItem('userRole');
    
    if (storedUser && storedRole) {
      setCurrentUser(storedUser);
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, role) => {
    setCurrentUser(username);
    setUserRole(role);
    setIsAuthenticated(true);
    
    // Store in sessionStorage
    sessionStorage.setItem('currentUser', username);
    sessionStorage.setItem('userRole', role);
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    
    // Clear sessionStorage
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userRole');
  };

  const switchRole = (newRole) => {
    setUserRole(newRole);
    sessionStorage.setItem('userRole', newRole);
  };

  const value = {
    currentUser,
    userRole,
    isAuthenticated,
    login,
    logout,
    switchRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
