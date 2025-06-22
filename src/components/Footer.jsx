import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer mt-auto bg-light text-dark text-center py-4 ">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <h5>Syllabus Manager 📘</h5>
            <p className="mb-0">Your one-stop solution for college syllabus & resources.</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-dark me-3">
              <FaInstagram size={24} />
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-dark me-3">
              <FaWhatsapp size={24} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark me-3">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-dark">
              <FaTwitter size={24} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
