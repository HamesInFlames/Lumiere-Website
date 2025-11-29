// src/controllers/inventoryController.js
import InventoryItem from "../models/Inventory.js";
import InventoryLog from "../models/InventoryLog.js";

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
export async function getInventory(req, res, next) {
  try {
    const { category, lowStock } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    let items = await InventoryItem.find(query)
      .populate("restockedBy", "firstName lastName")
      .sort({ category: 1, name: 1 });

    // Filter low stock items if requested
    if (lowStock === "true") {
      items = items.filter((item) => item.isLowStock);
    }

    res.json({
      ok: true,
      items: items.map((item) => ({
        id: item._id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        currentQuantity: item.currentQuantity,
        minimumQuantity: item.minimumQuantity,
        maximumQuantity: item.maximumQuantity,
        isLowStock: item.isLowStock,
        lastRestocked: item.lastRestocked,
        restockedBy: item.restockedBy
          ? `${item.restockedBy.firstName} ${item.restockedBy.lastName}`
          : null,
        notes: item.notes,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private
export async function createInventoryItem(req, res, next) {
  try {
    const { name, category, unit, currentQuantity, minimumQuantity, maximumQuantity, notes } = req.body;

    if (!name || !category || !unit) {
      return res.status(400).json({
        ok: false,
        message: "Name, category, and unit are required",
      });
    }

    if (!["pastry", "barista", "shared"].includes(category)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid category. Must be pastry, barista, or shared",
      });
    }

    // Check for duplicate name in same category
    const existing = await InventoryItem.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      category,
    });

    if (existing) {
      return res.status(400).json({
        ok: false,
        message: `Item "${name}" already exists in ${category} category`,
      });
    }

    const item = await InventoryItem.create({
      name,
      category,
      unit,
      currentQuantity: currentQuantity || 0,
      minimumQuantity: minimumQuantity || 0,
      maximumQuantity: maximumQuantity || null,
      notes: notes || "",
    });

    // Log the initial stock if any
    if (currentQuantity > 0) {
      await InventoryLog.create({
        inventoryItem: item._id,
        action: "add",
        quantityChange: currentQuantity,
        previousQuantity: 0,
        newQuantity: currentQuantity,
        performedBy: req.user.id,
        notes: "Initial stock",
      });
    }

    res.status(201).json({
      ok: true,
      item: {
        id: item._id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        currentQuantity: item.currentQuantity,
        minimumQuantity: item.minimumQuantity,
        maximumQuantity: item.maximumQuantity,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update inventory quantity
// @route   PATCH /api/inventory/:id/quantity
// @access  Private
export async function updateQuantity(req, res, next) {
  try {
    const { action, quantity, notes = "" } = req.body;

    if (!["add", "remove", "adjust", "restock", "end_of_day"].includes(action)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid action. Must be add, remove, adjust, restock, or end_of_day",
      });
    }

    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({
        ok: false,
        message: "Quantity must be a positive number",
      });
    }

    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        ok: false,
        message: "Inventory item not found",
      });
    }

    const previousQuantity = item.currentQuantity;
    let quantityChange;

    switch (action) {
      case "add":
      case "restock":
        quantityChange = quantity;
        item.currentQuantity += quantity;
        if (action === "restock") {
          item.lastRestocked = new Date();
          item.restockedBy = req.user.id;
        }
        break;
      case "remove":
        quantityChange = -quantity;
        item.currentQuantity = Math.max(0, item.currentQuantity - quantity);
        break;
      case "adjust":
      case "end_of_day":
        quantityChange = quantity - previousQuantity;
        item.currentQuantity = quantity;
        break;
    }

    await item.save();

    // Create log entry
    await InventoryLog.create({
      inventoryItem: item._id,
      action,
      quantityChange,
      previousQuantity,
      newQuantity: item.currentQuantity,
      performedBy: req.user.id,
      notes,
    });

    res.json({
      ok: true,
      item: {
        id: item._id,
        name: item.name,
        previousQuantity,
        currentQuantity: item.currentQuantity,
        change: quantityChange,
        isLowStock: item.isLowStock,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update inventory item details
// @route   PUT /api/inventory/:id
// @access  Private
export async function updateInventoryItem(req, res, next) {
  try {
    const { name, unit, minimumQuantity, maximumQuantity, notes } = req.body;

    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        ok: false,
        message: "Inventory item not found",
      });
    }

    if (name) item.name = name;
    if (unit) item.unit = unit;
    if (typeof minimumQuantity === "number") item.minimumQuantity = minimumQuantity;
    if (typeof maximumQuantity === "number") item.maximumQuantity = maximumQuantity;
    if (notes !== undefined) item.notes = notes;

    await item.save();

    res.json({
      ok: true,
      item: {
        id: item._id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        currentQuantity: item.currentQuantity,
        minimumQuantity: item.minimumQuantity,
        maximumQuantity: item.maximumQuantity,
        notes: item.notes,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Delete (deactivate) inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Admin)
export async function deleteInventoryItem(req, res, next) {
  try {
    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        ok: false,
        message: "Inventory item not found",
      });
    }

    item.isActive = false;
    await item.save();

    res.json({
      ok: true,
      message: "Inventory item deleted",
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get inventory logs for an item
// @route   GET /api/inventory/:id/logs
// @access  Private
export async function getInventoryLogs(req, res, next) {
  try {
    const { limit = 50 } = req.query;

    const logs = await InventoryLog.find({ inventoryItem: req.params.id })
      .populate("performedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      ok: true,
      logs: logs.map((log) => ({
        id: log._id,
        action: log.action,
        quantityChange: log.quantityChange,
        previousQuantity: log.previousQuantity,
        newQuantity: log.newQuantity,
        performedBy: log.performedBy
          ? `${log.performedBy.firstName} ${log.performedBy.lastName}`
          : null,
        notes: log.notes,
        createdAt: log.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get low stock alerts
// @route   GET /api/inventory/alerts
// @access  Private
export async function getLowStockAlerts(req, res, next) {
  try {
    const items = await InventoryItem.find({ isActive: true });
    const lowStockItems = items.filter((item) => item.isLowStock);

    res.json({
      ok: true,
      count: lowStockItems.length,
      items: lowStockItems.map((item) => ({
        id: item._id,
        name: item.name,
        category: item.category,
        currentQuantity: item.currentQuantity,
        minimumQuantity: item.minimumQuantity,
        unit: item.unit,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Bulk end-of-day update
// @route   POST /api/inventory/end-of-day
// @access  Private
export async function endOfDayUpdate(req, res, next) {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        ok: false,
        message: "Updates array is required",
      });
    }

    const results = [];

    for (const update of updates) {
      const { itemId, newQuantity, notes = "" } = update;

      const item = await InventoryItem.findById(itemId);
      if (!item) continue;

      const previousQuantity = item.currentQuantity;
      const quantityChange = newQuantity - previousQuantity;

      item.currentQuantity = newQuantity;
      await item.save();

      await InventoryLog.create({
        inventoryItem: item._id,
        action: "end_of_day",
        quantityChange,
        previousQuantity,
        newQuantity,
        performedBy: req.user.id,
        notes: notes || "End of day count",
      });

      results.push({
        id: item._id,
        name: item.name,
        previousQuantity,
        newQuantity,
        change: quantityChange,
      });
    }

    res.json({
      ok: true,
      message: `Updated ${results.length} items`,
      results,
    });
  } catch (err) {
    next(err);
  }
}

