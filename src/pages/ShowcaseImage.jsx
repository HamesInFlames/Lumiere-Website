// src/components/ShowcaseImage.jsx
import React from "react";

export default function ShowcaseImage({
  imgSrc = "/Lumiere.png",          // put your image in /public
  alt = "Lumière interior",
  objectPosition = "center right",  // matches the Shopify block
  aspect = "56.25%",                 // controls height (62.5% ≈ 16:10)
}) {
  const wrap = { maxWidth: 1240, margin: "0 auto", padding: "0 24px" };

  const card = {
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 18px 44px rgba(0,0,0,.12)",
    background: "#f7f7f7",
  };

  const ratio = {
    position: "relative",
    width: "100%",
    paddingTop: aspect, // responsive aspect ratio
  };

  const img = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",         // <<< fills the box – no extra space
    objectFit: "cover",
    objectPosition,
    display: "block",
    transform: "scale(1)",
    transition: "transform .8s ease",
  };

  return (
    <section style={{ padding: "72px 0" }}>
      <div style={wrap}>
        <div style={card}>
          <div style={ratio}>
            <img
              src={imgSrc}
              alt={alt}
              style={img}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
