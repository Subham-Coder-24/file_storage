import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controller/userController.js";
import { isAuthenticateduser } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", isAuthenticateduser, getUserProfile);

export default router;
