import React, { useState, useEffect } from 'react';
import LoginPage from '@/components/LoginPage';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for development
  const [userData, setUserData] = useState({
    _id: "dev-user-id",
    name: "Development User",
    email: "dev@example.com",
    accountStatus: "active",
    accountType: "superadmin",
    adminCount: 5
  }); // Mock user data for development

  useEffect(() => {
    // Comment out authentication check for development
    /*
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('superAdminData');
   
    if (token && storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setIsAuthenticated(true);
    }
    */
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