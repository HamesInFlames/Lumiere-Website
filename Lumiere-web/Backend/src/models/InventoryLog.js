// src/models/InventoryLog.js
// Tracks all inventory changes for audit trail
import mongoose from "mongoose";

const InventoryLogSchema = new mongoose.Schema(
  {
    inventoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
    },
    action: {
      type: String,
      enum: ["add", "remove", "adjust", "restock", "end_of_day"],
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
      // Positive for additions, negative for removals
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for querying logs by item and date
InventoryLogSchema.index({ inventoryItem: 1, createdAt: -1 });
InventoryLogSchema.index({ performedBy: 1, createdAt: -1 });

export default mongoose.model("InventoryLog", InventoryLogSchema);

