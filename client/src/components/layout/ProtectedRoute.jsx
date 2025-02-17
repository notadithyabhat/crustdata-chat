// client/src/components/layout/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/'); // or navigate('/login') if you have a /login route
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : null;
};
