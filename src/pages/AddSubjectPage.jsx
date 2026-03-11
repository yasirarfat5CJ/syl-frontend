import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import PageShell from '../components/PageShell';

const AddSubjectPage = () => {
  const { branch, year } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    if (!storedUser || !storedToken || storedUser.role !== 'admin') {
      navigate('/');
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

      const branchesRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/branches`);
      const branches = await branchesRes.json();
      const matchedBranch = Array.isArray(branches)
        ? branches.find((item) => (item?.name || '').toLowerCase() === decodeURIComponent(branch).toLowerCase())
        : null;

      if (!matchedBranch?._id) {
        alert('Could not resolve branch.');
        return;
      }

      const subjectData = {
        ...formData,
        credits: parseInt(formData.credits, 10) || 0,
        semester: 1,
        branch: matchedBranch._id,
        year: parseInt(year, 10)
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/syllabus/subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(subjectData)
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
    <PageShell
      title="Add Subject"
      subtitle={`${decodeURIComponent(branch)} - Year ${year}`}
      actions={<Button variant="outline-secondary" onClick={() => navigate(-1)}>Back</Button>}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: decodeURIComponent(branch) },
        { label: `Year ${year}` },
        { label: 'Add Subject' }
      ]}
    >
      <div className="data-card">
        <Form onSubmit={handleSubmit} className="form-grid">
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

          <Button type="submit" className="btn-admin-add">Add Subject</Button>
        </Form>
      </div>
    </PageShell>
  );
};

export default AddSubjectPage;
