import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, NavLink, Dropdown, DropdownButton } from 'react-bootstrap';
import { HouseDoorFill, TicketDetailedFill, PCircleFill, CalendarCheckFill, PersonFill, BellFill } from 'react-bootstrap-icons';
import logo from '../assets/ucalgary-logo.png';
import axios from 'axios'; 

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        setIsLoggedIn(!!token); 

        // Check if the user is an admin
        axios.get('http://127.0.0.1:8000/api/check-admin-status/', { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setIsAdmin(response.data.isAdmin);
            })
            .catch(error => {
                console.error('Error checking admin status:', error); 
            });
    }, []);

    const handleLogout = async () => {
        try {
            const refreshToken = sessionStorage.getItem('refreshToken');
            await axios.post('http://127.0.0.1:8000/api/logout/', { refresh_token: refreshToken }); 
            
            localStorage.removeItem('token');
            
            if (refreshToken) {
                sessionStorage.removeItem('refreshToken');
            }
            
            setIsLoggedIn(false);
            
            window.location.href = '/login'; 
        } catch (error) {
            console.error('Error during logout:', error); 
        }
    };

    return (
        <Navbar className="header justify-content-start align-items-center flex-grow-1">
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo} className="school-logo d-inline-block align-top" alt="Logo" />
                </Navbar.Brand>
            </Container>
            <Container>
                <Nav className="justify-content-center align-items-center flex-grow-1">
                    {isAdmin ? (
                        <NavLink className="center-nav-element" href="/usersearch">
                            <HouseDoorFill className="icon-size" />
                        </NavLink>
                    ) : (
                        <NavLink className="center-nav-element" href="/">
                            <HouseDoorFill className="icon-size" />
                        </NavLink>
                    )}
                    {!isAdmin && isLoggedIn && (
                        <>
                            <NavLink className="center-nav-element" href="/ticket">
                                <TicketDetailedFill className="icon-size" />
                            </NavLink>
                            <NavLink className="center-nav-element" href="/permit">
                                <PCircleFill className="icon-size" />
                            </NavLink>
                            <NavLink className="center-nav-element" href="/reservation">
                                <CalendarCheckFill className="icon-size" />
                            </NavLink>
                        </>
                    )}
                </Nav>
            </Container>
            <Container>
                <Nav className="justify-content-end align-items-center flex-grow-1">
                    {isLoggedIn ? ( 
                        <>  
                            {/* Currently hardcoded */}
                            <DropdownButton id="dropdown-button" align="end" variant="transparent" title={<BellFill className="icon-size" />}>
                                <Dropdown.Item id="dropdown-item">
                                    <h5>Parking Ticket Received</h5>
                                    <p> You have received a parking ticket! What in the world are you doing kid! </p>
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item id="dropdown-item">
                                    <h5>Parking Permit Revoked</h5>
                                    <p> Your permit has been revoked! What in the world are you doing kid! </p>
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item id="dropdown-item">
                                    <h5>Parking Ticket Overdue</h5>
                                    <p> Your ticket is overdue! What in the world are you doing kid! </p>
                                </Dropdown.Item>
                            </DropdownButton>
                            <NavLink href="/profile">
                                <PersonFill className="icon-size" />
                            </NavLink>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </>
                    ) : ( 
                        <NavLink href="/login">
                            <PersonFill className="icon-size" />
                        </NavLink>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;
