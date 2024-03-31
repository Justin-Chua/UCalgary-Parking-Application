import * as Bootstrap from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Permit() {
    return (
        <>
            <h1 id="page-header">Parking Permits</h1>
            <Bootstrap.Container className="card-container">
                <Bootstrap.Card border="dark" className="d-flex">
                    <Bootstrap.Card.Header className="d-flex bg-orange justify-content-between align-items-center text-white">
                        <h1>101 - McMahon Stadium</h1>
                        <Icons.PCircleFill className="icon-size" />
                    </Bootstrap.Card.Header>
                    <Bootstrap.Card.Body className="text-center">
                        <Bootstrap.Card.Text><strong>Issuer: </strong>12312312</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>UCID: </strong>30098941</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Payment Number: </strong>8888888</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Issue Date: </strong>1/2/2024</Bootstrap.Card.Text>
                        <Bootstrap.Card.Text><strong>Expiry Date: </strong>4/9/2024</Bootstrap.Card.Text>
                    </Bootstrap.Card.Body>
                    <Bootstrap.Card.Footer className="bg-orange">
                        <small className="text-white">Active</small>
                    </Bootstrap.Card.Footer>
                </Bootstrap.Card>
            </Bootstrap.Container>
        </>    
    );
}

export default Permit;