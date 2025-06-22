import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
