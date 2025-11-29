// src/models/User.js
import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't include password in queries by default
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "pastry_chef", "barista"],
      default: "barista",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  // Simple hash using crypto (for production, use bcrypt)
  this.password = crypto
    .createHash("sha256")
    .update(this.password)
    .digest("hex");
  next();
});

// Compare password method
UserSchema.methods.comparePassword = function (candidatePassword) {
  const hash = crypto
    .createHash("sha256")
    .update(candidatePassword)
    .digest("hex");
  return hash === this.password;
};

// Get full name virtual
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", UserSchema);

