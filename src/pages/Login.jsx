import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthCard from '../components/AuthCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      window.dispatchEvent(new Event('loginSuccess'));
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to continue managing your syllabus."
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Log In"
      loadingLabel="Logging in..."
      isSubmitting={isSubmitting}
      footer={
        <small>
          No account yet? <Link to="/register">Create one</Link>
        </small>
      }
    >
      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email address</Form.Label>
        <InputGroup>
          <InputGroup.Text><FaEnvelope /></InputGroup.Text>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="password" className="mb-4">
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <InputGroup.Text><FaLock /></InputGroup.Text>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </InputGroup>
      </Form.Group>
    </AuthCard>
  );
};

export default Login;
