import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

export default function Header({ onHeight }) {
  const [scrolled, setScrolled] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);
  const [hoverHome, setHoverHome] = useState(false);

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

  return (
    <header
      ref={rootRef}
      className={`site-header ${scrolled ? "is-scrolled" : ""}`}
      role="banner"
      aria-label="Lumière Pastries global header"
    >
      <div className="header-bar">
        <div className="header-grid">

          {/* LOGO */}
          <div className="logo-box">
            <Link to="/" className="logo-link">
              <img src="/lumiere.png" alt="Lumière Pastries" className="logo-img" />
            </Link>
          </div>

          {/* NAVIGATION */}
          <nav className="nav-wrap" aria-label="Primary">
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

              {/* MENU (NO DROPDOWN) */}
              <li className="nav-item">
                <Link to="/e-boutique" className="nav-link">Menu</Link>
                <span className={`nav-underline ${isEBActive ? "visible" : ""}`} />
              </li>

              {/* CONTACT */}
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

        </div>
      </div>
    </header>
  );
}
