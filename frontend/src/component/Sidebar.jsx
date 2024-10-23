import { Link } from "react-router-dom";
import "../style/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/dashboard/files">All File</Link>
        </li>
        <li>
          <Link to="/dashboard/favorites">Favorites</Link>
        </li>
        <li>
          <Link to="/dashboard/trash">Trash</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
