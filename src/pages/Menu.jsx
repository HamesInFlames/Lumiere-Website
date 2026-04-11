// src/pages/Menu.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

export default function Menu() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [active, setActive] = useState("cakes");
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false });

  const sectionRefs = useRef({});
  const tabRowRef = useRef(null);
  const tabWrapperRef = useRef(null);
  const isScrollingRef = useRef(false);

  const scrollToSectionById = useCallback((id) => {
    const el = sectionRefs.current[id];
    if (!el) return false;

    isScrollingRef.current = true;

    const header = document.querySelector(".site-header");
    const tabs = document.querySelector(".menu-tabs");
    const headerHeight = header ? header.offsetHeight : 85;
    const tabsHeight = tabs ? tabs.offsetHeight : 60;
    const totalOffset = headerHeight + tabsHeight + 16;

    const rect = el.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY - totalOffset;

    setActive(id);
    window.scrollTo({ top: offsetTop, behavior: "smooth" });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
    return true;
  }, []);

  // Track horizontal scroll position of tab row
  useEffect(() => {
    const tabRow = tabRowRef.current;
    if (!tabRow) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = tabRow;
      const atStart = scrollLeft <= 5;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 5;
      setScrollState({ atStart, atEnd });
    };

    tabRow.addEventListener('scroll', updateScrollState, { passive: true });
    
    // Initial check after a small delay to ensure layout is complete
    const timer = setTimeout(updateScrollState, 100);
    updateScrollState();

    // Also update on resize
    window.addEventListener('resize', updateScrollState);

    return () => {
      tabRow.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      clearTimeout(timer);
    };
  }, [loading]);

  // Scroll tab row left/right
  const scrollTabs = (direction) => {
    const tabRow = tabRowRef.current;
    if (!tabRow) return;
    const scrollAmount = direction === 'left' ? -150 : 150;
    tabRow.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

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

  // Scroll to category from URL hash (e.g. /menu#cakes) after sections mount
  useEffect(() => {
    if (loading) return;
    const id = location.hash.replace(/^#/, "");
    if (!id || !MENU_SECTIONS.some((s) => s.id === id)) return;

    let cancelled = false;
    const tid = window.setTimeout(() => {
      if (cancelled) return;
      scrollToSectionById(id);
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  }, [loading, location.hash, scrollToSectionById]);

  // 3) Highlight active tab based on scroll position
  useEffect(() => {
    if (!items.length) return;

    const handleScroll = () => {
      // Skip updates during programmatic scrolling
      if (isScrollingRef.current) return;

      // Get the offset where we consider a section "active"
      // This is below the sticky header + tabs
      const header = document.querySelector('.site-header');
      const tabs = document.querySelector('.menu-tabs');
      const headerHeight = header ? header.offsetHeight : 85;
      const tabsHeight = tabs ? tabs.offsetHeight : 60;
      const triggerPoint = headerHeight + tabsHeight + 50;

      // Find the section whose top is closest to (but above) the trigger point
      let currentSection = MENU_SECTIONS[0].id;

      for (const sec of MENU_SECTIONS) {
        const el = sectionRefs.current[sec.id];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        
        // If section top is above the trigger point, it's the current section
        // Keep updating until we find one that's below
        if (rect.top <= triggerPoint) {
          currentSection = sec.id;
        }
      }

      if (currentSection !== active) {
        setActive(currentSection);
      }
    };

    // Throttle scroll handler for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [items, active]);

  // 4) Click tab → smooth scroll to section (positions section header just below tabs)
  const handleTabClick = (id) => {
    scrollToSectionById(id);
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
        <div 
          className={`menu-tabs-wrapper ${scrollState.atStart ? 'at-start' : ''} ${scrollState.atEnd ? 'at-end' : ''}`}
          ref={tabWrapperRef}
        >
          {/* Left scroll indicator */}
          <button
            type="button"
            className={`menu-scroll-indicator menu-scroll-indicator--left ${scrollState.atStart ? 'menu-scroll-indicator--hidden' : ''}`}
            onClick={() => scrollTabs('left')}
            aria-label="Scroll categories left"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="menu-tab-row" ref={tabRowRef}>
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

          {/* Right scroll indicator */}
          <button
            type="button"
            className={`menu-scroll-indicator menu-scroll-indicator--right ${scrollState.atEnd ? 'menu-scroll-indicator--hidden' : ''}`}
            onClick={() => scrollTabs('right')}
            aria-label="Scroll categories right"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
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
              id={sec.id}
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
