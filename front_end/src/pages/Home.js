import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Map from '../components/Map';

function Home() {

    return (
        <>
            <h3 id="page-header">View UCalgary Parking</h3>
            <Map />
        </>
    );
}

export default Home;