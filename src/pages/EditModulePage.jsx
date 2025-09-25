// EditModulePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditModulePage = () => {
  const { subjectId, moduleId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(true);

  // Admin-only access check
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
        const moduleToEdit = data.find((m) => m._id === moduleId);
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            topics: topics.split(',').map((t) => t.trim()),
          }),
        }
      );

      alert('Module updated successfully!');
      navigate(-1); // Go back
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container-fluid mt-4 px-3">
      <h4>Update your Module</h4>
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Module Title"
        />
        <textarea
        rows={5}
          type="text"
          className="form-control mb-2"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          placeholder="Topics (comma-separated)"
        />
        <button className="btn btn-primary" onClick={handleUpdate}>
          Update Module
        </button>
      </div>
    </div>
  );
};

export default EditModulePage;

