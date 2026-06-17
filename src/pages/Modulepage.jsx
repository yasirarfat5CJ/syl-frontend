import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import PageShell from '../components/PageShell';
import ModuleTable from '../components/ModuleTable';
import { buildFetchError, getApiErrorMessage, getFieldErrors } from '../utils/apiErrors';

const ModulesPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [modules, setModules] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopics, setNewTopics] = useState('');
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/modules/subject/${subjectId}`);
        const data = await res.json().catch(() => null);

        if (res.status === 404) {
          setModules([]);
          setError('');
          return;
        }

        if (!res.ok) {
          const message = data?.message || data?.msg || 'Failed to fetch modules';
          throw new Error(message);
        }

        setModules(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error('Error fetching modules:', fetchError);
        setError('Unable to load modules right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role === 'admin') {
      setIsAdmin(true);
    }
  }, [subjectId]);

  const handleAddModule = async () => {
    const token = localStorage.getItem('token');
    setFormError('');
    setFieldErrors({});
    setIsAdding(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/syllabus/module/${subjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          topics: newTopics.split(',').map((topic) => topic.trim()).filter(Boolean)
        })
      });

      const updatedModules = await res.json();

      if (!res.ok) {
        throw buildFetchError(res, updatedModules);
      }

      setModules((prevModules) => [...prevModules, updatedModules.module]);
      setNewTitle('');
      setNewTopics('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding module:', err);
      setFieldErrors(getFieldErrors(err));
      setFormError(getApiErrorMessage(err, 'Error adding module'));
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    const confirmDelete = window.confirm('Do you want to delete this module?');
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/modules/subject/${subjectId}/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedModules = await res.json();

      if (!res.ok) {
        throw buildFetchError(res, updatedModules);
      }

      setModules(updatedModules);
    } catch (err) {
      console.error('Error deleting module:', err);
      alert(getApiErrorMessage(err, 'Failed to delete the module.'));
    }
  };

  const filteredModules = modules.filter((module) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const title = (module.title || '').toLowerCase();
    const topics = Array.isArray(module.topics) ? module.topics : [];
    return title.includes(query) || topics.some((topic) => (topic || '').toLowerCase().includes(query));
  });

  return (
    <PageShell
      title="Modules & Topics"
      subtitle="Search, view, and manage module content."
      eyebrow="Module planner"
      actions={<Button variant="outline-secondary" onClick={() => navigate(-1)}><FaArrowLeft aria-hidden="true" /> Back</Button>}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Modules' }
      ]}
    >
      <div className="data-card mb-4">
        <div className="module-toolbar">
          <InputGroup className="module-search">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search modules or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <span className="result-count">{filteredModules.length} shown</span>
        </div>

        {isAdmin ? (
          <>
            <Button
              className="btn-admin-add mb-3"
              onClick={() => setShowAddForm((prev) => !prev)}
            >
              {showAddForm ? <FaTimes aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
              {showAddForm ? 'Cancel' : 'Add Module'}
            </Button>

            {showAddForm ? (
              <div className="module-form-panel">
                {formError ? <Alert variant="danger">{formError}</Alert> : null}
                <Form.Control
                  type="text"
                  placeholder="Module Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  isInvalid={!!fieldErrors.title}
                  className="mb-2"
                />
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.title}
                </Form.Control.Feedback>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Topics (comma-separated)"
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  isInvalid={!!fieldErrors.topics}
                  className="mb-2"
                />
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.topics}
                </Form.Control.Feedback>
                <Button variant="primary" onClick={handleAddModule} disabled={isAdding}>
                  {isAdding ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            ) : null}
          </>
        ) : null}

        <ModuleTable
          modules={loading || error ? [] : filteredModules}
          isAdmin={isAdmin}
          onEdit={(moduleId) => navigate(`/edit-module/${subjectId}/${moduleId}`)}
          onDelete={handleDeleteModule}
        />
        {loading ? (
          <div className="empty-state py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 mb-0 text-muted">Loading modules...</p>
          </div>
        ) : null}
        {error ? <p className="mt-3 mb-0 text-danger">{error}</p> : null}
      </div>
    </PageShell>
  );
};

export default ModulesPage;
