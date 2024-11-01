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
    
        if (ucid.length !== 8) {
            setErrors({ ucidError: 'UCID must be exactly 8 digits long' });
            return;
        }
    
        try {
            const response = await axios.post('https://ucalgary-parking-application-production.up.railway.app/api/login/', { ucid, password });
            if (response.status === 200) {
                const token = response.data.token;
                console.log('Token received:', token);
                localStorage.setItem('token', token);
    
                if (response.data.redirect) {
                    window.location.href = response.data.redirect;
                } else {
                    window.location.href = '/';
                }
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
                        <Form.Group controlId="loginBasicUCID" className="mb-3">
                            <Form.Label>UCID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter UCID"
                                value={ucid}
                                onChange={(e) => setUCID(e.target.value)}
                            />
                            {errors.ucidError && <Alert variant="danger">{errors.ucidError}</Alert>}
                        </Form.Group>

                        <Form.Group controlId="loginBasicPassword" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.passwordError && <Alert variant="danger">{errors.passwordError}</Alert>}
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Button variant="danger" type="submit">
                                Submit
                            </Button>
                            <Button variant="light" href="/signup">
                                Signup
                            </Button>
                        </div>
                    </Form>
                </Container>
            </div>
            <div style={{ backgroundColor: '#c4c3bb', height: '50vh' }}></div>
        </div>
    );
}

export default Login;
