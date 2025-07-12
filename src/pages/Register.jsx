import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role] = useState('student'); // default role
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const userData = { name, email, password, role };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User registered:', data);
        navigate('/login'); // redirect to login
      } else {
        setError(data.message || 'Registration failed');
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to right, #74ebd5, #acb6e5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px 16px', // 👈 slightly reduced top space from navbar
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <Card
        className="shadow-lg p-4 w-100"
        style={{
          maxWidth: '420px',
          borderRadius: '15px',
          background: '#fff',
          zIndex: 1,
        }}
      >
        <h3 className="text-center mb-3 text-success fw-bold">Register</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleRegister}>
          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaUser /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputGroup>
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaEnvelope /></InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 fw-semibold">
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
