import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wrap">
        <div className="footer-grid">
          {/* Col 1 — Tagline + Social */}
          <div>
            <h6 className="footer-title">Oh La La!</h6>
            <h4 className="footer-subtitle">We bake with love. Join us</h4>

            <div className="footer-socials">
              {/* Facebook */}
              <a
                aria-label="Facebook"
                href="https://www.facebook.com/Lumierepatisserietoronto/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
              >
                <svg viewBox="0 0 9 17" width="14" height="14" fill="currentColor">
                  <path d="M5.842 17V9.246h2.653l.398-3.023h-3.05v-1.93c0-.874.246-1.47 1.526-1.47H9V.118C8.718.082 7.75 0 6.623 0 4.27 0 2.66 1.408 2.66 3.994v2.23H0v3.022h2.66V17h3.182z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                aria-label="Instagram"
                href="https://www.instagram.com/lumierepatisserie.to"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Uber Eats */}
              <a
                aria-label="Order on Uber Eats"
                href="https://www.ubereats.com/ca/store/lumiere-patisserie/rhZJeBGrXv-V50R2q2ufkw"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn footer-uber-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 11.5v.5h-1v-.5c0-.28-.22-.5-.5-.5H18v3h-1v-7h2.5c.83 0 1.5.67 1.5 1.5v.5c0 .55-.3 1.05-.78 1.32.48.17.78.64.78 1.18zm-3-2.5v1.5h1.5c.28 0 .5-.22.5-.5v-.5c0-.28-.22-.5-.5-.5H18zm-4 4.5h-1.5c-.83 0-1.5-.67-1.5-1.5v-4c0-.83.67-1.5 1.5-1.5H14c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5zm-2-1.5c0 .28.22.5.5.5H14c.28 0 .5-.22.5-.5V8c0-.28-.22-.5-.5-.5h-1.5c-.28 0-.5.22-.5.5v4zM8 13.5h-1v-7h2.5c.83 0 1.5.67 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5H8v3zm0-4h1.5c.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5H8v2zM5 13.5H2c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v5c0 .55-.45 1-1 1zm-3-6v5h3v-5H2z"/>
                </svg>
                <span>Order</span>
              </a>
            </div>
          </div>

          {/* Col 2 — Menu */}
          <div>
            <h6 className="footer-title">Lumiere Patisserie</h6>
            <ul className="footer-list">
              <li><Link to="/e-boutique" className="footer-link">Menu</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <p className="footer-text">
              <strong>For orders or questions</strong><br />
              <a href="tel:+16472938815" className="footer-link" style={{ fontWeight: 700 }}>(647) 293-8815</a>
            </p>
            <p className="footer-text">1102 Centre St #1, Thornhill, ON L4J 3M8</p>
          </div>
        </div>

        {/* bottom bar */}
        <div className="footer-small">
          <span>© {new Date().getFullYear()} Lumière Patisserie</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
