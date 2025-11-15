// src/pages/EBoutique.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../lib/api";
import "../styles/Menu.css";

const MENU_SECTIONS = [
  {
    id: "cakes",
    label: "Cakes",
    blurb: "Whole cakes for gatherings, birthdays, and special occasions.",
  },
  {
    id: "personal-desserts",
    label: "Personal Desserts",
    blurb: "Individual-sized treats, perfect for gifting or a moment for yourself.",
  },
  {
    id: "onebite",
    label: "One-Bite Creations",
    blurb: "Elegant petit fours and bite-sized sweets for sharing.",
  },
  {
    id: "pastries",
    label: "Pastries",
    blurb: "Classic French viennoiserie, baked fresh every morning.",
  },
  {
    id: "bread",
    label: "Breads",
    blurb: "Artisan sourdough and specialty loaves.",
  },
  {
    id: "bakery-shelf",
    label: "Bakery Shelf",
    blurb: "Cookies, bars, and shelf-stable treats.",
  },
];

export default function EBoutique() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [active, setActive] = useState("cakes");

  const sectionRefs = useRef({});

  // 1) Load ALL products (no category filter)
  useEffect(() => {
    let ok = true;
    setLoading(true);
    setErr("");

    fetchProducts()
      .then((data) => {
        if (!ok) return;
        setItems(data);
        setLoading(false);
      })
      .catch((e) => {
        if (!ok) return;
        setErr(e.message || "Failed to load menu.");
        setLoading(false);
      });

    return () => {
      ok = false;
    };
  }, []);

  // 2) Group products by category
  const productsByCategory = useMemo(() => {
    const map = {};
    MENU_SECTIONS.forEach((sec) => {
      map[sec.id] = [];
    });

    for (const p of items) {
      if (map[p.category]) {
        map[p.category].push(p);
      }
    }
    return map;
  }, [items]);

  // 3) Observe sections to highlight active tab on scroll
  useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute("data-section-id");
          if (!id) continue;

          if (!best || entry.intersectionRatio > best.ratio) {
            best = { id, ratio: entry.intersectionRatio };
          }
        }

        if (best && best.id !== active) {
          setActive(best.id);
        }
      },
      {
        root: null,
        threshold: [0.3, 0.6],
      }
    );

    MENU_SECTIONS.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // 4) Click tab → smooth scroll to section
  const handleTabClick = (id) => {
    const el = sectionRefs.current[id];
    if (!el) return;

    const headerOffset = 120; // adjust if your header height changes
    const rect = el.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY - headerOffset;

    window.scrollTo({ top: offsetTop, behavior: "smooth" });
    setActive(id);
  };

  if (err) {
    return (
      <main className="menu-page">
        <p className="menu-error">Error: {err}</p>
      </main>
    );
  }

  return (
    <main className="menu-page">
      {/* Page header */}
      <header className="menu-header">
        <h1 className="menu-title">Menu</h1>
        <p className="menu-subtitle">
          Explore our cakes, pastries, breads, and one-bite creations — crafted
          fresh at Lumière Patisserie.
        </p>
      </header>

      {/* Sticky horizontal category tabs (Paris Baguette style) */}
      <nav className="menu-tabs" aria-label="Product categories">
        <div className="menu-tab-row">
          {MENU_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              className={`menu-tab ${
                active === sec.id ? "menu-tab--active" : ""
              }`}
              onClick={() => handleTabClick(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </nav>
      <div className="menu-tabs-spacer"></div>
      {loading && <div className="menu-loading">Loading menu…</div>}

      {/* Sections for each category */}
      {!loading &&
        MENU_SECTIONS.map((sec) => {
          const list = productsByCategory[sec.id] || [];
          if (!list.length) return null;

          return (
            <section
              key={sec.id}
              className="menu-section"
              data-section-id={sec.id}
              ref={(el) => {
                sectionRefs.current[sec.id] = el;
              }}
            >
              <div className="menu-section-header">
                <div>
                  <h2 className="menu-section-title">{sec.label}</h2>
                  {sec.blurb && (
                    <p className="menu-section-blurb">{sec.blurb}</p>
                  )}
                </div>
                <span className="menu-section-count">
                  {list.length} item{list.length !== 1 ? "s" : ""}
                </span>
              </div>

            <div className="menu-grid">
              {list.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="menu-card"
                  aria-label={p.title}
                >
                  <div className="menu-imgwrap">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="menu-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="menu-img menu-img--placeholder" />
                    )}
                  </div>

                  <div className="menu-card-body">
                    <div className="menu-name">{p.title}</div>

                    {typeof p.price === "number" && (
                      <div className="menu-price">${p.price.toFixed(2)}</div>
                    )}

                    {p.description && (
                      <div className="menu-desc">{p.description}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            </section>
          );
        })}
    </main>
  );
}
