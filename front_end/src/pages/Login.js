// Import necessary components and assets
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap'; // Import Alert component for error messages
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const [ucid, setUCID] = useState('');
    const [password, setPassword] = useState('');
    const [ucidError, setUCIDError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (ucid.length !== 8) {
            setUCIDError('Please enter a Valid 8 digit UCID');
        } else {
            setUCIDError('');
            if (password !== 'correctpassword') {
                setPasswordError('Incorrect password');
            } else {
                setPasswordError('');
                window.location.href = '/';
            }
        }
    };

    return (
        <div>
            
            <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
            <div style={{ borderTop: '30px solid #8c847c', borderBottom: '30px solid #8c847c' }}>
                <Container className="pt-5 pb-5">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="loginBasicUCID">
                            <Form.Label>UCID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter UCID"
                                value={ucid}
                                onChange={(e) => setUCID(e.target.value)}
                                className="mb-3"
                            />
                            {ucidError && <Alert variant="danger">{ucidError}</Alert>}
                        </Form.Group>

                        <Form.Group controlId="loginBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mb-3"
                            />
                            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                        </Form.Group>

                        <Button variant="danger" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
            </div>
            <div style={{ backgroundColor: '#c4c3bb', height: '3000px' }}></div>
        </div>
    );
}

export default Login;
