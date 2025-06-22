import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const AddSubjectPage = () => {
  const { branchId, year } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    semester: '',
  });

  const [user, setUser] = useState(null); // ✅ Corrected this line

  // Check user authentication and admin role on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    if (!storedUser || !storedToken || storedUser.role !== 'admin') {
      navigate('/');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized: No token found.');
        return;
      }

      const subjectData = {
        ...formData,
        credits: parseInt(formData.credits) || 0,
        semester: parseInt(formData.semester) || 0,
        branch: branchId,
        year: parseInt(year),
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/syllabus/subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subjectData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Subject added successfully');
        navigate(`/subjects/${branchId}/${year}`);
      } else {
        alert(data.message || 'Failed to add subject');
      }
    } catch (error) {
      console.log(error);
      alert('Error adding subject');
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Add Subject</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Subject Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subject Code</Form.Label>
          <Form.Control
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Credits</Form.Label>
          <Form.Control
            type="number"
            name="credits"
            value={formData.credits}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Semester</Form.Label>
          <Form.Select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
          >
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="success">Add Subject</Button>
      </Form>
    </Container>
  );
};

export default AddSubjectPage;

