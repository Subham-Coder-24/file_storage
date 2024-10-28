import { useEffect, useState } from "react";
import "../style/home.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import TableView from "./TableView.jsx";
import GridView from "./GridView.jsx";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import { Grid3x3 } from "lucide-react";
import { TableOfContents } from "lucide-react";

const Home = () => {
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const location = useLocation();

  const fetchFiles = async () => {
    setFiles([]);
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
    toast.success("File addded successfully!");
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
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
      toast.success(response.data.message || "File uploaded successfully!");
      fetchFiles();
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        {location.pathname == "/dashboard/files" && <h1>Your Files</h1>}
        {location.pathname == "/dashboard/favorites" && (
          <h1>Your Favorites Files</h1>
        )}
        {location.pathname == "/dashboard/trash" && <h1>Trash</h1>}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search your files..."
            className="search-bar"
          />
          <button className="search-button">Search</button>
        </div>
        <div className="upload-container">
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="upload-label">
              Choose File
            </label>
            <button type="submit" className="upload-button">
              Upload
            </button>
          </form>
        </div>
      </div>

      {files.length > 0 ? (
        <>
          <div className="togop">
            <div className="view-toggle">
              <div onClick={() => setViewMode("table")}>
                <Grid3x3 />
                <p>Table</p>
              </div>
              <div onClick={() => setViewMode("grid")}>
                <TableOfContents />
                <p>Grid</p>
              </div>
            </div>

            {/* Filter Options */}
            <div className="filter-section">
              <h4>Type Filter</h4>
              <select>
                <option value="all">All Files</option>
                <option value="images">Images</option>
                <option value="documents">Documents</option>
                <option value="videos">Videos</option>
              </select>
            </div>
          </div>
          <div className="file-display">
            {viewMode === "table" ? (
              <TableView files={files} fetchFiles={fetchFiles} />
            ) : (
              <GridView files={files} fetchFiles={fetchFiles} />
            )}
          </div>
        </>
      ) : (
        <p>No files..</p>
      )}
      <ToastContainer />
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
