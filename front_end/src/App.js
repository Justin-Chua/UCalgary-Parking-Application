import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Ticket from './pages/Ticket';
import Permit from './pages/Permit';
import Reservation from './pages/Reservation';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Editprofile from './pages/Editprofile';
import DetailedLot from './pages/Detailedlot';
function App() {

  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path = "/" element = { <Home /> } />
          <Route path = "/ticket" element = { <Ticket /> } />
          <Route path = "/permit" element = { <Permit /> } />
          <Route path = "/reservation" element = { <Reservation /> } />
          <Route path = "/login" element = { <Login /> } />
          <Route path = "/profile" element = { <Profile /> } />
          <Route path = "/signup" element = { <Signup /> } />
          <Route path = "/editprofile" element = { <Editprofile /> } />
          <Route path = "/detailedlot" element = { <DetailedLot /> } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
