import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Ticket from './pages/Ticket';
import Permit from './pages/Permit';
import Reservation from './pages/Reservation';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './styles/card.css';
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
