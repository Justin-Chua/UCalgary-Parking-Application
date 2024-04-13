import React, { useState, useEffect } from 'react';
import marker from '../assets/map-marker-blue.png';
import * as Icons from 'react-bootstrap-icons';
import * as Bootstrap from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
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

    const lot_no = 10;
    // const [lot_no,setLotNo] = useState();
    const [error, setError] = useState(null);

    //setLotNo(10);

    const fetchLotInfo = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/map/?lot_no=${lot_no}`);
            const lotData = response.data;
            const lotData2 = Object.values(lotData[0]);
            console.log('Response data:', lotData2[0]);
            console.log('Response data:', lotData2[4]);

            window.location.href = `/detailedlot?lot_no=${lotData2[0]}&capacity=${lotData2[3]}&occupied=${lotData2[4]}`;
            
        } catch (error){
            console.error("Error fetching lot data:", error);
            setError('Lot not found');
        }
        
        
    
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
                            <button onClick={fetchLotInfo} >Detailed View</button>
                            {/* <p>test: {lotNo}</p> */}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </Bootstrap.Container>
    );
};

export default Map;