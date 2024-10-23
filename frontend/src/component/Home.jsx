import { useState } from "react";
import "../style/home.css";
import axios from "axios";

const Home = () => {
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

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
        {viewMode === "table" ? <TableView /> : <GridView />}
      </div>
    </div>
  );
};

export default Home;

const TableView = () => {
  const files = [
    { name: "File1.jpg", type: "image", size: "2 MB" },
    { name: "Document1.pdf", type: "document", size: "500 KB" },
    { name: "Video1.mp4", type: "video", size: "10 MB" },
    // Add more files here
  ];

  return (
    <table className="file-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, index) => (
          <tr key={index}>
            <td>{file.name}</td>
            <td>{file.type}</td>
            <td>{file.size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
const GridView = () => {
  const files = [
    { name: "File1.jpg", type: "image", size: "2 MB" },
    { name: "Document1.pdf", type: "document", size: "500 KB" },
    { name: "Video1.mp4", type: "video", size: "10 MB" },
    // Add more files here
  ];

  return (
    <div className="file-grid">
      {files.map((file, index) => (
        <div className="file-card" key={index}>
          <h4>{file.name}</h4>
          <p>Type: {file.type}</p>
          <p>Size: {file.size}</p>
        </div>
      ))}
    </div>
  );
};
