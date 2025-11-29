// src/controllers/orderController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import nodemailer from "nodemailer";

// Business hours configuration
const BUSINESS_HOURS = {
  open: 8, // 8 AM
  close: 18, // 6 PM
  daysOpen: [1, 2, 3, 4, 5, 6], // Monday to Saturday (0 = Sunday)
};

// Calculate minimum pickup date based on items
function calculateMinPickupDate(items, orderDate = new Date()) {
  const hasLongLeadItem = items.some((item) =>
    ["cakes", "personal-desserts"].includes(item.productCategory || item.category)
  );
  const minDays = hasLongLeadItem ? 2 : 1;

  let pickupDate = new Date(orderDate);
  let daysAdded = 0;

  // If order is after business hours, start from next day
  if (pickupDate.getHours() >= BUSINESS_HOURS.close) {
    pickupDate.setDate(pickupDate.getDate() + 1);
  }

  while (daysAdded < minDays) {
    pickupDate.setDate(pickupDate.getDate() + 1);
    // Only count business days
    if (BUSINESS_HOURS.daysOpen.includes(pickupDate.getDay())) {
      daysAdded++;
    }
  }

  return pickupDate;
}

// Send confirmation email
async function sendConfirmationEmail(order) {
  if (!process.env.SMTP_HOST) {
    console.log("SMTP not configured, skipping confirmation email");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });

    const itemsList = order.items
      .map(
        (item) =>
          `  • ${item.productName} x${item.quantity} - $${(item.unitPrice * item.quantity).toFixed(2)}${
            item.customMessage ? `\n    Message: "${item.customMessage}"` : ""
          }${item.includeCandle ? "\n    🕯️ Candle included" : ""}`
      )
      .join("\n");

    const pickupDateTime = new Date(order.pickupDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailContent = `
Hello ${order.customer.fullName},

Thank you for your order at Lumière Pâtisserie!

═══════════════════════════════════════
ORDER CONFIRMATION
═══════════════════════════════════════

Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleString()}

───────────────────────────────────────
YOUR ITEMS
───────────────────────────────────────
${itemsList}

───────────────────────────────────────
PICKUP DETAILS
───────────────────────────────────────
Date: ${pickupDateTime}
Time: ${order.pickupTime}

───────────────────────────────────────
PAYMENT SUMMARY
───────────────────────────────────────
Subtotal: $${order.subtotal.toFixed(2)}
Tax: $${order.tax.toFixed(2)}
Total: $${order.total.toFixed(2)}

Status: ${order.isPaid ? "PAID" : "Payment due at pickup"}

───────────────────────────────────────

Please bring this email or your order number when picking up your order.

If you have any questions, please don't hesitate to contact us.

With sweetness,
Lumière Pâtisserie

═══════════════════════════════════════
    `.trim();

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: order.customer.email,
      subject: `Order Confirmed - ${order.orderNumber} | Lumière Pâtisserie`,
      text: emailContent,
    });

    return true;
  } catch (err) {
    console.error("Failed to send confirmation email:", err.message);
    return false;
  }
}

// Send ready for pickup notification
async function sendReadyNotification(order) {
  if (!process.env.SMTP_HOST) {
    console.log("SMTP not configured, skipping ready notification");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });

    const emailContent = `
Hello ${order.customer.fullName},

Great news! Your order is ready for pickup! 🎂

═══════════════════════════════════════
ORDER READY FOR PICKUP
═══════════════════════════════════════

Order Number: ${order.orderNumber}

Scheduled Pickup: ${new Date(order.pickupDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })} at ${order.pickupTime}

Total Due: $${order.total.toFixed(2)} ${order.isPaid ? "(PAID)" : ""}

───────────────────────────────────────

We look forward to seeing you!

With sweetness,
Lumière Pâtisserie

═══════════════════════════════════════
    `.trim();

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: order.customer.email,
      subject: `Your Order is Ready! - ${order.orderNumber} | Lumière Pâtisserie`,
      text: emailContent,
    });

    return true;
  } catch (err) {
    console.error("Failed to send ready notification:", err.message);
    return false;
  }
}

// @desc    Create new order (from website or in-person)
// @route   POST /api/orders
// @access  Public (website) or Private (in-person by barista)
export async function createOrder(req, res, next) {
  try {
    const {
      customer,
      items,
      pickupDate,
      pickupTime,
      orderSource = "website",
      isPaid = false,
      paymentMethod = "pending",
      notes = "",
    } = req.body;

    // Validate customer info
    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return res.status(400).json({
        ok: false,
        message: "Customer info required: fullName, email, phone",
      });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "At least one item is required",
      });
    }

    // Fetch product details and build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          ok: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      const orderItem = {
        product: product._id,
        productName: product.name,
        productCategory: product.category,
        quantity: item.quantity,
        unitPrice: product.price,
      };

      // Only allow custom message and candle for cakes
      if (product.category === "cakes") {
        orderItem.customMessage = item.customMessage || "";
        orderItem.includeCandle = item.includeCandle || false;
      }

      orderItems.push(orderItem);
    }

    // Calculate tax (example: 13% HST)
    const taxRate = 0.13;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Validate pickup date
    const minPickupDate = calculateMinPickupDate(orderItems);
    const requestedPickupDate = new Date(pickupDate);

    if (requestedPickupDate < minPickupDate) {
      return res.status(400).json({
        ok: false,
        message: `Minimum pickup date for this order is ${minPickupDate.toLocaleDateString()}`,
        minPickupDate: minPickupDate.toISOString(),
      });
    }

    // Create order
    const order = await Order.create({
      customer,
      items: orderItems,
      subtotal,
      tax,
      total,
      pickupDate: requestedPickupDate,
      pickupTime,
      orderSource,
      isPaid,
      paymentMethod,
      notes,
      createdBy: req.user?.id || null,
      status: "confirmed",
    });

    // Send confirmation email
    const emailSent = await sendConfirmationEmail(order);
    if (emailSent) {
      order.notifications.confirmationSent = true;
      order.notifications.confirmationSentAt = new Date();
      await order.save();
    }

    res.status(201).json({
      ok: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        pickupDate: order.pickupDate,
        pickupTime: order.pickupTime,
        status: order.status,
        isPaid: order.isPaid,
        confirmationSent: emailSent,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get orders with filtering (calendar view support)
// @route   GET /api/orders
// @access  Private
export async function getOrders(req, res, next) {
  try {
    const { status, startDate, endDate, view = "list", all = false } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range (for calendar views)
    // If 'all' is true, don't filter by date - show all orders
    if (!all && (startDate || endDate)) {
      query.pickupDate = {};
      if (startDate) query.pickupDate.$gte = new Date(startDate);
      if (endDate) query.pickupDate.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate("createdBy", "firstName lastName")
      .populate("fulfillmentProgress.completedBy", "firstName lastName")
      .populate("pickupProgress.handledBy", "firstName lastName")
      .sort({ pickupDate: 1, pickupTime: 1 });

    // Format for calendar view if requested
    if (view === "calendar") {
      const calendarData = {};

      orders.forEach((order) => {
        const dateKey = order.pickupDate.toISOString().split("T")[0];
        if (!calendarData[dateKey]) {
          calendarData[dateKey] = [];
        }
        calendarData[dateKey].push({
          id: order._id,
          orderNumber: order.orderNumber,
          customerName: order.customer.fullName,
          pickupTime: order.pickupTime,
          status: order.status,
          isPaid: order.isPaid,
          itemCount: order.items.length,
          total: order.total,
        });
      });

      return res.json({
        ok: true,
        view: "calendar",
        data: calendarData,
      });
    }

    res.json({
      ok: true,
      orders: orders.map((o) => ({
        id: o._id,
        orderNumber: o.orderNumber,
        customer: o.customer,
        items: o.items,
        subtotal: o.subtotal,
        tax: o.tax,
        total: o.total,
        pickupDate: o.pickupDate,
        pickupTime: o.pickupTime,
        status: o.status,
        isPaid: o.isPaid,
        orderSource: o.orderSource,
        fulfillmentProgress: o.fulfillmentProgress,
        pickupProgress: o.pickupProgress,
        createdAt: o.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .populate("fulfillmentProgress.completedBy", "firstName lastName")
      .populate("pickupProgress.handledBy", "firstName lastName")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    res.json({
      ok: true,
      order,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update order status (pastry chef marks as fulfilled)
// @route   PATCH /api/orders/:id/status
// @access  Private
export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "in_progress", "ready", "picked_up", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    const previousStatus = order.status;
    order.status = status;

    // Track fulfillment progress
    if (status === "in_progress" && !order.fulfillmentProgress.startedAt) {
      order.fulfillmentProgress.startedAt = new Date();
    }

    if (status === "ready") {
      order.fulfillmentProgress.completedAt = new Date();
      order.fulfillmentProgress.completedBy = req.user.id;

      // Send ready notification
      const notificationSent = await sendReadyNotification(order);
      if (notificationSent) {
        order.notifications.readyNotificationSent = true;
        order.notifications.readyNotificationSentAt = new Date();
      }
    }

    // Track pickup
    if (status === "picked_up") {
      order.pickupProgress.pickedUpAt = new Date();
      order.pickupProgress.handledBy = req.user.id;
    }

    await order.save();

    res.json({
      ok: true,
      message: `Order status updated from ${previousStatus} to ${status}`,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        fulfillmentProgress: order.fulfillmentProgress,
        pickupProgress: order.pickupProgress,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Mark order as paid (barista)
// @route   PATCH /api/orders/:id/pay
// @access  Private (barista)
export async function markOrderPaid(req, res, next) {
  try {
    const { paymentMethod = "cash" } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        ok: false,
        message: "Order is already paid",
      });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentMethod = paymentMethod;

    await order.save();

    res.json({
      ok: true,
      message: "Order marked as paid",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get order by order number (for customer tracking)
// @route   GET /api/orders/track/:orderNumber
// @access  Public
export async function trackOrder(req, res, next) {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    // Return limited info for public tracking
    res.json({
      ok: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        pickupDate: order.pickupDate,
        pickupTime: order.pickupTime,
        isPaid: order.isPaid,
        itemCount: order.items.length,
        total: order.total,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get minimum pickup date for items
// @route   POST /api/orders/min-pickup-date
// @access  Public
export async function getMinPickupDate(req, res, next) {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        ok: false,
        message: "Items array is required",
      });
    }

    // Get product categories
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const itemsWithCategories = products.map((p) => ({
      category: p.category,
    }));

    const minDate = calculateMinPickupDate(itemsWithCategories);

    res.json({
      ok: true,
      minPickupDate: minDate.toISOString(),
      minDays: itemsWithCategories.some((i) => ["cakes", "personal-desserts"].includes(i.category)) ? 2 : 1,
    });
  } catch (err) {
    next(err);
  }
}

