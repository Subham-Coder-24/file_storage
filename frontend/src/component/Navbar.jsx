// Navbar.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/navbar.css";
import axios from "axios";
const Navbar = () => {
  const [organizations, setOrganizations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const [newOrgName, setNewOrgName] = useState(""); // For storing new organization name

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/organization/get"
      ); // Adjust the API URL as needed
      setOrganizations(response.data.workspaces || []); // Set organizations to the response data
    } catch (error) {
      console.error("Failed to fetch organizations", error); // Improved error logging
    }
  };
  useEffect(() => {
    fetchOrganizations();
    console.log(organizations);
  }, []);

  const handleCreateOrganization = async () => {
    try {
      await axios.post("http://localhost:4000/api/organization/create", {
        name: newOrgName,
      });
      setIsModalOpen(false); // Close modal on success
      setNewOrgName("");
      fetchOrganizations();
    } catch (error) {
      console.error("Failed to create organization", error);
    }
  };

  const handleOrganizationSelect = (event) => {
    const selectedOrgId = event.target.value;
    if (selectedOrgId === "create") {
      setIsModalOpen(true);
    } else if (selectedOrgId == "personal") {
      localStorage.setItem("selectedOrganizationId", "personal");
    } else {
      localStorage.setItem("selectedOrganizationId", selectedOrgId);
    }
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
          <select
            className="organization-select"
            onChange={handleOrganizationSelect}
          >
            <option value="personal">Personal Workspace</option>
            <option value="create">+ Create Organization</option>
            {organizations.length &&
              organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
          </select>
        </li>
      </ul>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Organization</h3>
            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Organization Name"
            />
            <button onClick={handleCreateOrganization}>Create</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
