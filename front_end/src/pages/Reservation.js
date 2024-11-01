import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Bootstrap from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Reservation() {

    const [userReservations, setUserReservations] = useState([]);

    const fetchUserReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }
            const response = await axios.get('https://ucalgary-parking-application-production.up.railway.app//api/view-reservations/', {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                }
            });
            setUserReservations(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserReservations();
    }, []);

    return (
        <>  
            <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <h1 id="page-header">Parking Reservations</h1>
            {userReservations.map(reservation => (
                <Bootstrap.Container key={ reservation.lot_no } className="card-container">
                    <Bootstrap.Card border="dark" className="d-flex">
                        <Bootstrap.Card.Header className="d-flex bg-berry justify-content-between align-items-center text-white">
                            <h1>Lot { reservation.lot_no }</h1>
                            <Icons.CalendarCheckFill className="icon-size" />
                        </Bootstrap.Card.Header>
                        <Bootstrap.Card.Body className="text-center">
                            <Bootstrap.Card.Text><strong>UCID: </strong>{ reservation.client_ucid }</Bootstrap.Card.Text>
                            <Bootstrap.Card.Text><strong>Payment Number: </strong>{ reservation.payment_no }</Bootstrap.Card.Text>
                            <Bootstrap.Card.Text><strong>Date: </strong>{ reservation.date }</Bootstrap.Card.Text>
                            <Bootstrap.Card.Text><strong>Start Time: </strong>{ reservation.start_time }</Bootstrap.Card.Text>
                            <Bootstrap.Card.Text><strong>End Time: </strong>{ reservation.end_time }</Bootstrap.Card.Text>
                        </Bootstrap.Card.Body>
                        <Bootstrap.Card.Footer className="bg-berry">
                            <small className="text-white">Active</small>
                        </Bootstrap.Card.Footer>
                    </Bootstrap.Card>
                </Bootstrap.Container>
            ))}
        </>    
    );
}

export default Reservation;