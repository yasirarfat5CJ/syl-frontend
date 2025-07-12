import React, { useState } from 'react';
import {
  Form,
  Button,
  Alert,
  Card,
  InputGroup,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      window.dispatchEvent(new Event('loginSuccess'));
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  return (
    <div
      style={{
        position: 'fixed', // 🔒 Lock background
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to right, #74ebd5, #acb6e5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '45px 12px 12px', // 80px for navbar, 20px bottom
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <Card
        className="shadow-lg p-4 w-100"
        style={{
          maxWidth: '400px',
          borderRadius: '15px',
          background: '#fff',
          zIndex: 1,
        }}
      >
        <h3 className="mb-4 text-center text-primary fw-bold">Login</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label className="fw-semibold">Email address</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaEnvelope />
              </InputGroup.Text>
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
            <Form.Label className="fw-semibold">Password</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaLock />
              </InputGroup.Text>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </InputGroup>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-semibold"
          >
            Log In
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
