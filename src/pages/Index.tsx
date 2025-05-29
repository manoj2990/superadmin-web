
import React, { useState, useEffect } from 'react';
import LoginPage from '@/components/LoginPage';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (data: any) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  if (isAuthenticated && userData) {
    return <SuperAdminDashboard userData={userData} onLogout={handleLogout} />;
  }

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
};

export default Index;
