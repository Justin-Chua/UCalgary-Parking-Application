// Import React and other necessary libraries
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios'; // Import Axios for making HTTP requests
import { SlashCircle, Ticket } from 'react-bootstrap-icons'; // Importing Bootstrap icons

const UserFound = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Extract user data from query parameters
  const fullName = params.get('fullName');
  const ucid = params.get('ucid');
  const email = params.get('email');
  const licensePlate = params.get('licensePlate');

  // Modal state for ticket creation
  const [showModal, setShowModal] = useState(false);
  const [offence, setOffence] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [offenceError, setOffenceError] = useState('');
  const [amountDueError, setAmountDueError] = useState('');
  const [validationErrors, setValidationErrors] = useState(null);
  const [ticketCreated, setTicketCreated] = useState(false);

  // Modal state for permit revocation
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [permitExists, setPermitExists] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [permitRevoked, setPermitRevoked] = useState(false);

  useEffect(() => {
    // Fetch client conditions when the component mounts
    const fetchClientConditions = async () => {
      try {
        const response = await axios.get(`https://ucalgary-parking-application-production.up.railway.app/api/client_conditions/?client_ucid=${ucid}`);
        setPermitExists(response.data.permit_exists);
        setTicketCount(response.data.ticket_count);
      } catch (error) {
        console.error('Error fetching client conditions:', error);
      }
    };

    fetchClientConditions();
  }, [ucid, ticketCreated, permitRevoked]);

  // Handle modal open for permit revocation
  const handleRevokeModalOpen = () => {
    setShowRevokeModal(true);
  };

  // Handle modal close for permit revocation
  const handleRevokeModalClose = () => {
    setShowRevokeModal(false);
  };

  // Handle permit revocation
  const handleRevokePermit = async () => {
    try {
      // Send request to backend to delete the permit
      await axios.delete(`https://ucalgary-parking-application-production.up.railway.app/api/revoke-permit/`, {
        data: {
          client_ucid: ucid
        }
      });

      // Set state to trigger re-fetching client conditions
      setPermitRevoked(true);

      // Close the modal after permit revocation
      setShowRevokeModal(false);

      // Show success message
      alert('Permit removed');

      // Reload the page after permit is revoked
      window.location.reload();
    } catch (error) {
      console.error('Error revoking permit:', error);
    }
  };

  // Handle modal open for entering offence details
  const handleModalOpen = () => {
    setShowModal(true);
  };

  // Handle modal close for entering offence details
  const handleModalClose = () => {
    setShowModal(false);
  };

  // Handle form submit for ticket creation
  const handleSubmit = async (event) => {
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

    // Format dates
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const formattedDueDate = dueDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Set headers with token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // Send ticket data to backend
    try {
      await axios.post('https://ucalgary-parking-application-production.up.railway.app/api/tickets/create/', {
        client_ucid: ucid,
        issue_date: currentDate,
        due_date: formattedDueDate,
        offense: offence,
        amount_due: amount
      }, config);

      // Reset form fields and errors
      setOffence('');
      setAmountDue('');
      setOffenceError('');
      setAmountDueError('');
      setShowModal(false);

      // Set state to trigger re-fetching client conditions
      setTicketCreated(true);

      // Show success message
      alert('Ticket created');

      // Reload the page after ticket creation
      window.location.reload();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
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
                <Button variant="danger" onClick={handleRevokeModalOpen} disabled={!permitExists || ticketCount < 3}>
                  <SlashCircle size={20} style={{ marginRight: '5px' }} /> Revoke Permit
                </Button>
                <Button variant="danger" onClick={handleModalOpen}>
                  <Ticket size={20} style={{ marginRight: '5px' }} /> Ticket
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ backgroundColor: '#c4c3bb', height: '35vh' }}></div>

      {/* Modal for entering offence details */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Offence Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Date Issued:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> {new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
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
              Create Ticket
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for permit revocation */}
      <Modal show={showRevokeModal} onHide={handleRevokeModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Permit Revocation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to revoke the parking permit?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRevokeModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRevokePermit}>
            Revoke Permit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserFound;
