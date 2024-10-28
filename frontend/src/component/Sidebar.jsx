import { Link, NavLink } from "react-router-dom";
import "../style/sidebar.css";
import { File } from "lucide-react";
import { Star } from "lucide-react";
import { Trash2 } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink
            to="/dashboard/files"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <File />
            <p>All Files</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/favorites"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Star />
            <p>Favorites</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/trash"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Trash2 />
            <p>Trash</p>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
