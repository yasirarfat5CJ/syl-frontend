import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Form, Button } from 'react-bootstrap';
import PageShell from '../components/PageShell';
import { buildFetchError, getApiErrorMessage, getFieldErrors } from '../utils/apiErrors';

const AddSubjectPage = () => {
  const { branch, year } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    semester: '1'
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setError('');
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized: No token found.');
        return;
      }

      const branchesRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/branches`);
      const branches = await branchesRes.json();
      const matchedBranch = Array.isArray(branches)
        ? branches.find((item) => (item?.name || '').toLowerCase() === decodeURIComponent(branch).toLowerCase())
        : null;

      if (!matchedBranch?._id) {
        setError('Could not resolve branch.');
        return;
      }

      const subjectData = {
        name: formData.name,
        code: formData.code,
        credits: parseInt(formData.credits, 10) || 0,
        semester: parseInt(formData.semester, 10),
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
        throw buildFetchError(response, data);
      }
    } catch (error) {
      console.log(error);
      setFieldErrors(getFieldErrors(error));
      setError(getApiErrorMessage(error, 'Error adding subject'));
    } finally {
      setIsSubmitting(false);
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
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form onSubmit={handleSubmit} className="form-grid">
          <Form.Group className="mb-3">
            <Form.Label>Subject Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!fieldErrors.name}
              required
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subject Code</Form.Label>
            <Form.Control
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              isInvalid={!!fieldErrors.code}
              required
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.code}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Semester</Form.Label>
            <Form.Select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              isInvalid={!!fieldErrors.semester}
              required
            >
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{fieldErrors.semester}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Credits</Form.Label>
            <Form.Control
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              min="0"
              max="30"
              isInvalid={!!fieldErrors.credits}
              required
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.credits}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="btn-admin-add" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Subject'}
          </Button>
        </Form>
      </div>
    </PageShell>
  );
};

export default AddSubjectPage;
