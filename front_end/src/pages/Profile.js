import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import Axios

function Profile() {
    const [ucid, setUCID] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [error, setError] = useState(null); 
    const [profileUpdated, setProfileUpdated] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = sessionStorage.getItem('token');
                console.log('Token:', token); // Log the token retrieved from session storage
                if (!token) {
                    console.error('Token not found');
                    return;
                }
                const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Request:', response); // Log the request being sent
                const userData = response.data;
                setUCID(userData.ucid);
                setFullName(userData.fullName);
                setEmail(userData.email);
                setAddress(userData.address);
                setPhoneNo(userData.phoneNo);
            } catch (error) {
                console.error('Error fetching user information:', error);
                setError('Error fetching user information. Please try again later.');
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        // Check if profileUpdated state is true
        // If true, set a timeout to reset the state after 3 seconds
        if (profileUpdated) {
            const timeout = setTimeout(() => {
                setProfileUpdated(false);
            }, 3000);

            // Clear the timeout when the component unmounts or profileUpdated state changes
            return () => clearTimeout(timeout);
        }
    }, [profileUpdated]);

    const handleEditProfile = () => {
        window.location.href = '/editprofile';
    };

    return (
        <div>
            <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <Container fluid style={{ maxWidth: '600px', backgroundColor: '#f0f0f0', maxHeight: '500px' }}>
                <Row className="justify-content-center align-items-center" style={{ height: '55vh' }}>
                    <Col md={6}>
                        <h1 className="text-center mb-4">Profile</h1>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <p>UCID: {ucid}</p>
                        <p>Full Name: {fullName}</p>
                        <p>Email: {email}</p>
                        <p>Address: {address}</p>
                        <p>Phone Number: {phoneNo}</p>
                        <Button variant="danger" onClick={handleEditProfile}>Edit Profile</Button>
                        {profileUpdated && <Alert variant="success">Profile Updated</Alert>}
                    </Col>
                </Row>
            </Container>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <div style={{ backgroundColor: '#c4c3bb', height: '3000px' }}></div>
        </div>
    );
}

export default Profile;
