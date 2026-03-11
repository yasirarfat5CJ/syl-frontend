import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Container,
  Button
} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBookOpen, FaMoon, FaSun, FaUserCircle } from 'react-icons/fa';

const Navigation = ({ theme = 'light', toggleTheme = () => {} }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const syncLoginState = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!user);
  };

  useEffect(() => {
    syncLoginState();

    window.addEventListener('storage', syncLoginState);
    window.addEventListener('loginSuccess', syncLoginState);
    window.addEventListener('logoutSuccess', syncLoginState);

    return () => {
      window.removeEventListener('storage', syncLoginState);
      window.removeEventListener('loginSuccess', syncLoginState);
      window.removeEventListener('logoutSuccess', syncLoginState);
    };
  }, []);

  useEffect(() => {
    setShowCanvas(false);
  }, [location.pathname]);

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
      {showCanvas && (
        <div className="mobile-menu-backdrop" onClick={() => setShowCanvas(false)} />
      )}

      <Navbar expand="lg" fixed="top" className="app-navbar">
        <Container className="nav-shell">
          <Navbar.Brand as={Link} to="/" className="brand-wrap">
            <FaBookOpen className="brand-icon" />
            <span className="brand-text">Syllabus Manager</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="offcanvas-nav"
            className="nav-toggle-btn"
            onClick={() => setShowCanvas(!showCanvas)}
          />

          <Navbar.Collapse className="justify-content-end d-none d-lg-flex">
            <Button variant="outline-light" className="nav-action theme-toggle-btn me-2" onClick={toggleTheme}>
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </Button>

            {!isLoggedIn ? (
              <>
                <Link to="/login" className="nav-link-btn">
                  <Button variant="outline-light" className={`me-2 nav-action ${location.pathname === '/login' ? 'active-link' : ''}`}>
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="nav-link-btn">
                  <Button variant="outline-light" className={`nav-action ${location.pathname === '/register' ? 'active-link' : ''}`}>Register</Button>
                </Link>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <span className="account-pill">
                  <FaUserCircle />
                  Account
                </span>
                <Button variant="outline-light" className="nav-action" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Floating box for small screen login/register/logout */}
      {showCanvas && (
        <div className="mobile-account-panel">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong className="text-white">Account</strong>
            <button
              className="btn-close btn-close-white"
              onClick={() => setShowCanvas(false)}
              aria-label="Close"
            ></button>
          </div>

          <Button variant="outline-light" className="w-100 mobile-nav-btn mb-2 theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </Button>

          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={() => setShowCanvas(false)}>
                <Button variant="light" className="mb-2 w-100 mobile-nav-btn">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setShowCanvas(false)}>
                <Button variant="secondary" className="w-100 mobile-nav-btn">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <Button variant="danger" className="w-100 mobile-nav-btn" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default Navigation;
