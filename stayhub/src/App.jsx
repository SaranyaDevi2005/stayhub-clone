import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddListing from './pages/AddListing';
import ListingDetails from './pages/ListingDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccommodations from "./pages/MyAccommodations";
import EditListing from "./pages/EditListing";
import MyBookings from "./pages/MyBookings";

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/add" element={<AddListing />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/accommodations" element={<MyAccommodations />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/editlisting/:id" element={<EditListing />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
