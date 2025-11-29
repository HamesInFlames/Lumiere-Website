import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProduct } from "../../lib/api";
import { useCart } from "../../context/CartContext";
import "../../styles/Product.css";

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ProductPage() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");

  // Add to cart state
  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState("");
  const [includeCandle, setIncludeCandle] = useState(false);
  const [added, setAdded] = useState(false);

  const { addItem, setIsOpen } = useCart();

  useEffect(() => {
    let ok = true;
    fetchProduct(slug)
      .then((d) => ok && setP(d))
      .catch((e) => ok && setErr(e.message));
    return () => (ok = false);
  }, [slug]);

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1);
    setCustomMessage("");
    setIncludeCandle(false);
    setAdded(false);
  }, [slug]);

  const handleAddToCart = () => {
    if (!p) return;

    addItem(p, quantity, {
      customMessage: p.category === "cakes" ? customMessage : "",
      includeCandle: p.category === "cakes" ? includeCandle : false,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleViewCart = () => {
    setIsOpen(true);
  };

  if (err) return <div className="wrap"><p>Error: {err}</p></div>;
  if (!p) return <div className="wrap"><p>Loading…</p></div>;

  const gallery = p.images?.length ? p.images : (p.image ? [p.image] : []);
  const isCake = p.category === "cakes";

  // Determine lead time message
  const leadDays = ["cakes", "personal-desserts"].includes(p.category) ? 2 : 1;

  return (
    <section className="product wrap">
      <div className="product__grid">
        {/* Left side: product images */}
        <div className="product__media">
          {(gallery.length ? gallery : [null]).map((src, i) => (
            <div key={i} className="media__item">
              {src ? <img src={src} alt={`${p.title} ${i + 1}`} /> : <div className="ph" />}
            </div>
          ))}
        </div>

        {/* Right side: info */}
        <div className="product__info">
          <Link to="/e-boutique" className="product__back">
            ← Back to Menu
          </Link>

          <h1 className="product__title">{p.title}</h1>

          {typeof p.price === "number" && (
            <div className="product__price">${p.price.toFixed(2)}</div>
          )}

          {/* Lead time notice */}
          <div className="product__notice">
            <span className="notice-icon">⏰</span>
            <span>
              {leadDays === 2
                ? "Requires 2 days advance notice"
                : "Requires 1 day advance notice"}
            </span>
          </div>

          {/* Cake customization options */}
          {isCake && (
            <div className="product__options">
              <div className="option-group">
                <label className="option-label">Custom Message on Cake</label>
                <input
                  type="text"
                  className="option-input"
                  placeholder="e.g., Happy Birthday Sarah!"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  maxLength={50}
                />
                <span className="option-hint">
                  Written on a sugar cookie plaque (50 chars max)
                </span>
              </div>

              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={includeCandle}
                  onChange={(e) => setIncludeCandle(e.target.checked)}
                />
                <span className="checkbox-custom" />
                <span>Include birthday candles 🕯️</span>
              </label>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="product__buy">
            <div className="qty">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                aria-label="Quantity"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className={`btn-add-cart ${added ? "btn-added" : ""}`}
              onClick={added ? handleViewCart : handleAddToCart}
            >
              {added ? (
                <>
                  <CheckIcon />
                  <span>Added! View Cart</span>
                </>
              ) : (
                <>
                  <span>Add to Cart</span>
                  <span className="btn-price">
                    ${(p.price * quantity).toFixed(2)}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Pre-order note */}
          <p className="product__preorder-note">
            💳 This is a pre-order. Payment is collected when you pick up.
          </p>

          {/* Description & details */}
          <div className="acc">
            {p.description && (
              <details open>
                <summary>Description</summary>
                <div>{p.description}</div>
              </details>
            )}
            {p.ingredients && (
              <details>
                <summary>Ingredients</summary>
                <div>{p.ingredients}</div>
              </details>
            )}
            {p.allergens && (
              <details>
                <summary>Allergens</summary>
                <div>{p.allergens}</div>
              </details>
            )}
            {p.serving_size && (
              <details>
                <summary>Serving size</summary>
                <div>{p.serving_size}</div>
              </details>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
