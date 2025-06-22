import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token'); // or check user if you prefer

  if (!token) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;

