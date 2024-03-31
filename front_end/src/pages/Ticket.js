import * as Bootstrap from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Ticket() {
    return (
        // Add backend for this later - currently hardcoded
        <>
            <h1 id="page-header">Parking Tickets</h1>
            <Bootstrap.Container className="card-container">
                <Bootstrap.Card border="dark" className="d-flex">
                    <Bootstrap.Card.Header className="d-flex bg-blue justify-content-between align-items-center text-white">
                        <h1>18799 - Parking Obstruction</h1>
                        <Icons.TicketDetailedFill className="icon-size" />
                    </Bootstrap.Card.Header>
                    <Bootstrap.Card.Body className="text-center">
                        <Bootstrap.Card.Text><strong>Parking Officer: </strong>84128922</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Offender: </strong>30098941</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Issue Date: </strong>3/30/2024</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Due Date: </strong>4/14/2024</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Amount Due: </strong>$70.00</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text>If paid within one week, amount reduced to $50.00</Bootstrap.Card.Text>
                    </Bootstrap.Card.Body>
                    <Bootstrap.Card.Footer className="bg-blue">
                        <small className="text-white">Unpaid</small>
                    </Bootstrap.Card.Footer>
                </Bootstrap.Card>
            </Bootstrap.Container>
            <Bootstrap.Container className="card-container">
                <Bootstrap.Card border="dark" className="d-flex">
                    <Bootstrap.Card.Header className="d-flex bg-blue justify-content-between align-items-center text-white">
                        <h1>44998 - Unauthorized Parking</h1>
                        <Icons.TicketDetailedFill className="icon-size" />
                    </Bootstrap.Card.Header>
                    <Bootstrap.Card.Body className="text-center">
                    <Bootstrap.Card.Text><strong>Parking Officer: </strong>84128922</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Offender: </strong>30098941</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Issue Date: </strong>3/30/2024</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Due Date: </strong>4/14/2024</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Amount Due: </strong>$70.00</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text>If paid within one week, amount reduced to $50.00</Bootstrap.Card.Text>
                    </Bootstrap.Card.Body>
                    <Bootstrap.Card.Footer className="bg-blue">
                        <small className="text-white">Unpaid</small>
                    </Bootstrap.Card.Footer>
                </Bootstrap.Card>
            </Bootstrap.Container>
    </>    
    );
}

export default Ticket;