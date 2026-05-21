import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthCard from '../components/AuthCard';
import { getApiErrorMessage, getFieldErrors } from '../utils/apiErrors';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password
      });

      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      window.dispatchEvent(new Event('loginSuccess'));
      navigate('/');
    } catch (err) {
      console.error(err);
      setFieldErrors(getFieldErrors(err));
      setError(getApiErrorMessage(err, 'Registration failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Register to access your branch syllabus dashboard."
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Register"
      loadingLabel="Registering..."
      isSubmitting={isSubmitting}
      footer={
        <small>
          Already have an account? <Link to="/login">Login</Link>
        </small>
      }
    >
      <Form.Group controlId="name" className="mb-3">
        <Form.Label>Name</Form.Label>
        <InputGroup>
          <InputGroup.Text><FaUser /></InputGroup.Text>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            isInvalid={!!fieldErrors.name}
            required
          />
          <Form.Control.Feedback type="invalid">
            {fieldErrors.name}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email address</Form.Label>
        <InputGroup>
          <InputGroup.Text><FaEnvelope /></InputGroup.Text>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            isInvalid={!!fieldErrors.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            {fieldErrors.email}
          </Form.Control.Feedback>
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
            placeholder="Create a password"
            isInvalid={!!fieldErrors.password}
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
          <Form.Control.Feedback type="invalid">
            {fieldErrors.password}
          </Form.Control.Feedback>
        </InputGroup>
        <Form.Text className="password-help">
          Use 8+ characters with uppercase, lowercase, number, and symbol.
        </Form.Text>
      </Form.Group>
    </AuthCard>
  );
};

export default Register;
