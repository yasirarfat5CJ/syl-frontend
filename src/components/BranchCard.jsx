import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaArrowRight, FaLayerGroup } from 'react-icons/fa';

const yearOptions = [
  { label: '1st Year', value: 1 },
  { label: '2nd Year', value: 2 },
  { label: '3rd Year', value: 3 },
  { label: '4th Year', value: 4 }
];

const BranchCard = ({ name, onYearSelect }) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <Card className="branch-card h-100">
      <Card.Body className="d-flex flex-column gap-3">
        <div className="branch-card-top">
          <span className="branch-avatar">{initials}</span>
          <FaLayerGroup className="branch-icon" />
        </div>

        <div>
          <Card.Title className="fs-5 mb-1">{name}</Card.Title>
          <p className="branch-description mb-0">
            Open subjects, credits, and module topics by academic year.
          </p>
        </div>

        <div className="d-grid gap-2 branch-year-grid mt-auto">
          {yearOptions.map((year) => (
            <Button
              key={year.value}
              className="year-btn"
              onClick={() => onYearSelect(name, year.value)}
            >
              <span>{year.label}</span>
              <FaArrowRight aria-hidden="true" />
            </Button>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BranchCard;
