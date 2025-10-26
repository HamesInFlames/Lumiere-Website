import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Header.css";

const EB_LINKS = [
  { label: "Cakes", to: "/products?category=cakes", keys: ["cake", "cakes"] },
  { label: "Personal Desserts", to: "/products?category=personal-desserts", keys: ["personal", "petit", "dessert", "desserts"] },
  { label: "One-Bite Creations", to: "/products?category=onebite", keys: ["one bite", "one-bite", "biters", "one bite creations"] },
  { label: "Bread", to: "/products?category=bread", keys: ["bread", "breads", "loaf"] },
  { label: "Pastries", to: "/products?category=pastries", keys: ["pastry", "pastries", "croissant"] },
  { label: "Shelf", to: "/products?category=bakery-shelf", keys: ["shelf", "bakery shelf"] },
];

export default function Header({ onHeight }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);
  const [hoverHome, setHoverHome] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const ebRef = useRef(null);
  const searchRef = useRef(null);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isEBActive = ["/e-boutique", "/pages/e-boutique"]
    .concat(EB_LINKS.map((l) => l.to.split("?")[0])) // only path part
    .some((p) => location.pathname.startsWith(p));
  const isContactActive = location.pathname.startsWith("/contact");
  const isHomeActive = location.pathname === "/";

  // shadow on scroll + report height
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const measure = () => onHeight?.(rootRef.current?.offsetHeight || 0);
    onScroll(); measure();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", measure);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", measure); };
  }, [onHeight]);

  // outside click, keyboard shortcuts
  useEffect(() => {
    const onDocClick = (e) => {
      if (ebRef.current && !ebRef.current.contains(e.target)) setOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); setSearchOpen(false); inputRef.current?.blur(); }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDocClick); document.removeEventListener("keydown", onKey); };
  }, []);

  const runSearch = (term) => {
    const s = term.trim().toLowerCase();
    if (!s) return;
    for (const link of EB_LINKS) {
      if (link.keys?.some((k) => s.includes(k))) { navigate(link.to); setSearchOpen(false); return; }
    }
    const params = new URLSearchParams({ q: s });
    navigate(`/e-boutique?${params.toString()}`);
    setSearchOpen(false);
  };
  const submitSearch = (e) => { e.preventDefault(); runSearch(q); };

  return (
    <header
      ref={rootRef}
      className={`site-header ${scrolled ? "is-scrolled" : ""}`}
      role="banner"
      aria-label="Lumière Pastries global header"
    >
      <div className="header-bar">
        <div className="header-grid">
          {/* Left — logo */}
          <div className="logo-box">
            <Link to="/" className="logo-link" aria-label="Lumière Pastries – Home">
              <img src="/lumiere.png" alt="Lumière Pastries" className="logo-img" />
            </Link>
          </div>

          {/* Center — nav */}
          <nav className="nav-wrap" aria-label="Primary">
            <ul className="nav">
              <li
                className="nav-item"
                onMouseEnter={() => setHoverHome(true)}
                onMouseLeave={() => setHoverHome(false)}
              >
                <Link to="/" className="nav-link">Home</Link>
                <span className={`nav-underline ${hoverHome || isHomeActive ? "visible" : ""}`} />
              </li>

              <li
                ref={ebRef}
                className={`nav-item eb ${open ? "open" : ""}`}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <Link to="/e-boutique" className="nav-link" aria-haspopup="menu" aria-expanded={open}>Menu</Link>
                <span className={`nav-underline ${open || isEBActive ? "visible" : ""}`} />
                <div className="dropdown" role="menu">
                  {EB_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="dropdown-link"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </li>

              <li
                className="nav-item"
                onMouseEnter={() => setHoverContact(true)}
                onMouseLeave={() => setHoverContact(false)}
              >
                <Link to="/contact" className="nav-link">Contact Us</Link>
                <span className={`nav-underline ${hoverContact || isContactActive ? "visible" : ""}`} />
              </li>
            </ul>
          </nav>

          {/* Right — search (overlay; width reserved so nav is always centered) */}
          {/* <div className="right">
            <form
              ref={searchRef}
              onSubmit={submitSearch}
              className={`search ${searchOpen ? "is-open" : ""}`}
              onFocus={() => setSearchOpen(true)}
            >
              <button
                type="submit"
                className="search-btn"
                aria-label="Search"
                title="Search (press / to focus)"
                onClick={() => {
                  if (!searchOpen) {
                    setSearchOpen(true);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <input
                ref={inputRef}
                type="search"
                className="search-input"
                placeholder={searchOpen ? "Search cakes, pastries…" : ""}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={() => setSearchOpen(false)}
                aria-label="Search products"
              />
            </form>
          </div> */}
        </div>
      </div>
    </header>
  );
}
