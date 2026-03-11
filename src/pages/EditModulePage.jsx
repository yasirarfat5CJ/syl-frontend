import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import PageShell from '../components/PageShell';

const EditModulePage = () => {
  const { subjectId, moduleId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      alert('Access denied. Admins only!');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/modules/subject/${subjectId}`);
        const data = await res.json();
        const moduleToEdit = data.find((item) => item._id === moduleId);

        if (moduleToEdit) {
          setTitle(moduleToEdit.title);
          setTopics(moduleToEdit.topics.join(', '));
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to load module:', err);
        setLoading(false);
      }
    };

    fetchModule();
  }, [subjectId, moduleId]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/modules/subject/${subjectId}/modules/${moduleId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            topics: topics.split(',').map((topic) => topic.trim())
          })
        }
      );

      alert('Module updated successfully!');
      navigate(-1);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <PageShell
      title="Edit Module"
      subtitle="Update module title and topic list."
      actions={<Button variant="outline-secondary" onClick={() => navigate(-1)}>Back</Button>}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Modules' },
        { label: 'Edit' }
      ]}
    >
      <div className="data-card">
        {loading ? (
          <p className="mb-0">Loading...</p>
        ) : (
          <Form className="form-grid">
            <Form.Control
              type="text"
              className="mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Module Title"
            />
            <Form.Control
              as="textarea"
              rows={5}
              className="mb-2"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Topics (comma-separated)"
            />
            <Button className="btn-admin-add" onClick={handleUpdate}>
              Update Module
            </Button>
          </Form>
        )}
      </div>
    </PageShell>
  );
};

export default EditModulePage;
