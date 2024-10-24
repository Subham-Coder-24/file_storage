import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: "drkfcvoog",
  api_key: "815694767479514",
  api_secret: "9Tl23hnR0Mj1mIKm6bs5fyhvyXY",
});

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "storage",
      resource_type: "raw",
    });

    // fs.unlinkSync(file.path);

    const savedFile = await prisma.file.create({
      data: {
        fileName: file.originalname,
        fileUrl: result.secure_url,
        fileType: file.mimetype,
        ownerId: req.user.id,
      },
    });

    res
      .status(200)
      .json({ message: "File uploaded successfully", file: savedFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

const getUserFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const userFiles = await prisma.file.findMany({
      where: {
        ownerId: parseInt(userId),
        isDeleted: false, // Exclude files marked as deleted
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!userFiles || userFiles.length === 0) {
      return res.status(404).json({ message: "No files found for this user." });
    }

    res.status(200).json({
      message: "Files retrieved successfully",
      files: userFiles,
    });
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

const favoriteFile = async (req, res) => {
  const { id } = req.params; // Get the file ID from request parameters

  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) },
    });

    // Check if the file exists
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if the file belongs to the logged-in user
    if (file.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Toggle the isFavorite field
    const updatedFile = await prisma.file.update({
      where: { id: parseInt(id) },
      data: {
        isFavorite: !file.isFavorite, // Toggle favorite status
      },
    });

    res.status(200).json({
      message: `File has been ${
        updatedFile.isFavorite ? "favorited" : "unfavorited"
      }`,
      file: updatedFile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update favorite status" });
  }
};

const deleteFile = async (req, res) => {
  const { id } = req.params; // Get the file ID from request parameters

  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) },
    });

    // Check if the file exists
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if the file belongs to the logged-in user
    if (file.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    console.log("ok");

    // Mark the file as deleted (move to trash)
    const updatedFile = await prisma.file.update({
      where: { id: parseInt(id) },
      data: {
        isDeleted: true,
        isFavorite: false,
      },
    });

    res.status(200).json({
      message: "File moved to trash successfully",
      file: updatedFile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};
const getDeletedFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedFiles = await prisma.file.findMany({
      where: {
        ownerId: parseInt(userId),
        isDeleted: true, // Fetch files marked as deleted
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!deletedFiles || deletedFiles.length === 0) {
      return res.status(404).json({ message: "No deleted files found." });
    }

    res.status(200).json({
      message: "Deleted files retrieved successfully",
      files: deletedFiles,
    });
  } catch (error) {
    console.error("Error fetching deleted files:", error);
    res.status(500).json({ error: "Failed to fetch deleted files" });
  }
};
const getFavoriteFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const favoriteFiles = await prisma.file.findMany({
      where: {
        ownerId: parseInt(userId),
        isFavorite: true, // Fetch files marked as favorite
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!favoriteFiles || favoriteFiles.length === 0) {
      return res.status(404).json({ message: "No favorite files found." });
    }

    res.status(200).json({
      message: "Favorite files retrieved successfully",
      files: favoriteFiles,
    });
  } catch (error) {
    console.error("Error fetching favorite files:", error);
    res.status(500).json({ error: "Failed to fetch favorite files" });
  }
};

export {
  upload,
  uploadFile,
  getUserFiles,
  favoriteFile,
  deleteFile,
  getDeletedFiles,
  getFavoriteFiles,
};
