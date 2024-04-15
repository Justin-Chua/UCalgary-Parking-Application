import React, { useState, useEffect } from 'react';
import { Row, Col, Navbar, Container, Nav, NavLink, Dropdown, DropdownButton } from 'react-bootstrap';
import { HouseDoorFill, TicketDetailedFill, PCircleFill, CalendarCheckFill, PersonFill, BellFill } from 'react-bootstrap-icons';
import logo from '../assets/ucalgary-logo.png';
import axios from 'axios';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userNotifications, setUserNotifications] = useState([]);
    const [logoutTimer, setLogoutTimer] = useState(null);

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

        // if user is logged in and not an admin, perform fetch to user notifications
        if (!isAdmin && isLoggedIn) fetchUserNotifications();

        // Calculate expiration time of the token
        const decodedToken = parseJwt(token);
        if (decodedToken) {
            const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds

            // Set a timer to trigger logout 10 seconds before token expiration
            const logoutTime = expirationTime - 10000; // 10 seconds before expiration
            const timer = setTimeout(() => {
                handleLogout();
            }, logoutTime - Date.now());

            setLogoutTimer(timer);
        }

        // Cleanup the timer when component unmounts
        return () => {
            clearTimeout(logoutTimer);
        };
    }, [isAdmin, isLoggedIn]);

    const fetchUserNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }
            const response = await axios.get('http://127.0.0.1:8000/api/view-notifications/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUserNotifications(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteDiscussion = async (event, notification_id) => {
        event.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }
            await axios.delete('http://127.0.0.1:8000/api/view-notifications/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: { id: notification_id }
            });
            fetchUserNotifications();
        } catch (error) {
            console.log(error);
        }
    };

    const handleItemClick = (title) => {
        if (title.includes("Ticket"))
            window.location.href = "/ticket";
        else
            window.location.href = "/permit";
    };

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

    // Function to decode JWT token
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
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
                    <NavLink className="center-nav-element" href={isAdmin ? "/usersearch" : "/"}>
                        <HouseDoorFill className="icon-size" />
                    </NavLink>
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
                    {isLoggedIn && !isAdmin && (
                        <DropdownButton id="dropdown-button" align="end" variant="transparent" title={<BellFill className="icon-size" />}>
                            <Dropdown.ItemText id="dropdown-item-text"><h4>Notifications</h4></Dropdown.ItemText>
                            <Dropdown.Divider />
                            {userNotifications.length > 0 ? (
                                userNotifications.map(notification => (
                                    <Dropdown.Item id="dropdown-item"
                                        key={notification.notification_id}
                                        onClick={() => handleItemClick(notification.title)}
                                    >
                                        <Container id="dropdown-item-text">
                                            <Row>
                                                <Col>
                                                    <h6>{notification.title}</h6>
                                                    <p>{notification.message}</p>
                                                </Col>
                                                <Col xs="auto">
                                                    <button
                                                        onClick={(event) => handleDeleteDiscussion(event, notification.notification_id)}>
                                                        Dismiss
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Dropdown.Item>
                                ))
                            ) : (
                                <Dropdown.ItemText style={{ textAlign: 'center' }}>No Notifications</Dropdown.ItemText>
                            )}
                        </DropdownButton>
                    )}
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
