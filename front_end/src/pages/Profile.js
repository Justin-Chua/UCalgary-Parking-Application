import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/header.css';

function Profile() {

    const [ucid, setUCID] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [plateNo, setPlateNo] = useState('');
    const [error, setError] = useState(null); 


    useEffect(() => {
    
        const fetchUserInfo = async () => {
            try {
      
                const response = await fetch('api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer your_token_here',
                        'Content-Type': 'application/json'
                    }
                });
                const userData = await response.json();

          
                setUCID(userData.ucid);
                setFullName(userData.fullName);
                setEmail(userData.email);
                setAddress(userData.address);
                setPhoneNo(userData.phoneNo);
                setPlateNo(userData.plateNo);
            } catch (error) {
                console.error('Error fetching user information:', error);

                setError('Error fetching user information. Please try again later.');
            }
        };

        fetchUserInfo();
    }, []);


    const handleEditProfile = () => {
 
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
