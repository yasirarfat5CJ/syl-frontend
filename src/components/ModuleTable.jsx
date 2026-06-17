import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { FaPen, FaTrash } from 'react-icons/fa';

const ModuleTable = ({ modules, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <Table className="table-modern align-middle mb-0" bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Module</th>
            <th>Topics</th>
            {isAdmin ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {modules.length ? (
            modules.map((module, index) => (
              <tr key={module._id}>
                <td>{index + 1}</td>
                <td className="text-break">{module.title}</td>
                <td className="topic-cell text-break">
                  {Array.isArray(module.topics) && module.topics.length ? (
                    module.topics.join(', ')
                  ) : (
                    <span className="text-muted">No topics added</span>
                  )}
                </td>
                {isAdmin ? (
                  <td className="module-action-cell">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="btn-action-edit"
                      onClick={() => onEdit(module._id)}
                    >
                      <FaPen aria-hidden="true" /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="btn-action-delete"
                      onClick={() => onDelete(module._id)}
                    >
                      <FaTrash aria-hidden="true" /> Delete
                    </Button>
                  </td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? 4 : 3} className="empty-table-cell">
                No modules found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ModuleTable;
