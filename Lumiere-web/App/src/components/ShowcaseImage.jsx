// src/components/ShowcaseImage.jsx
import React from "react";

export default function ShowcaseImage({
  imgSrc = "/Lumiere.png",          // put your image in /public
  alt = "Lumière interior",
  objectPosition = "center right",  // matches the Shopify block
  aspect = "40%",                     // controls height (40% = more panoramic)
}) {
  const wrap = { maxWidth: 1440, margin: "0 auto", padding: "0 24px" };

  const card = {
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 24px 56px rgba(0,0,0,.12)",
    background: "#f7f7f7",
    borderRadius: 16,
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
    <section style={{ padding: "80px 0", background: "#fff" }}>
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
