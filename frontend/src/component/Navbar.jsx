// Navbar.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/navbar.css";
import axios from "axios";
const Navbar = () => {
  const [organizations, setOrganizations] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/organization/get"
        ); // Adjust the API URL as needed
        setOrganizations(response.data); // Set organizations to the response data
      } catch (error) {
        console.error("Failed to fetch organizations", error); // Improved error logging
      }
    };
    fetchOrganizations();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
        <li>
          <button onClick={toggleDropdown} className="dropdown-button">
            Organizations
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-list">
              {organizations.map((org) => (
                <li key={org.id}>
                  <Link to={`/organizations/${org.id}`}>{org.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
