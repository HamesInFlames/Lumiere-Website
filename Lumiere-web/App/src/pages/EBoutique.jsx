// src/pages/EBoutique.jsx
import React, { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const TILES = [
  { label: "Cakes",              category: "cakes",            img: "/Noisette%20Noir.png",              keys: ["cake", "cakes"] },
  { label: "Personal Desserts",  category: "personal-desserts", img: "/Sweet.png",                        keys: ["personal", "petit", "dessert", "desserts"] },
  { label: "One-Bite Creations", category: "onebite",           img: "/Bitters.png",                      keys: ["one bite", "one-bite", "biters", "one bite creations"] },
  { label: "Pastries",           category: "pastries",          img: "/pastry/pastry.png",                keys: ["pastry", "pastries", "croissant"] },
  { label: "Breads",             category: "bread",             img: "/plain.png",                        keys: ["bread", "breads", "loaf"] },
  { label: "Bakery Shelf",       category: "bakery-shelf",      img: "/bakershelf.png",                   keys: ["shelf", "bakery shelf"] },
];

export default function EBoutique() {
  const { search } = useLocation();
  const q = useMemo(() => (new URLSearchParams(search).get("q") || "").trim().toLowerCase(), [search]);

  useEffect(() => {
    if (q) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [q]);

  const shown = useMemo(() => {
    if (!q) return TILES;
    return TILES.filter(t => t.keys?.some(k => q.includes(k)));
  }, [q]);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 80px" }}>
      <h1 style={{ textAlign: "center", margin: "36px 0 12px" }}>Menu</h1>

      {q && (
        <p style={{ textAlign: "center", color: "#666", marginBottom: 24 }}>
          Showing categories related to <strong>“{q}”</strong>
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        {shown.map((t) => (
          <Link
            key={t.category}
            to={`/products?category=${encodeURIComponent(t.category)}`}
            style={{
              display: "block",
              textDecoration: "none",
              color: "#222",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #eee",
              background: "#fff",
            }}
          >
            <div style={{ aspectRatio: "4 / 3", background: "#f6f6f6" }}>
              <img
                src={t.img}
                alt={t.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="eager"
              />
            </div>
            <div style={{ padding: "10px 12px", textAlign: "center", fontWeight: 500 }}>
              {t.label}
            </div>
          </Link>
        ))}

        {/* If query doesn't match any category, offer a link to the full products search */}
        {q && shown.length === 0 && (
          <Link
            to={`/products?q=${encodeURIComponent(q)}`}
            style={{
              display: "block",
              textDecoration: "none",
              color: "#222",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #eee",
              background: "#fff",
            }}
          >
            <div style={{
              aspectRatio: "4 / 3",
              background: "linear-gradient(135deg,#f8f9ff,#f2f2f7)",
              display: "grid",
              placeItems: "center"
            }}>
              <span style={{ fontSize: 18, opacity: 0.8 }}>No matching categories</span>
            </div>
            <div style={{ padding: "10px 12px", textAlign: "center", fontWeight: 500 }}>
              See all results for “{q}”
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
