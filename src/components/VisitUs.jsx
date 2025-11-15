import React from "react";
import { Link } from "react-router-dom";
import "../styles/VisitUs.css";

export default function VisitUs() {
  return (
    <section className="visit-section">
      <div className="visit-wrap">
        <h2 className="visit-title">Visit us</h2>

        <p className="visit-blurb">
          We are located in Thornhill, Ontario. Come by to experience the rich
          flavours of Ontario inspired by the craft of France.
        </p>

        <div className="visit-row">
          {/* Internal SPA navigation */}
          <Link to="/contact" className="visit-btn visit-btn-filled" role="button">
            Contact us
          </Link>

          {/* External new tab */}
          <a
            className="visit-btn visit-btn-outline"
            href="https://www.google.com/maps/place/1102+Centre+St+%231,+Thornhill,+ON+L4J+3M8"
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions on Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
