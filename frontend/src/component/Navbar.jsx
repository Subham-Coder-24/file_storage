// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "../style/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>My App</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
