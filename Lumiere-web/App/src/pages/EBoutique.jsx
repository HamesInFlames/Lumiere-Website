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

  // NEW: lock to prevent the observer from overriding clicked tab highlight
  const [lockHighlight, setLockHighlight] = useState(false);

  const sectionRefs = useRef({});

  // Load all products (no filter)
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

  // Group products by category
  const productsByCategory = useMemo(() => {
    const map = {};
    MENU_SECTIONS.forEach((s) => (map[s.id] = []));
    items.forEach((p) => {
      if (map[p.category]) map[p.category].push(p);
    });
    return map;
  }, [items]);

  // Scroll-based highlighting with lock protection
  useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (lockHighlight) return; // <-- KEY FIX: stop observer during click scroll

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id && active !== id) {
              setActive(id);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-200px 0px -60% 0px",
        threshold: 0,
      }
    );

    MENU_SECTIONS.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, lockHighlight, active]);

  // Clicking a tab = scroll to section + smart lock
  const handleTabClick = (id) => {
    const el = sectionRefs.current[id];
    if (!el) return;

    setLockHighlight(true); // prevent observer from overriding highlight

    const stickyHeight = document.querySelector(".menu-tabs")?.offsetHeight || 80;
    const headerHeight = document.querySelector("header")?.offsetHeight || 60;
    const offset = stickyHeight + headerHeight + 20;

    const rect = el.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY - offset;

    // highlight immediately
    setActive(id);

    // smooth scroll
    window.scrollTo({ top: offsetTop, behavior: "smooth" });

    // unlock after scroll animation finishes
    setTimeout(() => {
      setLockHighlight(false);
    }, 700);
  };

  // Error state
  if (err) {
    return (
      <main className="menu-page">
        <p className="menu-error">Error: {err}</p>
      </main>
    );
  }

  return (
    <main className="menu-page">
      {/* Header */}
      <header className="menu-header">
        <h1 className="menu-title">Menu</h1>
        <p className="menu-subtitle">
          Explore our cakes, pastries, breads, and one-bite creations — crafted fresh at Lumière Patisserie.
        </p>
      </header>

      {/* Sticky tabs */}
      <nav className="menu-tabs" aria-label="Product categories">
        <div className="menu-tab-row">
          {MENU_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              className={`menu-tab ${active === sec.id ? "menu-tab--active" : ""}`}
              type="button"
              onClick={() => handleTabClick(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </nav>
      <div className="menu-tabs-spacer"></div>

      {loading && <div className="menu-loading">Loading menu…</div>}

      {/* Category sections */}
      {!loading &&
        MENU_SECTIONS.map((sec) => {
          const list = productsByCategory[sec.id] || [];
          if (!list.length) return null;

          return (
            <section
              key={sec.id}
              className="menu-section"
              data-section-id={sec.id}
              ref={(el) => (sectionRefs.current[sec.id] = el)}
            >
              <div className="menu-section-header">
                <div>
                  <h2 className="menu-section-title">{sec.label}</h2>
                  {sec.blurb && <p className="menu-section-blurb">{sec.blurb}</p>}
                </div>
                <span className="menu-section-count">
                  {list.length} item{list.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="menu-grid">
                {list.map((p) => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="menu-card" aria-label={p.title}>
                    <div className="menu-imgwrap">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="menu-img" loading="lazy" />
                      ) : (
                        <div className="menu-img menu-img--placeholder" />
                      )}
                    </div>

                    <div className="menu-card-body">
                      <div className="menu-name">{p.title}</div>
                      {typeof p.price === "number" && (
                        <div className="menu-price">${p.price.toFixed(2)}</div>
                      )}
                      {p.description && <div className="menu-desc">{p.description}</div>}
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
