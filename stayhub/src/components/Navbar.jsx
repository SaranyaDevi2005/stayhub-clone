import React from "react";
import { Link } from "react-router-dom";
import UserMenu from './UserMenu'; // adjust path as needed


function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <nav className="navbar">
      <div className="logo">StayHub</div>

      <div className="nav-center">
        <input
          type="text"
          className="navbar-search"
          placeholder="Search places..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/add">Add Listing</Link>
        <Link to="/accommodations">My Accommodations</Link>
        <Link to="/bookings">My Bookings</Link>
        <UserMenu />
      </div>
    </nav>
  );
}

export default Navbar;
