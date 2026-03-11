import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import PageShell from '../components/PageShell';
import SubjectTable from '../components/SubjectTable';

const SubjectsPage = () => {
  const { branch, year } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subjects/${branch}/${year}`);
        const data = await res.json().catch(() => null);

        if (res.status === 404) {
          // Empty semester/year should render table empty-state, not error.
          setSubjects([]);
          setError('');
          return;
        }

        if (!res.ok) {
          const message = data?.message || data?.msg || 'Failed to fetch subjects';
          throw new Error(message);
        }

        setSubjects(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error('Error fetching subjects:', fetchError);
        setError('Unable to load subjects right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [branch, year]);

  const semesterOne = useMemo(
    () => subjects.filter((subject) => subject.semester === 1),
    [subjects]
  );

  const semesterTwo = useMemo(
    () => subjects.filter((subject) => subject.semester === 2),
    [subjects]
  );

  const handleSubjectClick = (subjectId) => {
    navigate(`/subjects/${subjectId}/modules`);
  };

  const handleDeleteSubject = async (subjectId) => {
    const confirmDelete = window.confirm('Do you want to delete this subject?');
    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subject/${subjectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.msg || 'Error deleting subject');
        return;
      }

      setSubjects((prev) => prev.filter((subject) => subject._id !== subjectId));
      alert('Subject deleted successfully.');
    } catch (deleteError) {
      console.error('Error deleting subject:', deleteError);
      alert('Something went wrong.');
    }
  };

  const pageActions = (
    <>
      <Button variant="outline-secondary" onClick={() => navigate(-1)}>
        Back
      </Button>
    </>
  );

  return (
    <PageShell
      title={`${decodeURIComponent(branch).toUpperCase()} - Year ${year}`}
      subtitle="Browse subjects by semester."
      actions={pageActions}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: decodeURIComponent(branch) },
        { label: `Year ${year}` }
      ]}
    >
      {loading ? <div className="data-card">Loading subjects...</div> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}

      {!loading && !error ? (
        <>
          <SubjectTable
            title="Semester 1"
            subjects={semesterOne}
            isAdmin={user?.role === 'admin'}
            onAddSubject={() => navigate(`/add-subject/${branch}/${year}`)}
            onViewModules={handleSubjectClick}
            onDeleteSubject={handleDeleteSubject}
          />

          <SubjectTable
            title="Semester 2"
            subjects={semesterTwo}
            isAdmin={user?.role === 'admin'}
            onAddSubject={() => navigate(`/add-subject/${branch}/${year}`)}
            onViewModules={handleSubjectClick}
            onDeleteSubject={handleDeleteSubject}
          />
        </>
      ) : null}
    </PageShell>
  );
};

export default SubjectsPage;
