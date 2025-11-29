// src/components/CartDrawer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartDrawer.css";

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    subtotal,
    tax,
    total,
    itemCount,
    minLeadDays,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title">
            Your Cart
            {itemCount > 0 && <span className="cart-count">({itemCount})</span>}
          </h2>
          <button className="cart-close" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🧁</div>
            <p>Your cart is empty</p>
            <button className="cart-continue-btn" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Lead time notice */}
            <div className="cart-notice">
              <span className="cart-notice-icon">⏰</span>
              <span>
                {minLeadDays === 2
                  ? "Cakes & desserts require 2 days notice"
                  : "Orders require 1 day notice"}
              </span>
            </div>

            {/* Items list */}
            <div className="cart-items">
              {items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item">
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <div className="cart-item-placeholder" />
                    )}
                  </div>

                  <div className="cart-item-details">
                    <Link
                      to={`/product/${item.slug}`}
                      className="cart-item-title"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>

                    <div className="cart-item-price">${item.price.toFixed(2)}</div>

                    {/* Options */}
                    {item.customMessage && (
                      <div className="cart-item-option">
                        📝 "{item.customMessage}"
                      </div>
                    )}
                    {item.includeCandle && (
                      <div className="cart-item-option">🕯️ Candle included</div>
                    )}

                    {/* Quantity controls */}
                    <div className="cart-item-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(index)}
                      aria-label="Remove item"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Tax (13% HST)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <p className="cart-payment-note">
                💳 Payment is collected at pickup
              </p>

              <Link
                to="/checkout"
                className="cart-checkout-btn"
                onClick={() => setIsOpen(false)}
              >
                Proceed to Pre-Order
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

