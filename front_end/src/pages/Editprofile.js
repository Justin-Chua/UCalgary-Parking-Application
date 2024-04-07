import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function EditProfile() {
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [plateNo, setPlateNo] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (phoneNo.length !== 10) {
            setErrorMessage('Please enter a 10-digit phone number.');
            return;
        }
        if (plateNo.length > 7) {
            setErrorMessage('License plates are a maximum of 7 characters long.');
            return;
        }

        try {
            // Perform the update profile action here
            const response = await fetch('http://127.0.0.1:8000/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    address,
                    phoneNo,
                    plateNo,
                    password,
                }),
            });

            if (response.ok) {
                // Redirect to the profile page
                window.location.href = '/profile';
            } else {
                // Handle error response
                setErrorMessage('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again later.');
        }
    };

    const redirectToProfile = () => {
        window.location.href = '/profile';
    };

    return (
        <div>
            <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <Container className="pt-5 pb-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h1 className="text-center mb-4">Edit Profile</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                />
                            </Form.Group>
                            <Form.Group controlId="formAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter address"
                                />
                            </Form.Group>
                            <Form.Group controlId="formPhoneNo">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    placeholder="Enter phone number"
                                />
                                {errorMessage && phoneNo.length !== 9 && <Alert variant="danger">{errorMessage}</Alert>}
                            </Form.Group>
                            <Form.Group controlId="formPlateNo">
                                <Form.Label>License Plate</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={plateNo}
                                    onChange={(e) => setPlateNo(e.target.value)}
                                    placeholder="Enter license plate"
                                />
                                {plateNo.length > 7 && <Alert variant="danger">License plates are a maximum of 7 characters long.</Alert>}
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-between">
                                <Button variant="danger" type="submit" className="mr-2">
                                    Update Profile
                                </Button>
                                <Button variant="secondary" onClick={redirectToProfile}>
                                    Back
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <div style={{ backgroundColor: '#c4c3bb', height: '3000px' }}></div>
        </div>
    );
}

export default EditProfile;
