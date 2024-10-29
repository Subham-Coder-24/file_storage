// routes/fileRoutes.js
import express from "express";
import {
  createWorkspace,
  getUserWorkspaces,
  getOrganizationFiles,
} from "../controller/organizationController.js"; // Ensure the path is correct
import { isAuthenticateduser } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", isAuthenticateduser, createWorkspace);
router.get("/get", isAuthenticateduser, getUserWorkspaces);
router.get(
  "/getfiles/:organizationId",
  isAuthenticateduser,
  getOrganizationFiles
);

export default router;
