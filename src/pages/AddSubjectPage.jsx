import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const AddSubjectPage = () => {
  const { branch, year } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
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

      // Resolve Branch ObjectId from branch name
      const branchesRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/branches`);
      const branches = await branchesRes.json();
      const matchedBranch = Array.isArray(branches)
        ? branches.find((b) => (b?.name || '').toLowerCase() === decodeURIComponent(branch).toLowerCase())
        : null;
      if (!matchedBranch?._id) {
        alert('Could not resolve branch.');
        return;
      }

      const subjectData = {
        ...formData,
        credits: parseInt(formData.credits) || 0,
        // No semester field from UI; defaulting to Semester 1
        semester: 1,
        branch: matchedBranch._id,
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
        navigate(`/subjects/${branch}/${year}`);
      } else {
        alert(data.message || 'Failed to add subject');
      }
    } catch (error) {
      console.log(error);
      alert('Error adding subject');
    }
  };

  return (
    <Container fluid className="mt-4 px-3">
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

        {/* Semester selection removed as requested */}

        <Button type="submit" variant="success">Add Subject</Button>
      </Form>
    </Container>
  );
};

export default AddSubjectPage;

