// controllers/fileController.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

// Initialize Prisma Client
const prisma = new PrismaClient();
// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Store files with unique names
  },
});

// Set up Multer without any file filter to accept all file types
const upload = multer({ storage: storage });

// Cloudinary config
cloudinary.config({
  cloud_name: "drkfcvoog",
  api_key: "815694767479514",
  api_secret: "9Tl23hnR0Mj1mIKm6bs5fyhvyXY", // Make sure to store this securely, not in source code
});

// Controller to handle file upload
const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    // Check if a file was uploaded
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "storage", // Optional: organize your files in a folder
      resource_type: "raw", // Use 'raw' for PDF uploads
    });

    console.log(result);

    // Delete file from local server after uploading to Cloudinary
    // fs.unlinkSync(file.path);

    // Save file details to the database
    // const savedFile = await prisma.file.create({
    //   data: {
    //     fileName: file.originalname,
    //     fileUrl: result.secure_url,
    //     fileType: file.mimetype,
    //     ownerId: 1,
    //   },
    // });

    res
      .status(200)
      .json({ message: "File uploaded successfully", file: "savedFile" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

// Export the upload middleware and the uploadFile controller
export { upload, uploadFile };
