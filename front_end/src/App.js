import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path = "/" element = { <Home /> } />
          <Route path = "/login" element = { <Login /> } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
