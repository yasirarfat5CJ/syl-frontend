import React from 'react';
import { Button, Table } from 'react-bootstrap';

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
                <td className="text-break">{Array.isArray(module.topics) ? module.topics.join(', ') : ''}</td>
                {isAdmin ? (
                  <td className="module-action-cell">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="btn-action-edit"
                      onClick={() => onEdit(module._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="btn-action-delete"
                      onClick={() => onDelete(module._id)}
                    >
                      Delete
                    </Button>
                  </td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? 4 : 3} className="text-center text-muted py-4">
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
