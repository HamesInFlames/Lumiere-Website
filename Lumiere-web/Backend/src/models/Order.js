// src/models/Order.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  customMessage: {
    type: String,
    default: "",
    maxLength: 200,
  },
  includeCandle: {
    type: Boolean,
    default: false,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
      // Not required - auto-generated in pre-save hook
    },
    // Customer info
    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    // Order items
    items: [OrderItemSchema],
    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    // Order source and payment
    orderSource: {
      type: String,
      enum: ["website", "in_person"],
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "pending"],
      default: "pending",
    },
    // Pickup scheduling
    pickupDate: {
      type: Date,
      required: true,
      index: true,
    },
    pickupTime: {
      type: String, // e.g., "10:00 AM", "2:30 PM"
      required: true,
    },
    // Order status tracking
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "ready", "picked_up", "cancelled"],
      default: "pending",
      index: true,
    },
    // Fulfillment tracking by pastry chef
    fulfillmentProgress: {
      startedAt: Date,
      completedAt: Date,
      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    // Pickup tracking by barista
    pickupProgress: {
      pickedUpAt: Date,
      handledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    // Order notes
    notes: {
      type: String,
      default: "",
    },
    // Who created this order (for in-person orders)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Notification tracking
    notifications: {
      confirmationSent: {
        type: Boolean,
        default: false,
      },
      confirmationSentAt: Date,
      readyNotificationSent: {
        type: Boolean,
        default: false,
      },
      readyNotificationSentAt: Date,
    },
  },
  { timestamps: true }
);

// Generate order number before saving
OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    
    // Calculate start and end of today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const count = await mongoose.model("Order").countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    this.orderNumber = `LUM-${dateStr}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Indexes for calendar-style querying
OrderSchema.index({ pickupDate: 1, status: 1 });
OrderSchema.index({ "customer.email": 1 });
OrderSchema.index({ createdAt: -1 });

// Calculate if order is for cakes/desserts (2-day min) or pastries/bread (1-day min)
OrderSchema.methods.getMinFulfillmentDays = function () {
  const hasLongLeadItem = this.items.some((item) =>
    ["cakes", "personal-desserts"].includes(item.productCategory)
  );
  return hasLongLeadItem ? 2 : 1;
};

export default mongoose.model("Order", OrderSchema);

