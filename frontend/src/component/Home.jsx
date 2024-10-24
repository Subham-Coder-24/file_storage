import { useEffect, useState } from "react";
import "../style/home.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import TableView from "./TableView.jsx";
import GridView from "./GridView.jsx";
const Home = () => {
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]); // Store files from backend
  // Fetch user's files when the component mounts
  const location = useLocation();

  const fetchFiles = async () => {
    try {
      if (location.pathname == "/dashboard/files") {
        const response = await axios.get("http://localhost:4000/api/files/get");
        setFiles(response.data.files || []);
      }
      if (location.pathname == "/dashboard/favorites") {
        const response = await axios.get(
          "http://localhost:4000/api/files/favorite"
        ); // Assuming user ID is 1
        setFiles(response.data.files || []);
      }
      if (location.pathname == "/dashboard/trash") {
        const response = await axios.get(
          "http://localhost:4000/api/files/delete"
        ); // Assuming user ID is 1
        setFiles(response.data.files || []);
      }
    } catch (error) {
      console.error("Error fetching files", error);
    }
  };
  useEffect(() => {
    fetchFiles();
  }, [location.pathname]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    console.log(e.target.files); // Handle file upload
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message || "File uploaded successfully!");
    } catch (error) {
      setMessage("Failed to upload file");
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>Your Files</h1>

        <div>
          <input
            type="text"
            placeholder="Search your files..."
            className="search-bar"
          />
          <button>Submit</button>
        </div>

        {/* <input
          type="file"
          onChange={handleFileUpload}
          className="file-upload"
        /> */}
        <div>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
          </form>
          <p>{message}</p>
        </div>
      </div>
      <div className="togop">
        {/* View Mode Toggle */}
        <div className="view-toggle">
          <button onClick={() => setViewMode("table")}>Table View</button>
          <button onClick={() => setViewMode("grid")}>Grid View</button>
        </div>

        {/* Filter Options */}
        <div className="filter-section">
          <h3>Filter Files</h3>
          <select>
            <option value="all">All Files</option>
            <option value="images">Images</option>
            <option value="documents">Documents</option>
            <option value="videos">Videos</option>
          </select>
        </div>
      </div>

      {/* Display Files */}
      <div className="file-display">
        {viewMode === "table" ? (
          <TableView files={files} />
        ) : (
          <GridView files={files} />
        )}
      </div>
    </div>
  );
};
export default Home;

const getFileTypeName = (mimeType) => {
  const typeMapping = {
    "application/pdf": "PDF",
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/gif": "GIF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPT",
    "application/vnd.ms-excel": "Excel",
    "application/zip": "ZIP",
    "video/mp4": "MP4 Video",
    // Add more mappings as needed
  };

  return typeMapping[mimeType] || "Unknown File Type"; // Default to 'Unknown File Type' if not found
};
