import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
const ModulesPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [modules, setModules] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Based on login info

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopics, setNewTopics] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/modules/subject/${subjectId}`)
      .then((res) => res.json())
      .then((data) => setModules(data));

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role === 'admin') setIsAdmin(true);
  }, [subjectId]);

  const handleAddModule = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/syllabus/module/${subjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          topics: newTopics.split(',').map((t) => t.trim()),
        }),
      });

      const updatedModules = await res.json();
      console.log('Updated response:', updatedModules);
      setModules((prevModules) => [...prevModules, updatedModules.module]); 
      setNewTitle('');
      setNewTopics('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding module:', err);
    }
  };
  const handleDeleteModule = async (moduleId) => {
    const confirmDelete = window.confirm("Do you want to delete this module?");
    if (!confirmDelete) return;
  
    const token = localStorage.getItem('token');
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/modules/subject/${subjectId}/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const updatedModules = await res.json();
      setModules(updatedModules); // instantly update UI with new list
  
    } catch (err) {
      console.error("Error deleting module:", err);
      alert("Failed to delete the module.");
    }
  };
  

  return (
    <div className="container mt-4">
      <h4>Modules & Topics</h4>

      {isAdmin && (
        <>
          <Button
            variant="success"
            className="mb-2"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Module'}
          </Button>

          {showAddForm && (
            <div className="mb-3">
              <input
                type="text"
                placeholder="Module Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="form-control mb-2"
              />
              <textarea
              rows={5}
                type="text"
                placeholder="Topics (comma-separated)"
                value={newTopics}
                onChange={(e) => setNewTopics(e.target.value)}
                className="form-control mb-2"
              />
              <Button variant="primary" onClick={handleAddModule}>
                Submit
              </Button>
            </div>
          )}
        </>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Module</th>
            <th>Topics</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {modules.map((mod, index) => (
            <tr key={mod._id}>
              <td>{index + 1}</td>
              <td >{mod.title}</td>
              <td>{mod.topics.join(', ')}</td>
              {isAdmin && (
                <td>
                  <Button variant="warning"  size="sm"  className="me-2"  onClick={() => navigate(`/edit-module/${subjectId}/${mod._id}`)}> Edit</Button>

                  
                  <Button variant="danger" size="sm" onClick={()=>handleDeleteModule(mod._id)}>Delete</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ModulesPage;
