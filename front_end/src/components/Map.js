import React, { useState, useEffect } from 'react';
import marker from '../assets/map-marker-blue.png';
import axios from 'axios';
import * as Bootstrap from 'react-bootstrap';
// Interactive map
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function Map() {
    const [parkingLots, setParkingLots] = useState([]);
    const marker_icon = new L.icon({
        iconUrl: marker,
        iconSize: [20, null],
        iconAnchor: [10, 20]
    });
    const fetchParkingLots = async () => {
        try {
            const response = await axios.get('https://ucalgary-parking-application-production.up.railway.app/api/map/');
            setParkingLots(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchParkingLots();
    }, []);

    const fetchLotInfo = async (event, lotNo) => {
        event.preventDefault();
        try{
            const response = await axios.get(`https://ucalgary-parking-application-production.up.railway.app/api/map-popup/?lot_no=${lotNo}`);
            const lotData = response.data;
            const lotData2 = Object.values(lotData[0]);
            console.log('Response data:', lotData2[0]);
            console.log('Response data:', lotData2[4]);

            window.location.href = `/detailedlot?lot_no=${lotData2[0]}&capacity=${lotData2[3]}&occupied=${lotData2[4]}`;
        } catch (error){
            console.log(error);
        }
    }

    return (
        <Bootstrap.Container className="d-flex justify-content-center align-items-center">
            <MapContainer center={[51.07897866059423, -114.13230193907552]} zoom={15} style={{ height: '450px', width: '40vw' }}>
                <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {parkingLots.map(lot => (
                    <Marker key={ lot.lot_no } icon={ marker_icon } position={[lot.latitude, lot.longitude]}>
                        <Popup>
                            <div>
                                <h3>Lot { lot.lot_no }</h3>
                                <p>Capacity: { lot.capacity }</p>
                                <p>Available Spaces: { lot.capacity - lot.occupied_spaces > 0 ? 'Yes' : 'No' }</p>
                                <button onClick={(event) => fetchLotInfo(event, lot.lot_no)}>Detailed View</button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Bootstrap.Container>
    );
};

export default Map;