import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import "./Footer.css"; // Link to external styles

const Footer = () => {
  return (
    <footer className="footer mt-auto bg-dark text-white text-center py-3">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="text-center text-md-start footer-brand">
            <h6 className="mb-0">Syllabus Manager 📘</h6>
          </Col>
          <Col xs={12} md={6} className="text-center text-md-end mt-2 mt-md-0 footer-icons d-none d-md-block">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
              <FaInstagram size={20} />
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
              <FaWhatsapp size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
              <FaFacebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
              <FaTwitter size={20} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
