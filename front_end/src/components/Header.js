// Bootstrap imports
import * as Bootstrap from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/header.css';
import logo from '../assets/ucalgary-logo.png';
function Header() {
    return (
        <Bootstrap.Navbar className="header justify-content-start flex-grow-1">
            <Bootstrap.Container>
                <Bootstrap.Navbar.Brand href="/">
                    <img src={ logo } className="school-logo d-inline-block align-top" alt="Logo"/>
                </Bootstrap.Navbar.Brand>
            </Bootstrap.Container>
            <Bootstrap.Container>
                <Bootstrap.Nav className="justify-content-center flex-grow-1">
                    <Bootstrap.NavLink className="center-nav-element" to="/" exact activeClassName="active">
                        <Icons.HouseDoorFill className="icon-size" />
                    </Bootstrap.NavLink>
                    <Bootstrap.NavLink className="center-nav-element" href="ticket">
                        <Icons.TicketDetailedFill className="icon-size" />
                    </Bootstrap.NavLink>
                    <Bootstrap.NavLink className="center-nav-element" href="permit">
                        <Icons.PCircleFill className="icon-size" />
                    </Bootstrap.NavLink>
                    <Bootstrap.NavLink className="center-nav-element" href="reservation">
                        <Icons.CalendarCheckFill className="icon-size" />
                    </Bootstrap.NavLink>
                </Bootstrap.Nav>
            </Bootstrap.Container>
            <Bootstrap.Container>
                <Bootstrap.Nav className="justify-content-end flex-grow-1">
                    <Bootstrap.Nav.Link href="login"><Icons.PersonFill className="icon-size" /></Bootstrap.Nav.Link>
                </Bootstrap.Nav>
            </Bootstrap.Container>
        </Bootstrap.Navbar>
    );
}

export default Header;