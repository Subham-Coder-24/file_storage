import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../style/layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="content-area">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
