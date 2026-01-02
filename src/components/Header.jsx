import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

export default function Header({ onHeight }) {
  const [scrolled, setScrolled] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);
  const [hoverHome, setHoverHome] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const rootRef = useRef(null);
  const location = useLocation();

  const isHomeActive = location.pathname === "/";
  const isEBActive = location.pathname.startsWith("/e-boutique");
  const isContactActive = location.pathname.startsWith("/contact");

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      {/* Dark overlay with blur */}
      <div 
        className={`mobile-overlay ${mobileOpen ? "active" : ""}`} 
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header
        ref={rootRef}
        className={`site-header ${scrolled ? "is-scrolled" : ""}`}
        role="banner"
        aria-label="Lumière Pastries global header"
      >
        <div className="header-bar">
          <div className="header-grid">

            {/* UBER EATS LINK (Mobile: left side) */}
            <a 
              href="https://www.ubereats.com/ca/store/lumiere-patisserie/rhZJeBGrXv-V50R2q2ufkw?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMjY3JTIwQWJpdGliaSUyMEF2ZSUyMiUyQyUyMnJlZmVyZW5jZSUyMiUzQSUyMjZjODM5NWRmLWNiNTAtZDNjNS1lMDNjLTVhZWFkMzRhYmUzZSUyMiUyQyUyMnJlZmVyZW5jZVR5cGUlMjIlM0ElMjJ1YmVyX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBNDMuNzk3MTU4MSUyQyUyMmxvbmdpdHVkZSUyMiUzQS03OS40MTQ2Nzg4JTdE"
              target="_blank"
              rel="noopener noreferrer"
              className="uber-eats-link"
              aria-label="Order on Uber Eats"
            >
              <img src="/Uber-Eats-logo.png" alt="Uber Eats" className="uber-logo-img" />
            </a>

            {/* LOGO */}
            <div className="logo-box">
              <Link to="/" className="logo-link" onClick={closeMenu}>
                <img src="/lumiere.png" alt="Lumière Pastries" className="logo-img" />
              </Link>
            </div>

            {/* NAVIGATION */}
            <nav className={`nav-wrap ${mobileOpen ? "mobile-open" : ""}`} aria-label="Primary">
              <ul className="nav">

                {/* HOME */}
                <li
                  className="nav-item"
                  onMouseEnter={() => setHoverHome(true)}
                  onMouseLeave={() => setHoverHome(false)}
                >
                  <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
                  <span className={`nav-underline ${hoverHome || isHomeActive ? "visible" : ""}`} />
                </li>

                {/* MENU (NO DROPDOWN) */}
                <li className="nav-item">
                  <Link to="/e-boutique" className="nav-link" onClick={closeMenu}>Menu</Link>
                  <span className={`nav-underline ${isEBActive ? "visible" : ""}`} />
                </li>

                {/* CONTACT */}
                <li
                  className="nav-item"
                  onMouseEnter={() => setHoverContact(true)}
                  onMouseLeave={() => setHoverContact(false)}
                >
                  <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact Us</Link>
                  <span className={`nav-underline ${hoverContact || isContactActive ? "visible" : ""}`} />
                </li>

              </ul>
            </nav>

            {/* UBER EATS (Desktop: right side) */}
            <div className="right-actions">
              <a 
                href="https://www.ubereats.com/ca/store/lumiere-patisserie/rhZJeBGrXv-V50R2q2ufkw?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMjY3JTIwQWJpdGliaSUyMEF2ZSUyMiUyQyUyMnJlZmVyZW5jZSUyMiUzQSUyMjZjODM5NWRmLWNiNTAtZDNjNS1lMDNjLTVhZWFkMzRhYmUzZSUyMiUyQyUyMnJlZmVyZW5jZVR5cGUlMjIlM0ElMjJ1YmVyX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBNDMuNzk3MTU4MSUyQyUyMmxvbmdpdHVkZSUyMiUzQS03OS40MTQ2Nzg4JTdE"
                target="_blank"
                rel="noopener noreferrer"
                className="uber-eats-btn"
                aria-label="Order on Uber Eats"
              >
                <img src="/Uber-Eats-logo.png" alt="Uber Eats" className="uber-logo-img" />
              </a>
            </div>

            {/* HAMBURGER MENU BUTTON */}
            <button
              className={`hamburger ${mobileOpen ? "open" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>
        </div>
      </header>
    </>
  );
}
