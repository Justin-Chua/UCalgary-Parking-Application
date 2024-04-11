import React, { useState, useEffect } from 'react';
import marker from '../assets/map-marker-blue.png';
import * as Icons from 'react-bootstrap-icons';
import * as Bootstrap from 'react-bootstrap';
import axios from 'axios';
// Interactive map
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

    
    

    



const Map = () => {

    const marker_icon = new L.icon({
        iconUrl: marker,
        iconSize: [20, null],
        iconAnchor: [10, 20]
    })



    const [parkinglotData, setParkinglotData] = useState(null);
    const [lotNo,setLotNo] = useState();
    const [error, setError] = useState(null);
    const [totalStalls, setTotalStalls] = useState();

    useEffect(() => {
        const fetchParkingLotInfo = async () => {
            try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }
    
            const parkinglotResponse = await axios.get('http://127.0.0.1:8000/api/detailedlot/', {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                }
            });
    
    
            setParkinglotData(parkinglotResponse.data);
            } catch (error) {
            console.error('Error fetching parkinglot information:', error);
            setError('Error fetching parkinglot information. Please try again later.');
            }
    
            
            
        };
    
        fetchParkingLotInfo();
    }, []);


    const handleClick = () => {
        setLotNo(10);
        window.location.href = '/detailedlot';
    }

    return (
        <Bootstrap.Container className="d-flex justify-content-center align-items-center">
            <MapContainer center={[51.07542976812476, -114.1353732868445]} zoom={15} style={{ height: '450px', width: '40vw' }}>
                <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker icon={ marker_icon } position={[51.08024398834294, -114.1389369805266] } >
                    <Popup>
                        <div>
                            <h3>Lot 10</h3>
                            <p>Capacity: 120</p>
                            <p>Available Spaces: Yes</p>
                            <button onClick={handleClick} >Detailed View</button>
                            <p>test: {lotNo}</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </Bootstrap.Container>
    );
};

export default Map;