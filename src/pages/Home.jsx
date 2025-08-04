import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/branches`);
        const data = await response.json();

        if (response.ok) {
          setBranches(data);
        } else {
          setError(data.message || 'Failed to load branches');
        }
      } catch (err) {
        setError('Error fetching branches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleYearClick = (branch, year) => {
    navigate(`/subjects/${branch}/${year}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        paddingTop: '4rem',
        paddingBottom: '2rem',
        overflowX: 'hidden',
      }}
    >
      <Container className="px-3">
        <h2 className="text-center mb-4">Available Branches</h2>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        <Row xs={1} md={2} lg={3} className="g-4">
          {branches.map((branch, index) => (
            <Col key={index}>
              <Card className="shadow rounded border border-dark">
                <Card.Body>
                  <Card.Title className="text-center">{branch.name}</Card.Title>
                  <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                    <Button variant="primary" onClick={() => handleYearClick(branch.name, 1)}>1st Year</Button>
                    <Button variant="secondary" onClick={() => handleYearClick(branch.name, 2)}>2nd Year</Button>
                    <Button variant="success" onClick={() => handleYearClick(branch.name, 3)}>3rd Year</Button>
                    <Button variant="warning" onClick={() => handleYearClick(branch.name, 4)}>4th Year</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
