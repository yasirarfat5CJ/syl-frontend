import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    const userData = { name, email, password, role };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User registered:', data);
        navigate('/'); // Redirect to home
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
    <Card className="mx-auto mt-5 p-4" style={{ maxWidth: '450px' }}>
      <h3 className="text-center mb-3">Register</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          Register
        </Button>
      </Form>
    </Card>
  );
};

export default Register;
