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
            href="https://www.google.com/maps/place/Lumi%C3%A8re+P%C3%A2tisserie/@43.8089994,-79.4643976,17z/data=!3m2!4b1!5s0x882b2c2571548749:0xb2d5338425c0ba65!4m6!3m5!1s0x882b2d3656ef54a1:0xfc1b28b01a017991!8m2!3d43.8089956!4d-79.4618227!16s%2Fg%2F11r_dmkggr"
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
