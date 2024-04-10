// AddVehicleModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddVehicleModal({ show, handleClose, addVehicle }) {
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    color: '', // Store color as a string directly
    plateNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure that the color value is sent in lowercase
    const lowercaseValue = name === 'color' ? value.toLowerCase() : value;
    setVehicleData({ ...vehicleData, [name]: lowercaseValue }); // Update the state directly

  };

  const handleSubmit = () => {
    addVehicle(vehicleData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Vehicle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="make">
            <Form.Label>Make</Form.Label>
            <Form.Control type="text" name="make" onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="model">
            <Form.Label>Model</Form.Label>
            <Form.Control type="text" name="model" onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="color">
            <Form.Label>Color</Form.Label>
            <Form.Control as="select" name="color" onChange={handleChange}>
              <option value="">Select Color</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="orange">Orange</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="plateNumber">
            <Form.Label>Plate Number</Form.Label>
            <Form.Control type="text" name="plateNumber" maxLength="7" onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddVehicleModal;
