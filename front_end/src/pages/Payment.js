import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/payment.css';
import ccMIcon from '../assets/cc-mastercard.svg';
import ccVIcon from '../assets/cc-visa.svg';
import ccAIcon from '../assets/cc-amex.svg';
import ccIcon from '../assets/credit-card-regular.svg';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Payment() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const lot_no = params.get("lot_no");
    const plate_no = params.get("plate_no");

    const [name, setName] = React.useState("");
    const [number, setNumber] = React.useState("");
    const [date, setDate] = React.useState("");
    const [cvv, setCvv] = React.useState("");

    const [nameError, setnameErrorMessage] = React.useState("");
    const [numberError, setnumberErrorMessage] = React.useState("");
    const [dateError, setdateErrorMessage] = React.useState("");
    const [cvvError, setcvvErrorMessage] = React.useState("");

    const [errorMessage, setErrorMessage] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');

    const localdate = new Date();
    const localMonth = localdate.getMonth() + 1;
    const localYear = localdate.getFullYear() % 100;

    const ccMM = Number(date.slice(0,2));
    const ccYY = Number(date.slice(-2));

    const cardType = number.slice(0,1);

    let usingCard = ccIcon;

    if(cardType == 4){
        usingCard = ccVIcon;
    }
    else if(cardType == 3){
        usingCard = ccAIcon;
    }
    else if(cardType == 5){
        usingCard = ccMIcon;
    }
    else{
        usingCard = ccIcon;
    }


    const handleClick = async (event) => {

        event.preventDefault();
        let validation = true;
        
        if(name.length == 0){
            setnameErrorMessage('Name on card is required');
            validation = false;
        }
        else{
            setnameErrorMessage('');
        }

        if(number.length == 0){
            setnumberErrorMessage('Credit card number is required');
            validation = false;
        }
        else if(number.length <= 15 || number.length >= 20){
            setnumberErrorMessage('Credit card number is invalid');
            validation = false;
        }
        else{
            setnumberErrorMessage('');

        }


        if(date.length == 0){
            setdateErrorMessage('Expiration date is required');
            validation = false;
            
        }
        else if(date.length != 4 && date.length != 5){
            setdateErrorMessage('Expiration date is invalid');
            validation = false;
        }
        // else if (expired){
        //    setdateErrorMessage('Card expired');
        // }
        else{
            setdateErrorMessage('');
            
            if(localYear > ccYY){
                setdateErrorMessage('Card expired');
            }
            else if (localYear == ccYY){
                if(localMonth > ccMM){
                    setdateErrorMessage('Card expired');
                }
                else{
                    setdateErrorMessage('');
                }
            }
            else{
                setdateErrorMessage('');
            }
            
        }

        if(cvv.length == 0){
            setcvvErrorMessage('cvv is required');
            validation = false;
        }
        else if(cvv.length != 3){
            setcvvErrorMessage('cvv is invalid');
            validation = false;
        }
        else{
            setcvvErrorMessage('');
        }
    
        if(validation == true){

            try {
                // Assuming the plate_no should be part of the endpoint query and lot_no in the body
                const response = await axios.post(`http://127.0.0.1:8000/api/vehicles-data/?plate_no=${plate_no}`, {lot_no});
                console.log(lot_no);
                if (response.status === 200) {
                    setSuccessMessage('Lot number successfully updated.');
                    setTimeout(() => {
                        setSuccessMessage('');
                        //window.location.href = '/';  // Consider using react-router for navigation instead of reloading
                    }, 3000);
                } else {
                    // This else block may never be hit because Axios throws for status codes outside the 2xx range
                    setErrorMessage('Failed to update Lot number.');
                }
            } catch (error) {
                console.error('Error updating lot number:', error);
                setErrorMessage('Failed to update Lot number. Error: ' + (error.response?.data?.message || error.message));
            }
            
        };
        
    
    }
    return (
        <div>
            {/* <h2 class="paymenttitle">Payment</h2>  */}
            <div class="paymentpage">
                <div class="row justify-content-center">
                    <div class="col-md-6 mb-3">
                        <label for="cardname">Name on card</label>
                        <input type="text" class="form-control" id="cardname" placeholder="" onChange={(e) => setName(e.target.value)} required/>
                        <small class="text-muted">Full name as displayed on card</small>
                        {nameError && <div className="error text-danger"> {nameError} </div>}
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-6 mb-3">
                        <label for="cardnumber">Credit card number</label>

                    <div class='input-group'>
                        <input type="text" class="form-control" id="cardnumber" placeholder="0000 0000 0000 0000" maxLength="19" onChange={(e) => setNumber(e.target.value)} required/>
                        <span class="input-group-text">
                            <img class="ccM" src={usingCard}/>
                        </span>
                    </div>
                        
                        {numberError && <div className="error text-danger"> {numberError} </div>}
                    </div>
                    {/* {cardType && <small className="type"> {cardType} </small>} */}
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-3 mb-3">
                        <label for="cardexp">Expiration</label>
                        <input type="text" class="form-control" id="cardexp" format={"MM/YY"} placeholder="MM/YY" maxLength="5" onChange={(e) => setDate(e.target.value)} required/>
                        {dateError && <div className="error text-danger"> {dateError} </div>}
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="cardcvv">CVC</label>
                        <input type="text" class="form-control" id="cardcvv" placeholder="000" maxLength="3" onChange={(e) => setCvv(e.target.value)} required/>
                        {cvvError && <div className="error text-danger"> {cvvError} </div>}
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-6 mb-3">
                        <button type="button" class="btn btn-danger btn-sm" onClick={handleClick}>Pay</button>     
                    </div>   
                </div>
            </div>
            </div>
    );
}

export default Payment;