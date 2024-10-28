// routes/fileRoutes.js
import express from "express";
import {
  getUserFiles,
  upload,
  uploadFile,
  favoriteFile,
  deleteFile,
  getDeletedFiles,
  getFavoriteFiles,
  permanentDelete,
  restoreFile,
} from "../controller/fileController.js"; // Ensure the path is correct
import { isAuthenticateduser } from "../middleware/auth.js";

const router = express.Router();

// Route for uploading a file
router.post("/upload", isAuthenticateduser, upload.single("file"), uploadFile);
router.get("/get", isAuthenticateduser, getUserFiles);
router.get("/favorite/:id", isAuthenticateduser, favoriteFile);
router.get("/delete/:id", isAuthenticateduser, deleteFile);
router.get("/permanent/delete/:id", isAuthenticateduser, permanentDelete);
router.get("/restore/:id", isAuthenticateduser, restoreFile);

router.get("/favorite", isAuthenticateduser, getFavoriteFiles);
router.get("/delete", isAuthenticateduser, getDeletedFiles);

export default router;
