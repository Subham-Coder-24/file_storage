import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/Home";
import Favorites from "./component/Favorites";
import Trash from "./component/Trash";

import Layout from "./component/Layout";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard/files" element={<Home />} />
          <Route path="/dashboard/favorites" element={<Favorites />} />
          <Route path="/dashboard/trash" element={<Trash />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
