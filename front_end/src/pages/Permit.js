import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Bootstrap from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Permit() {

    const [userPermits, setUserPermits] = useState([]);

    const fetchUserPermits = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }
            const response = await axios.get('http://127.0.0.1:8000/api/view-permits/', {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                }
            });
            setUserPermits(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserPermits();
    }, []);
    return (
        <>
            <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <h1 id="page-header">Parking Permits</h1>
            {userPermits.map(permit => (
                <Bootstrap.Container key={permit.permit_no} className="card-container">
                    <Bootstrap.Card border="dark" className="d-flex">
                        <Bootstrap.Card.Header className="d-flex bg-orange justify-content-between align-items-center text-white">
                            <h1>{ permit.permit_no } - McMahon Stadium</h1>
                            <Icons.PCircleFill className="icon-size" />
                        </Bootstrap.Card.Header>
                        <Bootstrap.Card.Body className="text-center">
                            <Bootstrap.Card.Text><strong>Ticket Issuer: </strong>{ permit.admin_ucid }</Bootstrap.Card.Text>
                            <Bootstrap.Card.Text><strong>UCID: </strong>{ permit.client_ucid }</Bootstrap.Card.Text>
                            <Bootstrap.Card.Text><strong>Payment Number: </strong>{ permit.payment_no }</Bootstrap.Card.Text>
                            <Bootstrap.Card.Text><strong>Issue Date: </strong>{ permit.pp_issue_date }</Bootstrap.Card.Text>
                            <Bootstrap.Card.Text><strong>Expiry Date: </strong>{ permit.pp_expiry_date }</Bootstrap.Card.Text>
                        </Bootstrap.Card.Body>
                        <Bootstrap.Card.Footer className="bg-orange">
                            <small className="text-white">Active</small>
                        </Bootstrap.Card.Footer>
                    </Bootstrap.Card>
                </Bootstrap.Container>
            ))}
        </>    
    );
}

export default Permit;