// src/routes/inventoryRoutes.js
import express from "express";
import {
  getInventory,
  createInventoryItem,
  updateQuantity,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryLogs,
  getLowStockAlerts,
  endOfDayUpdate,
} from "../controllers/inventoryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get inventory and alerts
router.get("/", getInventory);
router.get("/alerts", getLowStockAlerts);

// Create and manage inventory items
router.post("/", createInventoryItem);
router.put("/:id", updateInventoryItem);
router.delete("/:id", adminOnly, deleteInventoryItem);

// Quantity updates
router.patch("/:id/quantity", updateQuantity);
router.post("/end-of-day", endOfDayUpdate);

// Logs
router.get("/:id/logs", getInventoryLogs);

export default router;

