import React from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { FaEye, FaPlus, FaTrash } from 'react-icons/fa';

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
            <FaPlus aria-hidden="true" /> Add Subject
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
                  <td>
                    <Badge className="credit-badge">{subject.credits} credits</Badge>
                  </td>
                  <td className="subject-action-cell">
                    <Button
                      variant="primary"
                      size="sm"
                      className="btn-action-view"
                      onClick={() => onViewModules(subject._id)}
                    >
                      <FaEye aria-hidden="true" /> Modules
                    </Button>
                    {isAdmin ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="btn-action-delete"
                        onClick={() => onDeleteSubject(subject._id)}
                      >
                        <FaTrash aria-hidden="true" /> Delete
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-table-cell">
                  No subjects found for this semester.
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
