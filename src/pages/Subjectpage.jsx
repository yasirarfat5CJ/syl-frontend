// src/pages/SubjectPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';

const SubjectsPage = () => {
  const { branch, year,branchId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // 👈 Get logged-in user

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/subjects/${branch}/${year}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch subjects');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setSubjects(data);
        } else {
          console.error("Received data is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, [branch, year]);

  const handleSubjectClick = (subjectId) => {
    navigate(`/subjects/${subjectId}/modules`);
  };

  // ✅ DELETE SUBJECT HANDLER
  const handleDeleteSubject = async (subjectId) => {
    const confirmDelete = window.confirm('Do you want to delete this subject?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subject/${subjectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.msg || 'Error deleting subject');
        return;
      }

      // ✅ Remove from frontend UI
      setSubjects((prev) => prev.filter((subject) => subject._id !== subjectId));
      alert('Subject deleted successfully.');
    } catch (err) {
      console.error('Error deleting subject:', err);
      alert('Something went wrong.');
    }
  };

  const renderSemester = (semNumber) => {
    const filteredSubjects = subjects.filter(subject => subject.semester === semNumber);

    return (
      <>
        <h5>Semester {semNumber}</h5>

        {/* ✅ Admin-only "Add Subject" button */}
        {user?.role === 'admin' && (
          <Button variant="success" className="mb-2" onClick={() => navigate(`/add-subject/${branchId}/${year}`)}>
            + Add Subject
          </Button>
        )}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Credits</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject, index) => (
                <tr key={subject._id}>
                  <td>{index + 1}</td>
                  <td>{subject.name}</td>
                  <td>{subject.code}</td>
                  <td>{subject.credits}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleSubjectClick(subject._id)}
                    >
                      View Modules
                    </Button>

                    {/* ✅ Admin-only Delete button */}
                    {user?.role === 'admin' && (
                      <Button
                        variant="danger"
                        className="ms-2"
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
      </>
    );
  };

  return (
    <div className="container mt-4">
      <h4>{branch.toUpperCase()} - {year} Year</h4>
      {renderSemester(1)}
      {renderSemester(2)}
    </div>
  );
};

export default SubjectsPage;
