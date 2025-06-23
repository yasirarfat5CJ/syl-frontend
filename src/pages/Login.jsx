import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Import Link

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Login successful!');
      navigate('/', { replace: true });

    

     
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert(error.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <Card className="mx-auto mt-5 p-4" style={{ maxWidth: '400px' }}>
      <h3 className="text-center mb-3">Login</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>

        {/* ✅ Register redirect */}
        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Link to="/register">Register here</Link>
        </div>
      </Form>
    </Card>
  );
};

export default Login;
