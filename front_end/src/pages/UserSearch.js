// UserSearch.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const UserSearch = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`https://ucalgary-parking-application-production.up.railway.app//api/usersearch/?licensePlate=${licensePlate}`);
      const userData = response.data;
      // Redirect to UserFound page with user data in the URL query params
      window.location.href = `/userfound?fullName=${userData.name}&ucid=${userData.ucid}&email=${userData.email}&licensePlate=${userData.plateNumber}`;
    } catch (error) {
      setError('User not found');
    }
  };

  const handleChange = (event) => {
    // Ensure only maximum 7 characters are entered
    if (event.target.value.length <= 7) {
      setLicensePlate(event.target.value);
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
      <div style={{ borderTop: '30px solid #8c847c', borderBottom: '30px solid #8c847c' }}>
        <Container className="pt-5 pb-5">
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h1 className="text-center mb-4">User Search</h1>
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formLicensePlate">
                  <Form.Label className="font-weight-bold">License Plate</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={7}
                    value={licensePlate}
                    onChange={handleChange}
                    placeholder="Enter license plate"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ backgroundColor: '#c4c3bb', height: '35vh' }}></div>
    </div>
  );
};

export default UserSearch;
