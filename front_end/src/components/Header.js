import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, NavLink, NavDropdown } from 'react-bootstrap';
import { HouseDoorFill, TicketDetailedFill, PCircleFill, CalendarCheckFill, PersonFill } from 'react-bootstrap-icons';
import logo from '../assets/ucalgary-logo.png';
import axios from 'axios'; // Import axios for making HTTP requests

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in

    // Effect to check if user is logged in when component mounts
    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        setIsLoggedIn(!!token); // Set isLoggedIn state based on presence of token
    }, []);

    // Function to handle logout
    const handleLogout = async () => {
        try {
            const refreshToken = sessionStorage.getItem('refreshToken'); // Retrieve refresh token from sessionStorage
            await axios.post('http://127.0.0.1:8000/api/logout/', { refresh_token: refreshToken }); // Make POST request to logout endpoint
            // Clear access token from localStorage
            localStorage.removeItem('token');
            // Clear refresh token from sessionStorage if it exists
            if (refreshToken) {
                sessionStorage.removeItem('refreshToken');
            }
            // Update isLoggedIn state to false
            setIsLoggedIn(false);
            // Redirect to login page or homepage
            window.location.href = '/login'; // or '/' depending on your setup
        } catch (error) {
            console.error('Error during logout:', error); // Log error if logout fails
        }
    };

    return (
        <Navbar className="header justify-content-start flex-grow-1">
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo} className="school-logo d-inline-block align-top" alt="Logo" />
                </Navbar.Brand>
            </Container>
            <Container>
                <Nav className="justify-content-center flex-grow-1">
                    <NavLink className="center-nav-element" href="/">
                        <HouseDoorFill className="icon-size" />
                    </NavLink>
                    <NavLink className="center-nav-element" href="/ticket">
                        <TicketDetailedFill className="icon-size" />
                    </NavLink>
                    <NavLink className="center-nav-element" href="/permit">
                        <PCircleFill className="icon-size" />
                    </NavLink>
                    <NavLink className="center-nav-element" href="/reservation">
                        <CalendarCheckFill className="icon-size" />
                    </NavLink>
                </Nav>
            </Container>
            <Container>
                <Nav className="justify-content-end flex-grow-1">
                    {isLoggedIn ? ( // If user is logged in, show profile and logout links
                        <>
                            <NavLink href="/profile">
                                <PersonFill className="icon-size" />
                            </NavLink>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </>
                    ) : ( // If user is not logged in, show login link
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
