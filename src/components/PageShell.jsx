import React from 'react';
import { Container } from 'react-bootstrap';
import BreadcrumbsNav from './BreadcrumbsNav';

const PageShell = ({ title, subtitle, actions, breadcrumbs = [], children }) => {
  return (
    <div className="page-shell">
      <Container className="page-container">
        <BreadcrumbsNav items={breadcrumbs} />

        <div className="page-header mb-3">
          <div>
            <h2 className="page-title mb-1">{title}</h2>
            {subtitle ? <p className="page-subtitle mb-0">{subtitle}</p> : null}
          </div>
          {actions ? <div className="page-actions">{actions}</div> : null}
        </div>

        {children}
      </Container>
    </div>
  );
};

export default PageShell;
