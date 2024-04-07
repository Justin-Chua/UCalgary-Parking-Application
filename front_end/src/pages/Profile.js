import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
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
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching user information:', error);
                setError('Error fetching user information. Please try again later.');
            }
        };

        fetchUserInfo();
    }, []);

    const handleEditProfile = () => {
        window.location.href = '/editprofile'; // Redirect to edit profile page
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
                        <Button variant="danger" onClick={handleEditProfile}>Edit Profile</Button>
                    </Col>
                </Row>
            </Container>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <div style={{ backgroundColor: '#c4c3bb', height: '3000px' }}></div>
        </div>
    );
}

export default Profile;
