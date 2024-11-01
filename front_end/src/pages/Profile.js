import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import AddVehicleModal from './AddVehicleModal'; // Import the modal component

function Profile() {
  const [showModal, setShowModal] = useState(false); // State variable for modal visibility
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [viewVehicleModal, setViewVehicleModal] = useState(false); // State variable for view vehicle modal
  const [selectedVehicle, setSelectedVehicle] = useState(null); // State variable to store the selected vehicle
  const [isAdmin, setIsAdmin] = useState(false); // State variable to determine if user is admin

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }

        const profileResponse = await axios.get('https://ucalgary-parking-application-production.up.railway.app//api/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const vehicleResponse = await axios.get('https://ucalgary-parking-application-production.up.railway.app//api/view-vehicles/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setProfileData(profileResponse.data);
        setVehicles(vehicleResponse.data); // Update vehicles state with retrieved vehicle information

        // Check if the user is an admin
        const adminResponse = await axios.get('https://ucalgary-parking-application-production.up.railway.app//api/check-admin-status/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setIsAdmin(adminResponse.data.isAdmin);
      } catch (error) {
        console.error('Error fetching user information:', error);
        setError('Error fetching user information. Please try again later.');
      }
    };

    fetchProfileInfo();
  }, []);

  const handleEditProfile = () => {
    window.location.href = '/editprofile'; 
  };

  const handleCloseModal = () => setShowModal(false); // Close modal function
  const handleShowModal = () => setShowModal(true); // Show modal function

  const handleCloseViewVehicleModal = () => setViewVehicleModal(false); // Close view vehicle modal function

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setViewVehicleModal(true);
  };

  const addVehicle = async (vehicleData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const response = await axios.post('https://ucalgary-parking-application-production.up.railway.app//api/add-vehicle/', vehicleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Vehicle added:', response.data);
      setVehicles([response.data]);
      
      // Update the profileData state to include the newly added vehicle
      setProfileData({
        ...profileData,
        vehicle: response.data,
      });
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleDeleteVehicle = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }
        await axios.delete('https://ucalgary-parking-application-production.up.railway.app//api/delete-vehicle/', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        // Optionally, you can update the vehicles state to remove the deleted vehicle
        setVehicles([]);
        handleCloseViewVehicleModal();
    } catch (error) {
        console.error('Error deleting vehicle:', error);
    }
};

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!profileData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
      <div style={{ borderTop: '60px solid #8c847c' }}></div>
      <Container fluid style={{ maxWidth: '600px', backgroundColor: '#f0f0f0', maxHeight: '500px' }}>
        <Row className="justify-content-center align-items-center" style={{ height: '55vh' }}>
          <Col md={6}>
            <h1 className="text-center mb-4">Profile</h1>
            <p>UCID: {profileData.ucid}</p>
            <p>Full Name: {profileData.name}</p>
            <p>Email: {profileData.email}</p>
            <p>Address: {profileData.address}</p>
            <p>Phone Number: {profileData.phone_no}</p>
            {/* Button to view vehicle */}
            {vehicles.length > 0 ? (
              <Button variant="primary" onClick={() => handleViewVehicle(vehicles[0])}>View Vehicle</Button>
            ) : (
              !isAdmin && <Button variant="primary" onClick={handleShowModal}>Add Vehicle</Button>
            )}
            <AddVehicleModal show={showModal} handleClose={handleCloseModal} addVehicle={addVehicle} /> {/* Modal component */}
            <Button variant="danger" onClick={handleEditProfile}>Edit Profile</Button>
          </Col>
        </Row>
      </Container>
      {/* View Vehicle Modal */}
      <Modal show={viewVehicleModal} onHide={handleCloseViewVehicleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Vehicle Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVehicle && (
            <div>
              {/* Add this console.log statement */}
              {console.log('Selected Vehicle Data:', selectedVehicle)}
              <p>Make: {selectedVehicle.make}</p>
              <p>Model: {selectedVehicle.model}</p>
              <p>Color: {selectedVehicle.color}</p> {/* Display color */}
              <p>License Plate: {selectedVehicle.plateNumber}</p> {/* Display plate number */}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDeleteVehicle(selectedVehicle.plateNumber)}>Delete</Button>
          <Button variant="secondary" onClick={handleCloseViewVehicleModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <div style={{ borderTop: '60px solid #8c847c' }}></div>
      <div style={{ backgroundColor: '#c4c3bb', height: '30vh' }}></div>
    </div>
  );
}

export default Profile;
