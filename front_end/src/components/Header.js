import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, NavLink, NavDropdown } from 'react-bootstrap';
import { HouseDoorFill, TicketDetailedFill, PCircleFill, CalendarCheckFill, PersonFill } from 'react-bootstrap-icons';
import logo from '../assets/ucalgary-logo.png';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        // Clear token from localStorage and set isLoggedIn to false
        localStorage.removeItem('token');
        setIsLoggedIn(false);
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
                    {isLoggedIn ? (
                        <>
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
