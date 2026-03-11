import React from 'react';
import { Card, Alert, Form, Button } from 'react-bootstrap';

const AuthCard = ({
  title,
  subtitle,
  error,
  onSubmit,
  submitLabel,
  loadingLabel,
  isSubmitting,
  children,
  footer
}) => {
  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Card.Body className="p-4 p-md-5">
          <h3 className="auth-title">{title}</h3>
          {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}

          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Form onSubmit={onSubmit} className="auth-form">
            {children}
            <Button type="submit" className="w-100 auth-submit" disabled={isSubmitting}>
              {isSubmitting ? loadingLabel : submitLabel}
            </Button>
          </Form>

          {footer ? <div className="auth-footer mt-3">{footer}</div> : null}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuthCard;
