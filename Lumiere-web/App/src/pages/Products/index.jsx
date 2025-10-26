// App/src/pages/Products/index.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../lib/api";
import "../../styles/Collection.css";

const HERO_BY_CATEGORY = {
  "cakes": { image: "/Fraisier.png", heading: "Cakes" },
  "personal-desserts": { image: "/personal_dessert/Tiramichoux.png", heading: "Personal Desserts" },
  "onebite": { image: "/Bites.jpg", heading: "One-Bite Creations" },
  "pastries": { image: "/pastry/croisants.jpg", heading: "Pastries" },
  "bread": { image: "/bread/Classic Challah.jpg", heading: "Bread" },
  "bakery-shelf": { image: "/baker_shelf/Hazelnut Cookies.png", heading: "Bakery Shelf" },
};

export default function ProductsIndex() {
  const [params] = useSearchParams();
  const category = params.get("category") || "";
  const q = params.get("q") || "";

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    setLoading(true);
    setErr("");
    fetchProducts({ category, q })
      .then((d) => { if (ok) { setData(d); setLoading(false); } })
      .catch((e) => { if (ok) { setErr(e.message || "Failed"); setLoading(false); } });
    return () => { ok = false; };
  }, [category, q]);

  const hero = useMemo(() => HERO_BY_CATEGORY[category] || null, [category]);

  if (err) return <div className="collection-empty">Error: {err}</div>;
  if (loading) return <div className="collection-empty">Loading…</div>;

  const items = Array.isArray(data) ? data : [];

  return (
    <section className="collection-page">
      {/* Full-bleed hero to match your old category pages */}
      {hero && (
        <div
          className="collection-hero"
          style={{ backgroundImage: `url("${hero.image}")` }}
        >
          <div className="collection-hero-inner">
            <h1 className="collection-title">{hero.heading}</h1>
            <div className="collection-underline" />
          </div>
        </div>
      )}

      {/* Toolbar/title row (optional) */}
      <div className="collection-toolbar">
        <div style={{ fontWeight: 600 }}>E-Boutique</div>
        {category && (
          <div style={{ opacity: 0.7, textTransform: "capitalize" }}>
            {category.replaceAll("-", " ")}
          </div>
        )}
      </div>

      {/* Empty state */}
      {!items.length && (
        <div className="collection-empty">No products found.</div>
      )}

      {/* Grid uses your original classes */}
      <div className="collection-grid">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.slug}`}
            className="collection-card"
            aria-label={p.title}
          >
            <div className="collection-imgwrap">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="collection-img"
                  loading="lazy"
                />
              ) : (
                <div className="collection-img ph" />
              )}
            </div>
            <div className="collection-name">{p.title}</div>
            {typeof p.price === "number" && (
              <div className="collection-price">${p.price.toFixed(2)}</div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
