// Import necessary components and assets
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap'; // Import Alert component for error messages
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/header.css';

function Login() {
    const [ucid, setUCID] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [ucidError, setUCIDError] = useState(''); 
    const [passwordError, setPasswordError] = useState(''); 

    // Function to handle form submission
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
                // Redirect to home page after successful login
                window.location.href = '/';
            }
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}> {/* Use handleSubmit function for form submission */}
                <Form.Group className="mb-3" controlId="loginBasicUCID">
                    <Form.Label>UCID</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter UCID"
                        value={ucid}
                        onChange={(e) => setUCID(e.target.value)} // Update UCID state on input change
                    />
                    {ucidError && <Alert variant="danger">{ucidError}</Alert>} {/* Display UCID error message */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                    />
                    {passwordError && <Alert variant="danger">{passwordError}</Alert>} {/* Display password error message */}
                </Form.Group>

                <Button variant="danger" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Login;
