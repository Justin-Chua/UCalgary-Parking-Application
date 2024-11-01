import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Bootstrap from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Ticket() {

    const [userTickets, setUserTickets] = useState([]);

    const fetchUserTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }
            const response = await axios.get('https://ucalgary-parking-application-production.up.railway.app//api/view-tickets/', {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                }
            });
            setUserTickets(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserTickets();
    }, []);

    return (
        <>  
            <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <h1 id="page-header">Parking Tickets</h1>
            {userTickets.map(ticket => (
                <Bootstrap.Container key={ticket.ticket_no} className="card-container">
                        <Bootstrap.Card border="dark" className="d-flex">
                            <Bootstrap.Card.Header className="d-flex bg-blue justify-content-between align-items-center text-white">
                                <h1>{ ticket.ticket_no } - { ticket.offense }</h1>
                                <Icons.TicketDetailedFill className="icon-size" />
                            </Bootstrap.Card.Header>
                            <Bootstrap.Card.Body className="text-center">
                                <Bootstrap.Card.Text><strong>Parking Officer UCID: </strong>{ticket.admin_ucid}</Bootstrap.Card.Text>
                                <Bootstrap.Card.Text><strong>Offender UCID: </strong>{ticket.client_ucid}</Bootstrap.Card.Text>
                                <Bootstrap.Card.Text><strong>Issue Date: </strong>{ticket.issue_date}</Bootstrap.Card.Text>
                                <Bootstrap.Card.Text><strong>Due Date: </strong>{ticket.due_date}</Bootstrap.Card.Text>
                                <Bootstrap.Card.Text><strong>Amount Due: </strong>${ticket.amount_due}.00</Bootstrap.Card.Text>
                                <Bootstrap.Card.Text>Amount due increases by $20.00 following the due date</Bootstrap.Card.Text>
                            </Bootstrap.Card.Body>
                            <Bootstrap.Card.Footer className="bg-blue">
                                <small className="text-white">{ticket.paid ? 'Paid' : 'Unpaid'}</small>
                            </Bootstrap.Card.Footer>
                        </Bootstrap.Card>
                </Bootstrap.Container>
            ))}
        </>    
    );
}

export default Ticket;