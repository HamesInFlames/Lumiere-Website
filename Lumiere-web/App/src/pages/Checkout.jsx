// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { submitOrder } from "../lib/api";
import "../styles/Checkout.css";

const PICKUP_TIMES = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

export default function Checkout() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    tax,
    total,
    itemCount,
    minLeadDays,
    getMinPickupDate,
    clearCart,
  } = useCart();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickupDate: "",
    pickupTime: "10:00 AM",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [minDate, setMinDate] = useState("");

  // Set minimum pickup date
  useEffect(() => {
    if (items.length > 0) {
      const min = getMinPickupDate();
      const dateStr = min.toISOString().split("T")[0];
      setMinDate(dateStr);
      if (!formData.pickupDate || formData.pickupDate < dateStr) {
        setFormData((prev) => ({ ...prev, pickupDate: dateStr }));
      }
    }
  }, [items, getMinPickupDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = "Pickup date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const orderData = {
        customer: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
        },
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          customMessage: item.customMessage || "",
          includeCandle: item.includeCandle || false,
        })),
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        notes: formData.notes.trim(),
      };

      const result = await submitOrder(orderData);

      setOrderNumber(result.order.orderNumber);
      setSubmitted(true);
      clearCart();
    } catch (error) {
      alert(error.message || "Failed to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p className="success-order-number">Order #{orderNumber}</p>
          <p className="success-message">
            Thank you for your pre-order! We've sent a confirmation email to{" "}
            <strong>{formData.email}</strong>.
          </p>

          <div className="success-details">
            <h3>Pickup Details</h3>
            <p>
              📅 {new Date(formData.pickupDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>⏰ {formData.pickupTime}</p>
          </div>

          <div className="success-note">
            <p>💳 Payment will be collected when you pick up your order.</p>
            <p>📧 We'll email you when your order is ready!</p>
          </div>

          <Link to="/e-boutique" className="success-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0 && !submitted) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious treats before checking out!</p>
          <Link to="/e-boutique" className="checkout-btn">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/e-boutique" className="checkout-back">
            ← Back to Menu
          </Link>
          <h1>Complete Your Pre-Order</h1>
          <p className="checkout-subtitle">
            Fill in your details below. Payment is collected at pickup.
          </p>
        </div>

        <div className="checkout-grid">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="form-section">
              <h2>Contact Information</h2>

              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={errors.fullName ? "error" : ""}
                />
                {errors.fullName && (
                  <span className="form-error">{errors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
                <span className="form-hint">
                  We'll send your confirmation here
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(647) 123-4567"
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && (
                  <span className="form-error">{errors.phone}</span>
                )}
              </div>
            </section>

            <section className="form-section">
              <h2>Pickup Details</h2>

              <div className="form-notice">
                <span className="notice-icon">⏰</span>
                <span>
                  {minLeadDays === 2
                    ? "Your order includes items that require 2 days notice."
                    : "Orders require at least 1 day advance notice."}
                </span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickupDate">Pickup Date *</label>
                  <input
                    type="date"
                    id="pickupDate"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={minDate}
                    className={errors.pickupDate ? "error" : ""}
                  />
                  {errors.pickupDate && (
                    <span className="form-error">{errors.pickupDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="pickupTime">Pickup Time *</label>
                  <select
                    id="pickupTime"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                  >
                    {PICKUP_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Order Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special requests or instructions..."
                  rows={3}
                />
              </div>
            </section>

            <button
              type="submit"
              className="checkout-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Confirm Pre-Order</span>
                  <span className="btn-total">${total.toFixed(2)}</span>
                </>
              )}
            </button>

            <p className="checkout-disclaimer">
              By placing this order, you agree to pick up your items on the
              selected date and time. Payment is due at pickup.
            </p>
          </form>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {items.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="summary-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <div className="summary-item-placeholder" />
                    )}
                    <span className="summary-item-qty">{item.quantity}</span>
                  </div>
                  <div className="summary-item-details">
                    <div className="summary-item-name">{item.title}</div>
                    {item.customMessage && (
                      <div className="summary-item-option">
                        📝 "{item.customMessage}"
                      </div>
                    )}
                    {item.includeCandle && (
                      <div className="summary-item-option">🕯️ Candle</div>
                    )}
                  </div>
                  <div className="summary-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (13% HST)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-payment-note">
              <span className="payment-icon">💳</span>
              <span>Payment collected at pickup</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

