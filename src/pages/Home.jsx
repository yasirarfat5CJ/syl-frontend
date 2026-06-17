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
      eyebrow="Academic dashboard"
      title="Find the right syllabus faster"
      subtitle="Choose a branch, pick the year, and move straight into subjects and modules without digging through files."
      breadcrumbs={[{ label: 'Home' }]}
    >
      <div className="dashboard-summary mb-4">
        <div>
          <span className="summary-label">Branches</span>
          <strong>{loading ? '...' : branches.length}</strong>
        </div>
        <div>
          <span className="summary-label">Years per branch</span>
          <strong>4</strong>
        </div>
        <div>
          <span className="summary-label">Access</span>
          <strong>Role based</strong>
        </div>
      </div>

      {loading ? (
        <div className="data-card empty-state text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mb-0 mt-3 text-muted">Loading available branches...</p>
        </div>
      ) : null}

      {error ? <Alert variant="danger">{error}</Alert> : null}

      {!loading && !error ? (
        <Row xs={1} md={2} xl={3} className="g-3">
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
