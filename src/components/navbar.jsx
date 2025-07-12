import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Container,
  Button
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const navigate = useNavigate();

  const syncLoginState = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!user);
  };

  useEffect(() => {
    syncLoginState();

    // Listen to both localStorage and custom login event
    window.addEventListener('storage', syncLoginState);
    window.addEventListener('loginSuccess', syncLoginState);
    window.addEventListener('logoutSuccess', syncLoginState);

    return () => {
      window.removeEventListener('storage', syncLoginState);
      window.removeEventListener('loginSuccess', syncLoginState);
      window.removeEventListener('logoutSuccess', syncLoginState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Also dispatch logout event so other tabs/components are updated
    window.dispatchEvent(new Event("logoutSuccess"));

    syncLoginState();
    navigate('/login');
    setShowCanvas(false);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            📘 Syllabus Manager
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="offcanvas-nav"
            onClick={() => setShowCanvas(!showCanvas)}
          />

          <Navbar.Collapse className="justify-content-end d-none d-lg-flex">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button variant="outline-light" className="me-2">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline-light">Register</Button>
                </Link>
              </>
            ) : (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Floating box for small screen login/register/logout */}
      {showCanvas && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '1rem',
            borderRadius: '10px',
            zIndex: 1050,
            display: 'flex',
            flexDirection: 'column',
            width: '160px',
            backdropFilter: 'blur(5px)',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong className="text-white">Account</strong>
            <button
              className="btn-close btn-close-white"
              onClick={() => setShowCanvas(false)}
              aria-label="Close"
            ></button>
          </div>
          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={() => setShowCanvas(false)}>
                <Button variant="light" className="mb-2 w-100">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setShowCanvas(false)}>
                <Button variant="secondary" className="w-100">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <Button variant="danger" className="w-100" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default Navigation;
