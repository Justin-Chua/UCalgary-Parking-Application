import React from 'react';
import marker from '../assets/map-marker-blue.png';
import * as Bootstrap from 'react-bootstrap';
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
    return (
        <Bootstrap.Container className="d-flex justify-content-center align-items-center">
            <MapContainer center={[51.07542976812476, -114.1353732868445]} zoom={15} style={{ height: '450px', width: '40vw' }}>
                <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker icon={ marker_icon } position={[51.08024398834294, -114.1389369805266]}>
                    <Popup>
                        <div>
                            <h3>Lot 10</h3>
                            <p>Capacity: 250</p>
                            <p>Available Spaces: Yes</p>
                            <button>Detailed View</button>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </Bootstrap.Container>
    );
};

export default Map;