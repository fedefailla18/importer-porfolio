//src/components/auth/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { validateToken } from '../../redux/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // No token, don't validate
    if (!isAuthenticated && status === 'idle') {
      dispatch(validateToken());
    }
  }, [dispatch, isAuthenticated, status]);

  // If no token, redirect immediately
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to='/login' />;
  }

  // Show loading while validating token
  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
