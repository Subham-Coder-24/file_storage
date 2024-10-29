import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Register from "./component/Register";

import Layout from "./component/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
function App() {
  const [user, setUser] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      // "Content-Type": "multipart/form-data",
      "Content-Type": "application/json",
    };
  };
  axios.interceptors.request.use(
    (config) => {
      config.headers = {
        ...config.headers,
        ...getAuthHeader(),
      };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={user ? <Layout /> : <Login setUser={setUser} />}>
          <Route path="/dashboard/files" element={<Home />} />
          <Route path="/dashboard/favorites" element={<Home />} />
          <Route path="/dashboard/trash" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
