import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Login() {
    const [ucid, setUCID] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate UCID length
        if (ucid.length !== 8) {
            setErrors({ ucidError: 'UCID must be exactly 8 digits long' });
            return;
        }
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', { ucid, password });
            if (response.status === 200) {
                const token = response.data.token;
                console.log('Token received:', token);
                sessionStorage.setItem('token', token);
                // Redirect to home page after successful login
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000); // 2 seconds delay before redirecting
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrors({ passwordError: 'Invalid credentials' });
            } else {
                console.error('Error during login:', error);
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
                        </Form.Group>
                        {errors.ucidError && <Alert variant="danger">{errors.ucidError}</Alert>}

                        <Form.Group controlId="loginBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mb-3"
                            />
                        </Form.Group>
                        {errors.passwordError && <Alert variant="danger">{errors.passwordError}</Alert>}

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
