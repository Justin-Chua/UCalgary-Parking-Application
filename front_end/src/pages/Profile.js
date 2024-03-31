import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'; // Import Button component for edit profile button
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/header.css';

function Profile() {
    // Define state variables to store user information and error
    const [ucid, setUCID] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [plateNo, setPlateNo] = useState('');
    const [error, setError] = useState(null); // State variable to store error message

    // useEffect to fetch user information when the component mounts
    useEffect(() => {
        // Example: Fetch user information from backend API and set state variables
        const fetchUserInfo = async () => {
            try {
                // Example: Fetch user information from backend API
                const response = await fetch('api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer your_token_here',
                        'Content-Type': 'application/json'
                    }
                });
                const userData = await response.json();

                // Set user information in state variables
                setUCID(userData.ucid);
                setFullName(userData.fullName);
                setEmail(userData.email);
                setAddress(userData.address);
                setPhoneNo(userData.phoneNo);
                setPlateNo(userData.plateNo);
            } catch (error) {
                console.error('Error fetching user information:', error);
                // Set error state if there's an error
                setError('Error fetching user information. Please try again later.');
            }
        };

        // Call fetchUserInfo function when the component mounts
        fetchUserInfo();
    }, []);

    // Function to handle edit profile button click
    const handleEditProfile = () => {
        // Redirect to edit profile page
        window.location.href = '/editprofile';
    };

    return (
        <Container fluid style={{ maxWidth: '800px', backgroundColor: '#f0f0f0', maxHeight: '500px' }}>
            <Row className="justify-content-center align-items-center" style={{ height: '55vh' }}>
                <Col md={6}>
                    <h1 className="text-center mb-4">Profile</h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <p>UCID: {ucid}</p>
                    <p>Full Name: {fullName}</p>
                    <p>Email: {email}</p>
                    <p>Address: {address}</p>
                    <p>Phone Number: {phoneNo}</p>
                    <p>License Plate: {plateNo}</p>
                    <Button variant="primary" onClick={handleEditProfile}>Edit Profile</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
