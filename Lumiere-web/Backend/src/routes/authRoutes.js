// src/routes/authRoutes.js
import express from "express";
import {
  signup,
  login,
  getMe,
  createSignupKey,
  getSignupKeys,
  deactivateSignupKey,
  getWorkers,
  toggleWorkerActive,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);

// Admin only routes
router.post("/signup-keys", protect, adminOnly, createSignupKey);
router.get("/signup-keys", protect, adminOnly, getSignupKeys);
router.delete("/signup-keys/:id", protect, adminOnly, deactivateSignupKey);
router.get("/workers", protect, adminOnly, getWorkers);
router.patch("/workers/:id/toggle-active", protect, adminOnly, toggleWorkerActive);

export default router;

