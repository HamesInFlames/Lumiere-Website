// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

// Product categories that require 2-day lead time
const LONG_LEAD_CATEGORIES = ["cakes", "personal-desserts"];

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("lumiere-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("lumiere-cart", JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = (product, quantity = 1, options = {}) => {
    setItems((prev) => {
      // Check if item with same options exists
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.customMessage === (options.customMessage || "") &&
          item.includeCandle === (options.includeCandle || false)
      );

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity,
          customMessage: options.customMessage || "",
          includeCandle: options.includeCandle || false,
        },
      ];
    });
  };

  // Update item quantity
  const updateQuantity = (index, quantity) => {
    if (quantity < 1) {
      removeItem(index);
      return;
    }

    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity };
      return updated;
    });
  };

  // Update item options
  const updateItemOptions = (index, options) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...options };
      return updated;
    });
  };

  // Remove item
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate tax (13% HST)
  const taxRate = 0.13;
  const tax = subtotal * taxRate;

  // Calculate total
  const total = subtotal + tax;

  // Total items count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Check if cart has cakes (for custom message/candle options)
  const hasCakes = items.some((item) => item.category === "cakes");

  // Get minimum pickup date based on items
  const getMinPickupDate = () => {
    const hasLongLeadItem = items.some((item) =>
      LONG_LEAD_CATEGORIES.includes(item.category)
    );
    const minDays = hasLongLeadItem ? 2 : 1;

    const now = new Date();
    let pickupDate = new Date(now);

    // Business hours: 8 AM - 6 PM
    // If after 6 PM, start from next day
    if (now.getHours() >= 18) {
      pickupDate.setDate(pickupDate.getDate() + 1);
    }

    // Add minimum days (only counting business days: Mon-Sat)
    let daysAdded = 0;
    while (daysAdded < minDays) {
      pickupDate.setDate(pickupDate.getDate() + 1);
      // Sunday = 0, skip it
      if (pickupDate.getDay() !== 0) {
        daysAdded++;
      }
    }

    return pickupDate;
  };

  const minLeadDays = items.some((item) =>
    LONG_LEAD_CATEGORIES.includes(item.category)
  )
    ? 2
    : items.length > 0
    ? 1
    : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        updateQuantity,
        updateItemOptions,
        removeItem,
        clearCart,
        subtotal,
        tax,
        total,
        itemCount,
        hasCakes,
        minLeadDays,
        getMinPickupDate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

