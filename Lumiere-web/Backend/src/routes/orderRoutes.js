// src/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  markOrderPaid,
  trackOrder,
  getMinPickupDate,
} from "../controllers/orderController.js";
import { protect, optionalAuth, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", optionalAuth, createOrder); // Website orders don't need auth
router.get("/track/:orderNumber", trackOrder); // Customer order tracking
router.post("/min-pickup-date", getMinPickupDate); // Calculate min pickup date

// Protected routes (workers)
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);
router.patch("/:id/status", protect, updateOrderStatus);
router.patch("/:id/pay", protect, authorize("admin", "barista"), markOrderPaid);

export default router;

