import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Map from '../components/Map';

function Home() {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <h3 id="page-header">View UCalgary Parking</h3>
            <Map />
            <div>
                <Button variant="danger" onClick={() => setModalShow(true)}>Test</Button>
                <ReserveModal show={modalShow} onHide={() => setModalShow(false)}/>
            </div>  
        </>
    );
}
function ReserveModal(props) {

    const [name, setName] = React.useState("");
    const [ucid, setUcid] = React.useState("");
    const [plate, setPlate] = React.useState("");
    const [fromDate, setFromDate] = React.useState("");
    const [toDate, setToDate] = React.useState("");
    
    const [nameError, setnameErrorMessage] = React.useState("");
    const [ucidError, setucidErrorMessage] = React.useState("");
    const [plateError, setplateErrorMessage] = React.useState("");
    const [fromDateError, setfromDateErrorMessage] = React.useState("");
    const [toDateError, settoDateErrorMessage] = React.useState("");
    const [timeRange, settimeRange] = React.useState("");

    const handleClick = () => {
        let validation = true;

        let splitFromDateTime = "";
        let splitToDateTime = "";

        let FromDate = "";
        let FromTime = "";

        let ToDate = "";
        let ToTime = "";

        let splitFromDate = "";
        let splitToDate = "";

        let splitFromTime = "";
        let splitToTime = "";

        let FromYear = "";
        let FromMonth = "";
        let FromDay = "";

        let ToYear = "";
        let ToMonth = "";
        let ToDay = "";

        let FromHour = "";
        let FromMin = "";

        let ToHour = "";
        let ToMin = "";

        let timePeriod = 0;
        if(name.length === 0){
            setnameErrorMessage('Name is required');
            validation = false;
        }
        else{
            setnameErrorMessage('');
        }

        if(ucid.length === 0){
            setucidErrorMessage('UCID is required');
            validation = false;
        }
        else if(ucid.length !== 8){
            setucidErrorMessage('Invalid UCID');
            validation = false;
        }
        
        else{
            setucidErrorMessage('');
        }

        if(plate.length === 0){
            setplateErrorMessage('License plate is required');
            validation = false;
        }
        else{
            setplateErrorMessage('');
        }

        if(fromDate.length === 0){
            setfromDateErrorMessage('Date is required');
        }
        else{
            setfromDateErrorMessage('');
        }
        if(toDate.length === 0){
            settoDateErrorMessage('Date is required');
        }
        else{
            settoDateErrorMessage('');
        }

        if(fromDate.length !== 0 && toDate.length !== 0){

            settoDateErrorMessage('');
            setfromDateErrorMessage('');

            splitFromDateTime = fromDate.split("T");
            splitToDateTime = toDate.split("T");

            FromDate = splitFromDateTime[0];
            FromTime = splitFromDateTime[1];

            ToDate = splitToDateTime[0];
            ToTime = splitToDateTime[1];
            splitFromDate = FromDate.split("-");
            splitToDate = ToDate.split("-");

            splitFromTime = FromTime.split(":");
            splitToTime = ToTime.split(":");

            FromYear = Number(splitFromDate[0]);
            FromMonth = Number(splitFromDate[1]);
            FromDay = Number(splitFromDate[2]);

            ToYear = Number(splitToDate[0]);
            ToMonth = Number(splitToDate[1]);
            ToDay = Number(splitToDate[2]);

            FromHour = Number(splitFromTime[0]);
            FromMin = Number(splitFromTime[1]);

            ToHour = Number(splitToTime[0]);
            ToMin = Number(splitToTime[1]);

            if(FromYear > ToYear){
                settoDateErrorMessage('Time Period is invalid');
            }
            else if(FromMonth > ToMonth){
                settoDateErrorMessage('Time Period is invalid');
            }
            else if(FromDay > ToDay){
                settoDateErrorMessage('Time Period is invalid');
            }
            else if(FromHour > ToHour){
                settoDateErrorMessage('Time Period is invalid');
            }
            else if(FromMin > ToMin){
                settoDateErrorMessage('Time Period is invalid');
            }
            else if(FromYear === ToYear){
                if(FromMonth === ToMonth){
                    if(FromDay === ToDay){
                        timePeriod = ((ToMin - FromMin) + ((ToHour - FromHour) * 60));
                        if(FromHour === ToHour){
                            if((ToMin - FromMin) < 15){
                                settoDateErrorMessage('Please choose longer period');
                            }
                            else{
                                timePeriod = (ToMin - FromMin);
                            }
                        }
                    }
                    else{
                        settoDateErrorMessage('Time Period is invalid');
                    }
                }
            }
        }

        if((timePeriod/60) >= 3){
            settimeRange('Rate: Day Pass $20')
        }
        else{
            settimeRange('Rate: ' + (timePeriod/60) + ' x $5');
        }


        if(validation === true){

            window.location.href = '/payment';
        }
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter"> Parking Lot Reservation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Lot 12 - A99</h4>
                <p>
                    Please enter your information for reservation.
                </p>
                <div class="row justify-content-center">
                    <div class="col-md-6 mb-3">
                        <label for="revname">Name</label>
                        <input type="text" class="form-control" id="revname" placeholder="" onChange={(e) => setName(e.target.value)} required/>
                        {nameError && <div className="error text-danger"> {nameError} </div>}
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-6 mb-3">
                        <label for="revuicd">UCID</label>
                        <input type="text" class="form-control" id="revucid" placeholder="00000000" maxLength="8" onChange={(e) => setUcid(e.target.value)} required/>
                        {ucidError && <div className="error text-danger"> {ucidError} </div>}
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-6 mb-3">
                        <label for="revplate">License Plate</label>
                        <input type="text" class="form-control" id="revplate" placeholder="ABC-0000" maxLength="8" onChange={(e) => setPlate(e.target.value)} required/>
                        {plateError && <div className="error text-danger"> {plateError} </div>}
                    </div>
                </div>
                <div class="row justify-content-center">
                <div class="col-md-6 mb-3">
                    <div class="form-group">
                        <label for="fromdate">From</label>
                        <div class='input-group date' id='datetimepicker7'>
                            <span class="input-group-text" id="basic-addon1" onClick={handleClick}> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                </svg>
                            </span>
                            <input type='datetime-local' class="form-control" placeholder='01/01 00:00' onChange={(e) => setFromDate(e.target.value)} required/>
                        </div>
                        {fromDateError && <div className="error text-danger"> {fromDateError} </div>}
                    </div>
                </div>   
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6 mb-3">
                    <div class="form-group">
                        <label for="todate">To</label>
                        <div class='input-group date' id='datetimepicker7'>
                            
                            <span class='input-group-text' id="basic-addon2" onClick={handleClick}>                                
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                </svg>                                
                            </span>
                            <input type='datetime-local' class="form-control" placeholder='01/01 00:30' onChange={(e) => setToDate(e.target.value)} required/>
                            
                        </div>
                        {toDateError && <div className="error text-danger"> {toDateError} </div>}
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6 mb-3">
                    {/* <label for="revplate">Time Period</label> */}
                    {timeRange && <div className="text"> {timeRange} </div>}
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='danger' onClick={handleClick}>Continue to payment</Button>
            
        </Modal.Footer>
    </Modal>
    );
  }

export default Home;