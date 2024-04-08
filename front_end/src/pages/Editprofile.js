import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

function EditProfile() {
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!address && !phoneNo && !password) {
            setErrorMessage('Please provide data for updating profile.');
            return;
        }

        if (phoneNo && phoneNo.length !== 10) {
            setErrorMessage('Phone number must be exactly 10 digits long.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:8000/api/profile/', {
                address,
                phoneNo,
                password
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setSuccessMessage('Information successfully updated');
                setTimeout(() => {
                    setSuccessMessage('');
                    window.location.href = '/profile';
                }, 3000);
            } else {
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
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <Form onSubmit={handleSubmit}>
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
