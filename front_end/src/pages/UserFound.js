// UserFound.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { SlashCircle, Calendar, Ticket } from 'react-bootstrap-icons'; // Importing Bootstrap icons

const UserFound = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Extract user data from query parameters
  const fullName = params.get('fullName');
  const ucid = params.get('ucid');
  const email = params.get('email');
  const licensePlate = params.get('licensePlate'); // Ensure to use 'licensePlate'

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [offence, setOffence] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [offenceError, setOffenceError] = useState('');
  const [amountDueError, setAmountDueError] = useState('');

  // Get current date and due date
  const currentDate = new Date().toLocaleDateString();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const formattedDueDate = dueDate.toLocaleDateString();

  // Handle modal open
  const handleModalOpen = () => {
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
  };

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate offence
    if (offence.length === 0) {
      setOffenceError('Offence must be provided');
      return;
    }

    // Validate amount due
    const amount = parseInt(amountDue);
    if (isNaN(amount) || amount <= 0) {
      setAmountDueError('Amount due must be a positive integer');
      return;
    }

    // Process form submission (e.g., send data to server)
    // Reset form fields
    setOffence('');
    setAmountDue('');
    setOffenceError('');
    setAmountDueError('');
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
      <div style={{ borderTop: '30px solid #8c847c', borderBottom: '30px solid #8c847c' }}>
        <Container className="pt-5 pb-5">
          <Row className="justify-content-md-center">
            <Col md={6}>
              <h1 className="text-center mb-4">User Details</h1>
              <div className="mb-3">
                <p><strong>Full Name:</strong> {fullName}</p>
                <p><strong>UCID:</strong> {ucid}</p>
                <p><strong>Email Address:</strong> {email}</p>
                <p><strong>License Plate:</strong> {licensePlate}</p>
              </div>
              <div className="d-flex justify-content-between">
                <SlashCircle size={30} color="red" />
                <Button variant="danger" onClick={handleModalOpen}>
                  <Ticket size={20} style={{ marginRight: '5px' }} /> Ticket
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ backgroundColor: '#c4c3bb', height: '3000px' }}></div>

      {/* Modal for entering offence details */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Offence Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Date Issued:</strong> {currentDate}</p>
          <p><strong>Due Date:</strong> {formattedDueDate}</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="offence">
              <Form.Label>Offence</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter offence (max 50 characters)"
                value={offence}
                onChange={(e) => setOffence(e.target.value)}
                isInvalid={offenceError}
              />
              <Form.Control.Feedback type="invalid">{offenceError}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="amountDue">
              <Form.Label>Amount Due</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount due"
                value={amountDue}
                onChange={(e) => setAmountDue(e.target.value)}
                isInvalid={amountDueError}
              />
              <Form.Control.Feedback type="invalid">{amountDueError}</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserFound;
