import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Form, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // for redirecting

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user); // If user exists in localStorage, set logged in state to true
  }, []);

  const handleLogout = () => {
    // Clear localStorage when the user logs out
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false); // Update the state to reflect that the user is logged out
    navigate('/login'); // Redirect to the login page
  };

 

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed='top'>
      <Container>
        <Navbar.Brand href="/">📘 Syllabus Manager</Navbar.Brand>



        <Nav className="ms-auto">
          {!isLoggedIn ? (
            <>
              {/* Show login and register buttons if the user is not logged in */}
              <Link to="/login">
                <Button variant="outline-light" className="me-2">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline-light">Register</Button>
              </Link>
            </>
          ) : (
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button> // Show logout button if logged in
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;

