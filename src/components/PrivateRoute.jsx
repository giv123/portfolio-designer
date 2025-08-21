// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('adminToken'));

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
}

export default PrivateRoute;