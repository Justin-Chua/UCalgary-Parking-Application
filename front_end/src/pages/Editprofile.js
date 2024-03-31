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


    const handleSubmit = (event) => {
        event.preventDefault();

        if (phoneNo.length !== 9) {
            setErrorMessage('Please enter a 9-digit phone number.');
            return;
        }
        if (plateNo.length > 7) {
            setErrorMessage('License plates are a maximum of 7 characters long.');
            return;
        }

        console.log('Updated Profile:', { email, address, phoneNo, plateNo, password });
    };

    const redirectToProfile = () => {
        window.location.href = '/profile';
    };

    return (
        <Container>
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
                            {phoneNo.length !== 9 && <Alert variant="danger">Please enter a 9-digit phone number.</Alert>}
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
                        <Button variant="primary" type="submit" className="mr-2">
                            Update Profile
                        </Button>
                        <Button variant="secondary" onClick={redirectToProfile}>
                            Back
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default EditProfile;
