import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';

const SubjectsPage = () => {
  const { branch, year } = useParams();
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subjects/${branch}/${year}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch subjects');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setSubjects(data);
        } else {
          console.error('Received data is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
      });
  }, [branch, year]);

  const handleSubjectClick = (subjectId) => {
    navigate(`/subjects/${subjectId}/modules`);
  };

  const handleDeleteSubject = async (subjectId) => {
    const confirmDelete = window.confirm('Do you want to delete this subject?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/subject/${subjectId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.msg || 'Error deleting subject');
        return;
      }

      setSubjects((prev) => prev.filter((subject) => subject._id !== subjectId));
      alert('Subject deleted successfully.');
    } catch (err) {
      console.error('Error deleting subject:', err);
      alert('Something went wrong.');
    }
  };

  const renderSemester = (semNumber) => {
    const filteredSubjects = subjects.filter(
      (subject) => subject.semester === semNumber
    );

    return (
      <>
        <h5>Semester {semNumber}</h5>

        {user?.role === 'admin' && (
          <Button
            variant="success"
            className="mb-2"
            onClick={() => navigate(`/add-subject/${branch}/${year}`)}
          >
            + Add Subject
          </Button>
        )}

        <div className="table-responsive">
          <Table
            striped
            bordered
            hover
            className="w-100"
            style={{
              border: '2px solid black',
              tableLayout: 'fixed',
              wordWrap: 'break-word',
            }}
          >
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '30%' }}>Subject Name</th>
                <th style={{ width: '20%' }}>Subject Code</th>
                <th style={{ width: '10%' }}>Credits</th>
                <th style={{ width: '35%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject, index) => (
                  <tr key={subject._id}>
                    <td>{index + 1}</td>
                    <td style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>
                      {subject.name}
                    </td>
                    <td style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>
                      {subject.code}
                    </td>
                    <td>{subject.credits}</td>
                    <td
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '5px',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        maxWidth: '100%'
                      }}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSubjectClick(subject._id)}
                      >
                        View Modules
                      </Button>
                      {user?.role === 'admin' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteSubject(subject._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No subjects found for Semester {semNumber}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        paddingTop: '30px',
        paddingBottom: '30px',
      }}
    >
      <div className="container-fluid px-2">
        <h4>
          {branch.toUpperCase()} - {year} Year
        </h4>
        {renderSemester(1)}
        {renderSemester(2)}
      </div>
    </div>
  );
};

export default SubjectsPage;
