// src/routes/contactRoutes.js
import express from "express";
import { body, validationResult } from "express-validator";
import { submitContact } from "../controllers/contactController.js";

const router = express.Router();

// Input validation & sanitization middleware
const contactValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters")
    .escape(), // Prevent XSS

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(), // Sanitize email

  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .isMobilePhone("any").withMessage("Invalid phone number"),

  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 5, max: 2000 }).withMessage("Message must be 5-2000 characters")
    .escape(), // Prevent XSS
];

// Validation error handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

router.post("/", contactValidation, handleValidation, submitContact);

export default router;
