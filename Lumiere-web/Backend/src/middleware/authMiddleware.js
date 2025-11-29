// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "lumiere-patisserie-secret-key-change-in-production";

// Protect routes - require authentication
export async function protect(req, res, next) {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Not authorized, no token",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        ok: false,
        message: "Account is deactivated",
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        ok: false,
        message: "Invalid token",
      });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        ok: false,
        message: "Token expired",
      });
    }
    return res.status(401).json({
      ok: false,
      message: "Not authorized",
    });
  }
}

// Optional authentication - set user if token provided
export async function optionalAuth(req, res, next) {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (user && user.isActive) {
        req.user = {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      }
    }

    next();
  } catch {
    // Continue without user
    next();
  }
}

// Restrict to specific roles
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: "Not authorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
}

// Admin only
export function adminOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      ok: false,
      message: "Not authorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      ok: false,
      message: "Admin access required",
    });
  }

  next();
}

// Pastry chef or admin
export function pastryChefOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      ok: false,
      message: "Not authorized",
    });
  }

  if (!["admin", "pastry_chef"].includes(req.user.role)) {
    return res.status(403).json({
      ok: false,
      message: "Pastry chef or admin access required",
    });
  }

  next();
}

// Barista or admin
export function baristaOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      ok: false,
      message: "Not authorized",
    });
  }

  if (!["admin", "barista"].includes(req.user.role)) {
    return res.status(403).json({
      ok: false,
      message: "Barista or admin access required",
    });
  }

  next();
}

