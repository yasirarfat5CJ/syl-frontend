import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import BranchCard from '../components/BranchCard';

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
    <PageShell
      title="Branches"
      subtitle="Select your branch and academic year to view syllabus."
      breadcrumbs={[{ label: 'Home' }]}
    >
      {loading ? (
        <div className="data-card text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : null}

      {error ? <Alert variant="danger">{error}</Alert> : null}

      {!loading && !error ? (
        <Row xs={1} md={2} xl={3} className="g-4">
          {branches.map((branch) => (
            <Col key={branch._id || branch.name}>
              <BranchCard name={branch.name} onYearSelect={handleYearClick} />
            </Col>
          ))}
        </Row>
      ) : null}
    </PageShell>
  );
};

export default Home;
