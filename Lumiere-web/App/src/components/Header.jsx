import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

// Icon components
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const UberEatsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.6 4.8h1.2v6h3.6v1.2h-4.8V4.8zm-4.8 0h1.2v7.2H6.6V4.8zm0 8.4h1.2v1.2H6.6v-1.2zm10.8 5.4c-.9.6-2.1.9-3.3.9-3.3 0-6-2.7-6-6h1.2c0 2.7 2.1 4.8 4.8 4.8.9 0 1.8-.3 2.4-.6l.9.9z"/>
  </svg>
);

export default function Header({ onHeight }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);
  const [hoverHome, setHoverHome] = useState(false);
  const [hoverMenu, setHoverMenu] = useState(false);

  const rootRef = useRef(null);
  const location = useLocation();

  const isHomeActive = location.pathname === "/";
  const isEBActive = location.pathname.startsWith("/e-boutique") || location.pathname.startsWith("/product");
  const isContactActive = location.pathname.startsWith("/contact");

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Header shadow + height reporting
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const measure = () => onHeight?.(rootRef.current?.offsetHeight || 0);

    onScroll();
    measure();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [onHeight]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      ref={rootRef}
      className={`site-header ${scrolled ? "is-scrolled" : ""}`}
      role="banner"
      aria-label="Lumière Pastries global header"
    >
      {/* Top announcement bar with phone & socials */}
      <div className="header-top">
        <div className="header-top-inner">
          <a href="tel:+16472938815" className="header-phone">
            <PhoneIcon />
            <span>(647) 293-8815</span>
          </a>
          <span className="header-tagline">Fresh pastries baked daily in Thornhill</span>
          <div className="header-socials">
            <a 
              href="https://www.instagram.com/lumierepatisserie.to" 
              target="_blank" 
              rel="noopener noreferrer"
              className="header-social-link"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a 
              href="https://www.facebook.com/Lumierepatisserietoronto/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="header-social-link"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a 
              href="https://www.ubereats.com/ca/store/lumiere-patisserie/rhZJeBGrXv-V50R2q2ufkw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="header-social-link header-social-link--uber"
              aria-label="Order on Uber Eats"
            >
              <UberEatsIcon />
              <span>Order</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main header bar */}
      <div className="header-bar">
        <div className="header-grid">

          {/* LOGO */}
          <div className="logo-box">
            <Link to="/" className="logo-link">
              <img src="/lumiere.png" alt="Lumière Pastries" className="logo-img" />
            </Link>
          </div>

          {/* CENTER NAV (desktop) */}
          <nav className={`nav-wrap ${menuOpen ? "is-open" : ""}`} aria-label="Primary">
            {/* Mobile phone in drawer */}
            <a href="tel:+16472938815" className="mobile-phone">
              <PhoneIcon />
              <span>(647) 293-8815</span>
            </a>

            {/* Mobile social links */}
            <div className="mobile-socials">
              <a 
                href="https://www.instagram.com/lumierepatisserie.to" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-social-link"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a 
                href="https://www.facebook.com/Lumierepatisserietoronto/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-social-link"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a 
                href="https://www.ubereats.com/ca/store/lumiere-patisserie/rhZJeBGrXv-V50R2q2ufkw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-social-link mobile-social-link--uber"
                aria-label="Order on Uber Eats"
              >
                <UberEatsIcon />
                <span>Uber Eats</span>
              </a>
            </div>

            <ul className="nav">
              {/* HOME */}
              <li
                className="nav-item"
                onMouseEnter={() => setHoverHome(true)}
                onMouseLeave={() => setHoverHome(false)}
              >
                <Link to="/" className="nav-link">Home</Link>
                <span className={`nav-underline ${hoverHome || isHomeActive ? "visible" : ""}`} />
              </li>

              {/* MENU */}
              <li
                className="nav-item"
                onMouseEnter={() => setHoverMenu(true)}
                onMouseLeave={() => setHoverMenu(false)}
              >
                <Link to="/e-boutique" className="nav-link">Menu</Link>
                <span className={`nav-underline ${hoverMenu || isEBActive ? "visible" : ""}`} />
              </li>

              {/* CONTACT */}
              <li
                className="nav-item"
                onMouseEnter={() => setHoverContact(true)}
                onMouseLeave={() => setHoverContact(false)}
              >
                <Link to="/contact" className="nav-link">Contact</Link>
                <span className={`nav-underline ${hoverContact || isContactActive ? "visible" : ""}`} />
              </li>
            </ul>
          </nav>

          {/* RIGHT SIDE - Phone CTA (desktop) */}
          <div className="header-right">
            <a href="tel:+16472938815" className="header-cta">
              <PhoneIcon />
              <span>Call Us</span>
            </a>
          </div>

          {/* HAMBURGER BUTTON (mobile only) */}
          <button
            className={`hamburger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          {/* Overlay for mobile menu */}
          {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}

        </div>
      </div>
    </header>
  );
}
