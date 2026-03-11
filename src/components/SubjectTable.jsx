import React from 'react';
import { Button, Table } from 'react-bootstrap';

const SubjectTable = ({
  title,
  subjects,
  isAdmin,
  onAddSubject,
  onViewModules,
  onDeleteSubject
}) => {
  return (
    <section className="data-card mb-4">
      <div className="section-header">
        <h5 className="section-title mb-0">{title}</h5>
        {isAdmin ? (
          <Button className="btn-admin-add" onClick={onAddSubject}>
            + Add Subject
          </Button>
        ) : null}
      </div>

      <div className="table-responsive">
        <Table className="table-modern align-middle mb-0" bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Credits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length ? (
              subjects.map((subject, index) => (
                <tr key={subject._id}>
                  <td>{index + 1}</td>
                  <td className="text-break">{subject.name}</td>
                  <td className="text-break">{subject.code}</td>
                  <td>{subject.credits}</td>
                  <td className="subject-action-cell">
                    <Button
                      variant="primary"
                      size="sm"
                      className="btn-action-view"
                      onClick={() => onViewModules(subject._id)}
                    >
                      View Modules
                    </Button>
                    {isAdmin ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="btn-action-delete"
                        onClick={() => onDeleteSubject(subject._id)}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </section>
  );
};

export default SubjectTable;
