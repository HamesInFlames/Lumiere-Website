// src/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import SignupKey from "../models/SignupKey.js";

const JWT_SECRET = process.env.JWT_SECRET || "lumiere-patisserie-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// @desc    Register new worker
// @route   POST /api/auth/signup
// @access  Public (but requires signup key)
export async function signup(req, res, next) {
  try {
    const { email, password, firstName, lastName, role, signupKey } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role || !signupKey) {
      return res.status(400).json({
        ok: false,
        message: "All fields are required: email, password, firstName, lastName, role, signupKey",
      });
    }

    // Validate role
    if (!["pastry_chef", "barista"].includes(role)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid role. Must be pastry_chef or barista",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        ok: false,
        message: "Email already registered",
      });
    }

    // Validate signup key
    const keyDoc = await SignupKey.findOne({ key: signupKey, role });
    if (!keyDoc) {
      return res.status(400).json({
        ok: false,
        message: "Invalid signup key for this role",
      });
    }

    if (!keyDoc.isValid()) {
      return res.status(400).json({
        ok: false,
        message: "Signup key is expired or has reached maximum usage",
      });
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role,
    });

    // Increment signup key usage
    keyDoc.usageCount += 1;
    await keyDoc.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      ok: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Login worker
// @route   POST /api/auth/login
// @access  Public
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required",
      });
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        ok: false,
        message: "Account is deactivated. Contact admin.",
      });
    }

    // Compare password
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        ok: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.json({
      ok: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    res.json({
      ok: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Create signup key (admin only)
// @route   POST /api/auth/signup-keys
// @access  Private (Admin)
export async function createSignupKey(req, res, next) {
  try {
    const { key, role, description, maxUsage, expiresAt } = req.body;

    if (!key || !role) {
      return res.status(400).json({
        ok: false,
        message: "Key and role are required",
      });
    }

    if (!["pastry_chef", "barista"].includes(role)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid role",
      });
    }

    // Check if key already exists
    const existing = await SignupKey.findOne({ key });
    if (existing) {
      return res.status(400).json({
        ok: false,
        message: "This key already exists",
      });
    }

    const signupKey = await SignupKey.create({
      key,
      role,
      description: description || "",
      maxUsage: maxUsage || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: req.user.id,
    });

    res.status(201).json({
      ok: true,
      signupKey: {
        id: signupKey._id,
        key: signupKey.key,
        role: signupKey.role,
        description: signupKey.description,
        isActive: signupKey.isActive,
        maxUsage: signupKey.maxUsage,
        usageCount: signupKey.usageCount,
        expiresAt: signupKey.expiresAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get all signup keys (admin only)
// @route   GET /api/auth/signup-keys
// @access  Private (Admin)
export async function getSignupKeys(req, res, next) {
  try {
    const keys = await SignupKey.find().populate("createdBy", "firstName lastName").sort({ createdAt: -1 });

    res.json({
      ok: true,
      keys: keys.map((k) => ({
        id: k._id,
        key: k.key,
        role: k.role,
        description: k.description,
        isActive: k.isActive,
        isValid: k.isValid(),
        maxUsage: k.maxUsage,
        usageCount: k.usageCount,
        expiresAt: k.expiresAt,
        createdBy: k.createdBy ? `${k.createdBy.firstName} ${k.createdBy.lastName}` : null,
        createdAt: k.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Deactivate signup key (admin only)
// @route   DELETE /api/auth/signup-keys/:id
// @access  Private (Admin)
export async function deactivateSignupKey(req, res, next) {
  try {
    const key = await SignupKey.findById(req.params.id);

    if (!key) {
      return res.status(404).json({
        ok: false,
        message: "Signup key not found",
      });
    }

    key.isActive = false;
    await key.save();

    res.json({
      ok: true,
      message: "Signup key deactivated",
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get all workers (admin only)
// @route   GET /api/auth/workers
// @access  Private (Admin)
export async function getWorkers(req, res, next) {
  try {
    const workers = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 });

    res.json({
      ok: true,
      workers: workers.map((w) => ({
        id: w._id,
        email: w.email,
        firstName: w.firstName,
        lastName: w.lastName,
        fullName: w.fullName,
        role: w.role,
        isActive: w.isActive,
        lastLogin: w.lastLogin,
        createdAt: w.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Toggle worker active status (admin only)
// @route   PATCH /api/auth/workers/:id/toggle-active
// @access  Private (Admin)
export async function toggleWorkerActive(req, res, next) {
  try {
    const worker = await User.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        ok: false,
        message: "Worker not found",
      });
    }

    if (worker.role === "admin") {
      return res.status(400).json({
        ok: false,
        message: "Cannot modify admin accounts",
      });
    }

    worker.isActive = !worker.isActive;
    await worker.save();

    res.json({
      ok: true,
      message: `Worker ${worker.isActive ? "activated" : "deactivated"}`,
      isActive: worker.isActive,
    });
  } catch (err) {
    next(err);
  }
}

