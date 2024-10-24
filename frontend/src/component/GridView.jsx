import axios from "axios";
import { useState } from "react";

const GridView = ({ files }) => {
  const [loading, setLoading] = useState(false);

  const handleFavorite = async (fileId) => {
    setLoading(true);
    try {
      await axios.get(`http://localhost:4000/api/files/favorite/${fileId}`);
      alert("File favorited successfully!");
      // refreshFiles(); // Call to refresh files after action
    } catch (error) {
      console.error("Error favoriting file:", error);
      alert("Failed to favorite file.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (confirmDelete) {
      setLoading(true);
      try {
        await axios.get(`http://localhost:4000/api/files/delete/${fileId}`);
        alert("File moved to trash successfully!");
        // refreshFiles(); // Call to refresh files after action
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="file-grid">
      {files.map((file, index) => (
        <div className="file-card" key={index}>
          <h4>{file.fileName}</h4>
          <p>Type: {getFileTypeName(file.fileType)}</p>
          <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
            View File
          </a>
          <div className="action-dots">
            <button onClick={() => handleFavorite(file.id)} disabled={loading}>
              {file.isFavorite ? "★" : "☆"} {/* Toggle star icon */}
            </button>
            <button onClick={() => handleDelete(file.id)} disabled={loading}>
              delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default GridView;
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
