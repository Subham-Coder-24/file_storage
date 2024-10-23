// routes/fileRoutes.js
import express from "express";
import { upload, uploadFile } from "../controller/fileController.js"; // Ensure the path is correct

const router = express.Router();

// Route for uploading a file
router.post("/upload", upload.single("file"), uploadFile);

export default router;
