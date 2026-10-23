// src/pages/Menu.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchProducts } from "../lib/api";
import { usePageMeta } from "../lib/usePageMeta";
import { pageMeta } from "../lib/seo";
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
  usePageMeta(pageMeta("menu"), null);
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [active, setActive] = useState("cakes");
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false });

  const sectionRefs = useRef({});
  const tabRowRef = useRef(null);
  const tabWrapperRef = useRef(null);
  const tabBtnRefs = useRef({});
  const isScrollingRef = useRef(false);
  const activeRef = useRef("cakes");
  // Releases the programmatic-scroll lock + its listeners/timers (null when idle)
  const releaseLockRef = useRef(null);

  // Keep state and ref in sync so the scroll-spy listener never needs `active` as a dep
  const updateActive = useCallback((id) => {
    activeRef.current = id;
    setActive(id);
  }, []);

  const scrollToSectionById = useCallback(
    (id) => {
      const el = sectionRefs.current[id];
      if (!el) return false;

      // A second tap mid-scroll must not leave a stale lock/timer behind
      if (releaseLockRef.current) releaseLockRef.current();

      const header = document.querySelector(".site-header");
      const tabs = document.querySelector(".menu-tabs");
      const headerHeight = header ? header.offsetHeight : 85;
      const tabsHeight = tabs ? tabs.offsetHeight : 60;
      const totalOffset = headerHeight + tabsHeight + 16;

      const rect = el.getBoundingClientRect();
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const targetTop = Math.min(
        maxScroll,
        Math.max(0, rect.top + window.scrollY - totalOffset)
      );

      // Long distances: jump instantly instead of a multi-second whip
      const distance = Math.abs(targetTop - window.scrollY);
      const behavior = distance > window.innerHeight * 1.5 ? "auto" : "smooth";

      isScrollingRef.current = true;
      updateActive(id);
      window.scrollTo({ top: targetTop, behavior });

      // Release the lock when the scroll actually ends
      const userEvents = ["wheel", "touchstart", "keydown"];
      const supportsScrollEnd = "onscrollend" in window;
      let done = false;
      let rafId = 0;
      let capTimer = 0;

      const finish = () => {
        if (done) return;
        done = true;
        cancelAnimationFrame(rafId);
        clearTimeout(capTimer);
        window.removeEventListener("scrollend", onScrollEnd);
        userEvents.forEach((evt) => window.removeEventListener(evt, finish));
        isScrollingRef.current = false;
        if (releaseLockRef.current === finish) releaseLockRef.current = null;
      };

      // Ignore a scrollend that belongs to a previous, cancelled scroll
      function onScrollEnd() {
        if (Math.abs(window.scrollY - targetTop) <= 2) finish();
      }

      if (supportsScrollEnd) window.addEventListener("scrollend", onScrollEnd);
      // User grabbed the page: give the scroll-spy back immediately
      userEvents.forEach((evt) =>
        window.addEventListener(evt, finish, { passive: true })
      );

      // Fallback: position unchanged for ~100ms (250ms if it never started)
      let lastY = window.scrollY;
      let lastChange = performance.now();
      let moved = false;
      const poll = () => {
        if (done) return;
        const now = performance.now();
        const y = window.scrollY;
        if (y !== lastY) {
          lastY = y;
          lastChange = now;
          moved = true;
        } else if (now - lastChange >= (moved ? 100 : 250)) {
          finish();
          return;
        }
        rafId = requestAnimationFrame(poll);
      };
      rafId = requestAnimationFrame(poll);

      // Hard cap
      capTimer = window.setTimeout(finish, 1500);

      releaseLockRef.current = finish;
      return true;
    },
    [updateActive]
  );

  // Release any pending lock on unmount
  useEffect(() => {
    return () => {
      if (releaseLockRef.current) releaseLockRef.current();
    };
  }, []);

  // Keep the active tab visible inside the horizontally scrolling tab row.
  // Reveal-only: a tab that is already fully visible never moves, so the tab
  // you tapped stays under your finger. Otherwise scroll the minimum amount.
  useEffect(() => {
    const row = tabRowRef.current;
    const btn = tabBtnRefs.current[active];
    if (!row || !btn) return;

    const maxLeft = row.scrollWidth - row.clientWidth;
    if (maxLeft <= 0) return;

    // Arrow buttons / edge fades cover ~44px each side on mobile
    const inset = window.matchMedia("(max-width: 768px)").matches ? 44 : 0;
    const margin = 8;

    const rowRect = row.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const tabLeft = btnRect.left - rowRect.left; // relative to visible row edge
    const tabRight = btnRect.right - rowRect.left;
    const usableLeft = inset;
    const usableRight = row.clientWidth - inset;

    if (tabLeft >= usableLeft && tabRight <= usableRight) return;

    let delta = 0;
    if (tabLeft < usableLeft) {
      delta = tabLeft - (usableLeft + margin);
    } else {
      delta = tabRight - (usableRight - margin);
    }

    const left = Math.min(maxLeft, Math.max(0, row.scrollLeft + delta));
    if (Math.abs(left - row.scrollLeft) < 1) return;
    row.scrollTo({ left, behavior: "smooth" });
  }, [active]);

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

      if (currentSection !== activeRef.current) {
        updateActive(currentSection);
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
  }, [items, updateActive]);

  // 4) Click tab → jump for long distances, smooth-scroll for short ones (positions section header just below tabs)
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
                ref={(el) => {
                  tabBtnRefs.current[sec.id] = el;
                }}
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
