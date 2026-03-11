import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaLayerGroup } from 'react-icons/fa';

const yearOptions = [
  { label: '1st Year', value: 1 },
  { label: '2nd Year', value: 2 },
  { label: '3rd Year', value: 3 },
  { label: '4th Year', value: 4 }
];

const BranchCard = ({ name, onYearSelect }) => {
  return (
    <Card className="branch-card h-100">
      <Card.Body className="d-flex flex-column gap-3">
        <div className="d-flex align-items-center gap-2 justify-content-center">
          <FaLayerGroup className="branch-icon" />
          <Card.Title className="fs-5 mb-0 text-center">{name}</Card.Title>
        </div>

        <p className="branch-description mb-0 text-center">
          Explore syllabus by academic year.
        </p>

        <div className="d-grid gap-2 branch-year-grid mt-auto">
          {yearOptions.map((year) => (
            <Button
              key={year.value}
              className="year-btn"
              onClick={() => onYearSelect(name, year.value)}
            >
              {year.label}
            </Button>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BranchCard;
