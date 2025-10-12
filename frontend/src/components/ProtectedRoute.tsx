import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../lib/api';

const ProtectedRoute = () => {
  const { accessToken } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    const checkProfileStatus = async () => {
      try {
        const response = await apiClient.get('/profile/status');
        setIsProfileComplete(response.data.profileCompleted);
      } catch (error) {
        console.error("Failed to fetch profile status", error);
        // Decide what to do on error - for now, we'll block access
        setIsProfileComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileStatus();
  }, [accessToken]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    // You can replace this with a proper loading spinner component
    return <div>Loading...</div>;
  }

  if (isProfileComplete === false) {
    return <Navigate to="/profile-form" replace />;
  }

  return isProfileComplete ? <Outlet /> : null;
};

export default ProtectedRoute;