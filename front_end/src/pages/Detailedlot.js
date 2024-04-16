import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap'; 
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';

function DetailedLot() {
    // Dummy data for demonstration
    const [parkingStalls, setParkingStalls] = useState([]);
    //const totalStalls = 112; // Total number of stalls
    const [modalShow, setModalShow] = useState(false);
    const [selectedStallId, setSelectedStallId] = useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const lot_no = params.get("lot_no");
    const totalStalls = params.get('capacity');

    useEffect(() => {
        // Generate dummy data for demonstration
        const generateParkingStalls = () => {
            const newStalls = [];
            for (let i = 1; i <= totalStalls; i++) {
                newStalls.push({ id: i, available: Math.random() < 0.5 });
            }
            setParkingStalls(newStalls);
        };

        generateParkingStalls();
    }, []);

    const resetModal = () => {
        setModalShow(false);
        // Reset other states if there are any
    };

    const renderParkingStalls = () => {
        // For multiple groups
        const stallsPerGroup = 20;
        const totalGroups = Math.ceil(parkingStalls.length / stallsPerGroup);

        const groups = [];

        for (let groupIndex = 0; groupIndex < totalGroups; groupIndex++) {
            const startIdx = groupIndex * stallsPerGroup;
            const endIdx = Math.min(startIdx + stallsPerGroup, parkingStalls.length);
            const groupStalls = parkingStalls.slice(startIdx, endIdx);

            const groupRows = [];

            for (let rowIndex = 0; rowIndex < Math.ceil(groupStalls.length / 2); rowIndex++) {
                const rowStalls = groupStalls.slice(rowIndex * 2, rowIndex * 2 + 2);
                const rowButtons = rowStalls.map(stall => (
                    <Button 
                        key={stall.id} 
                        variant={stall.available ? 'success' : 'danger'} 
                        disabled={!stall.available}
                        style={{ width: '90px', height: '50px', margin: '1px'}}
                        onClick={() => {setModalShow(true); setSelectedStallId(stall.id)}}
                    >
                        {stall.id}
                    </Button>
                ));
                groupRows.push(
                    <Row key={rowIndex} className="mb-0" style={{ borderBottom: '1px solid yellow', height: 'auto', width: '185px' }}>
                        {rowButtons}
                    </Row>
                );
            }

            let marginLeft = 0;
            let marginRight = 0;

            // Calculate margin dynamically for centering based on the number of groups
            const totalMargin = 8 - totalGroups;
            marginLeft = marginRight = totalMargin * 10; // Adjust as needed

            groups.push(
                <Col key={groupIndex} style={{ marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px`, marginBottom: '20px' }}>
                    <Container>
                        {groupRows}
                    </Container>
                </Col>
            );
        }

        return groups;
    };

    return (
        <div style={{ backgroundColor: '#262625', minHeight: '100vh', padding: '20px' }}>
            <Container fluid className="d-flex align-items-start justify-content-center">
                <Row>
                    {renderParkingStalls()}
                </Row>
            </Container>
            <ReserveModal 
                show={modalShow} 
                onHide={resetModal} 
                // onHide={() => setModalShow(false)} 
                selectedStallId={selectedStallId} 
                lot_no={lot_no}
            />
        </div>
    );
}   

function ReserveModal(props) {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const lot_no = params.get("lot_no");

        const [name, setName] = React.useState("");
        const [ucid, setUcid] = React.useState("");
        const [plate, setPlate] = React.useState("");
        const [fromDate, setFromDate] = React.useState("");
        const [toDate, setToDate] = React.useState("");
        
        const localdate = new Date();
    
        const [nameError, setnameErrorMessage] = React.useState("");
        const [ucidError, setucidErrorMessage] = React.useState("");
        const [plateError, setplateErrorMessage] = React.useState("");
        const [fromDateError, setfromDateErrorMessage] = React.useState("");
        const [toDateError, settoDateErrorMessage] = React.useState("");
        const [rate, setRate] = React.useState("");

        const resetForm = () => {
            setName("");
            setUcid("");
            setPlate("");
            setFromDate("");
            setToDate("");
            setnameErrorMessage("");
            setucidErrorMessage("");
            setplateErrorMessage("");
            setfromDateErrorMessage("");
            settoDateErrorMessage("");
            // Reset any error messages or other related states
        };
    
        // Call this function on modal close
        useEffect(() => {
            if (!props.show) {
                resetForm();
            }
        }, [props.show]);
    
        let validation = false;
        
        let timePeriod = '';
        let rateInfo = '';
    
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

        let start_time = "";
        let end_time = "";
        let res_amount_due = "";
    
        if(fromDate.length != 0 && toDate.length != 0){
    
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
    
            timePeriod = ((ToMin - FromMin) + ((ToHour - FromHour) * 60));

            start_time = FromHour + ':' + FromMin;
            end_time = ToHour + ':' + ToMin;
    
            if((timePeriod/60) >= 5){
                rateInfo = 'Daily Rate: $22';
                // setRate(22);
            }
            else if ((timePeriod/60) < 0){
                rateInfo = 'Hourly Rate: Invalid';
            }
            else{
                rateInfo = 'Hourly Rate: ' + Math.ceil(timePeriod/60) + 'x CAD $5 = CAD $' + 5 * Math.ceil((timePeriod/60));
                // setRate((5 * Math.ceil((timePeriod/60))));
                res_amount_due = 5 * Math.ceil((timePeriod/60));
            }
            
        }
    
    
        const handleClick = () => {
    
            
            
            if(name.length == 0){
                setnameErrorMessage('Name is required');
                validation = false;
            }
            else{
                setnameErrorMessage('');
            }
    
            if(ucid.length == 0){
                setucidErrorMessage('UCID is required');
                validation = false;
            }
            else if(ucid.length != 8){
                setucidErrorMessage('Invalid UCID');
                validation = false;
            }
            
            else{
                setucidErrorMessage('');
            }
    
            if(plate.length == 0){
                setplateErrorMessage('License plate is required');
                validation = false;
            }
            else{
                setplateErrorMessage('');
            }
    
            if(fromDate.length == 0){
                setfromDateErrorMessage('Date is required');
                if(toDate.length == 0){
                    settoDateErrorMessage('Date is required');
                }
                else{
                    settoDateErrorMessage('');
                }
            }
            else{
                setfromDateErrorMessage('');
            
                if(toDate.length == 0){
                    settoDateErrorMessage('Date is required');
                }
                else{
                    settoDateErrorMessage('');
    
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
                    else if(FromYear == ToYear){
                        if(FromMonth == ToMonth){
                            if(FromDay == ToDay){
                                timePeriod = ((ToMin - FromMin) + ((ToHour - FromHour) * 60));
                                console.log(timePeriod);
                                if(timePeriod >= 15){
                                    validation = true;
                                    

                                }
                                else if (timePeriod >= 0){
                                    settoDateErrorMessage('Please choose longer period');
                                }
                                else{
                                    settoDateErrorMessage('Time Period is invalid');
                                }
                                
                            }
                            else{
                                settoDateErrorMessage('Time Period is invalid');
                            }
                        }
                    }
                }
            }
    
            if(validation == true){
    
                window.location.href = `/payment/?lot_no=${lot_no}&plate_no=${plate}&ucid=${ucid}&date=${FromDate}&start_time=${start_time}&end_time=${end_time}&res_amount_due=${res_amount_due}`;
            }
        }
    
        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter"> Parking Lot Reservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>
                        <div>{props.data}</div>
                    </h4>
                    <h4>Selected Stall: Lot {props.lot_no} - {props.selectedStallId}</h4>
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
                                <span class="input-group-text" id="basic-addon1"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar" format="yyyy-MM-dd, HH:mm" viewBox="0 0 16 16">
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                    </svg>
                                </span>
                                <input type='datetime-local' class="form-control" defaultValue={localdate} placeholder='01/01 00:00' onChange={(e) => setFromDate(e.target.value)} required/>
                                
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
                                
                                <span class='input-group-text' id="basic-addon2">                                
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
                        <label>{rateInfo}</label>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={handleClick}>Continue to payment</Button>
                
            </Modal.Footer>
        </Modal>
        );
}

export default DetailedLot;
