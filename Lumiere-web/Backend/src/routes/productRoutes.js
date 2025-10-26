// src/routes/productRoutes.js
import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = Router();

// Public
router.get("/", listProducts);
router.get("/:idOrSlug", getProduct);

// Dev/admin (disable in production)
const allowWrite = process.env.NODE_ENV !== "production";
router.post("/", guardWrite, createProduct);
router.put("/:id", guardWrite, updateProduct);
router.delete("/:id", guardWrite, deleteProduct);

function guardWrite(_req, res, next) {
  if (!allowWrite) return res.status(403).json({ message: "Writes disabled in production" });
  next();
}

export default router;