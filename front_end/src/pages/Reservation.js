import * as Bootstrap from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Reservation() {
    return (
        // Add backend for this later - currently hardcoded
        <>
            <h1 id="page-header">Parking Reservations</h1>
            <Bootstrap.Container className="card-container">
                <Bootstrap.Card border="dark" className="d-flex">
                    <Bootstrap.Card.Header className="d-flex bg-berry justify-content-between align-items-center text-white">
                        <h1>Lot 10 - D12</h1>
                        <Icons.CalendarCheckFill className="icon-size" />
                    </Bootstrap.Card.Header>
                    <Bootstrap.Card.Body className="text-center">
                        <Bootstrap.Card.Text><strong>UCID: </strong>30098941</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Payment Number: </strong>8888888</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Date: </strong>3/30/2024</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Start Time: </strong>6:00PM</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>End Time: </strong>8:00PM</Bootstrap.Card.Text>
                    </Bootstrap.Card.Body>
                    <Bootstrap.Card.Footer className="bg-berry">
                        <small className="text-white">Active</small>
                    </Bootstrap.Card.Footer>
                </Bootstrap.Card>
            </Bootstrap.Container>
            <Bootstrap.Container className="card-container">
                <Bootstrap.Card border="dark" className="d-flex">
                    <Bootstrap.Card.Header className="d-flex bg-berry justify-content-between align-items-center text-white">
                        <h1>Lot 10 - D12</h1>
                        <Icons.CalendarCheckFill className="icon-size" />
                    </Bootstrap.Card.Header>
                    <Bootstrap.Card.Body className="text-center">
                        <Bootstrap.Card.Text><strong>UCID: </strong>30098941</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Payment Number: </strong>8888888</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Date: </strong>3/30/2024</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Start Time: </strong>6:00PM</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>End Time: </strong>8:00PM</Bootstrap.Card.Text>
                    </Bootstrap.Card.Body>
                    <Bootstrap.Card.Footer className="bg-berry">
                        <small className="text-white">Active</small>
                    </Bootstrap.Card.Footer>
                </Bootstrap.Card>
            </Bootstrap.Container>
    </>    
    );
}

export default Reservation;