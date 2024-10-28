import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
const TableView = ({ files, fetchFiles }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [showActions, setShowActions] = useState(false);
  const [selectedID, setShowselectedID] = useState();

  const toggleActions = (id) => {
    setShowselectedID();
    setShowActions((prev) => !prev); // Toggle dropdown visibility
    setShowselectedID(id);
  };
  const handleFavorite = async (fileId) => {
    setLoading(true);
    try {
      await axios.get(`http://localhost:4000/api/files/favorite/${fileId}`);
      alert("File favorited successfully!");
      fetchFiles();
    } catch (error) {
      console.error("Error favoriting file:", error);
      alert("Failed to favorite file.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want move to trash this file?"
    );
    if (confirmDelete) {
      setLoading(true);
      try {
        await axios.get(`http://localhost:4000/api/files/delete/${fileId}`);
        alert("File moved to trash successfully!");
        // refreshFiles(); // Call to refresh files after action
        fetchFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file.");
      } finally {
        setLoading(false);
      }
    }
  };
  const handlePermanentDelete = async (fileId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want permanent delete this file?"
    );
    if (confirmDelete) {
      setLoading(true);
      try {
        await axios.get(
          `http://localhost:4000/api/files/permanent/delete/${fileId}`
        );
        alert("File moved to trash successfully!");
        fetchFiles();
        // refreshFiles(); // Call to refresh files after action
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file.");
      } finally {
        setLoading(false);
      }
    }
  };
  const handleRestore = async (fileId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want restore this file?"
    );
    if (confirmDelete) {
      setLoading(true);
      try {
        await axios.get(`http://localhost:4000/api/files/restore/${fileId}`);
        alert("File moved to trash successfully!");
        fetchFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <table className="file-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>URL</th>
          <th>Action</th> {/* New Action Column */}
        </tr>
      </thead>
      <tbody>
        {files.map((file, index) => (
          <tr key={index}>
            <td>{file.fileName}</td>
            <td>{getFileTypeName(file.fileType)}</td>
            <td>
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                View File
              </a>
            </td>
            <td>
              <div className="action-dots">
                {/* Three dots button to toggle actions */}
                <button
                  onClick={() => toggleActions(file.id)}
                  className="three-dots"
                >
                  ⋮
                </button>

                {/* Actions dropdown - show if `showActions` is true */}
                {showActions && selectedID == file.id && (
                  <div className="dropdown-actions">
                    {location.pathname !== "/dashboard/trash" && (
                      <button
                        onClick={() => handleFavorite(file.id)}
                        disabled={loading}
                      >
                        {file.isFavorite ? "★" : "☆"} {/* Toggle star icon */}
                      </button>
                    )}

                    {location.pathname === "/dashboard/trash" ? (
                      <>
                        <button
                          onClick={() => handlePermanentDelete(file.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleRestore(file.id)}
                          disabled={loading}
                        >
                          Restore
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDelete(file.id)}
                        disabled={loading}
                      >
                        Trash
                      </button>
                    )}
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableView;
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
