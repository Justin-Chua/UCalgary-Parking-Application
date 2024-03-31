// Import necessary components and assets
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/header.css';

function Signup() {
    const [ucid, setUCID] = useState(''); 
    const [ucidError, setUCIDError] = useState(''); 
    const [phoneNo, setPhoneNo] = useState('');
    const [phoneNoError, setPhoneNoError] = useState('');
    const [plateNo, setPlateNo] = useState('');
    const [plateNoError, setPlateNoError] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault(); 
        let valid = true;

        if (ucid.length !== 8) {
            setUCIDError('Please enter a Valid 8 digit UCID');
            valid = false;
        } else {
            setUCIDError(''); 
        }

        if (phoneNo.length !== 9) {
            setPhoneNoError('Please enter a valid phone number of 9 digits');
            valid = false;
        } else {
            setPhoneNoError(''); 
        }

        if (plateNo.length > 7) {
            setPlateNoError('License plates can only be 7 characters long');
            valid = false;
        } else {
            setPlateNoError(''); 
        }

        if (valid) {

            window.location.href = '/';
        }
    };

    return (
        <Container>
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
                            <Form.Control type="name" placeholder="Enter Name" />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="SignupBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email" />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="SignupBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" />
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="SignupBasicAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="address" placeholder="Enter Address" />
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
                    <Col>
                        <Form.Group className="mb-3" controlId="SignupBasicPlateNo">
                            <Form.Label>License Plate</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter License Plate" 
                                value={plateNo}
                                onChange={(e) => setPlateNo(e.target.value)} 
                            />
                            {plateNoError && <Alert variant="danger">{plateNoError}</Alert>}
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="danger" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Signup;
