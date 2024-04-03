import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/header.css';
import axios from 'axios';

function Signup() {
    const [ucid, setUCID] = useState(''); 
    const [ucidError, setUCIDError] = useState(''); 
    const [phoneNo, setPhoneNo] = useState('');
    const [phoneNoError, setPhoneNoError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); 
        let valid = true;

        if (ucid.length !== 8 || isNaN(ucid) || parseInt(ucid) <= 0) {
            setUCIDError('Please enter a Valid 8 digit UCID');
            valid = false;
        } else {
            setUCIDError(''); 
        }

        if (phoneNo.length !== 10 || isNaN(phoneNo) || parseInt(phoneNo) <= 0) {
            setPhoneNoError('Please enter a valid phone number of 10 digits');
            valid = false;
        } else {
            setPhoneNoError(''); 
        }

        if (valid) {
            // Prepare the data
            const userData = {
                ucid, name, email, password, address, phone_no: phoneNo
            };
            
            // Send data to your backend
            axios.post('http://127.0.0.1:8000/api/signup/', userData) // Adjust the URL based on your configuration
                .then(response => {
                    console.log('User registered:', response.data);
                    // Redirect or show a success message
                    window.location.href = '/'; // Or handle redirection based on your needs
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    // Optionally, handle errors, e.g., show an error message
                });
        }
    };

    return (
        <div>
            <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <Container className="pt-5 pb-5">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="signupUCID">
                        <Form.Label>UCID</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter UCID"
                            value={ucid}
                            onChange={(e) => setUCID(e.target.value)} 
                        />
                        {ucidError && <Alert variant="danger">{ucidError}</Alert>}
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="SignupBasicName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="SignupBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="SignupBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="SignupBasicAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Address" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="SignupBasicPhoneNo">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control 
                                    type="tel" 
                                    placeholder="Enter Phone Number" 
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)} 
                                />
                                {phoneNoError && <Alert variant="danger">{phoneNoError}</Alert>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="danger" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <div style={{ backgroundColor: '#c4c3bb', height: '3000px' }}></div>
        </div>
    );
}

export default Signup;
