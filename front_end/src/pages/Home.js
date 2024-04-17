import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Map from '../components/Map';

function Home() {

    return (
        <>
            <div style={{ backgroundColor: '#e40c04', height: '7px' }}></div>
            <div style={{ borderTop: '60px solid #8c847c' }}></div>
            <h3 id="page-header">View UCalgary Parking</h3>
            <Map />
        </>
    );
}

export default Home;