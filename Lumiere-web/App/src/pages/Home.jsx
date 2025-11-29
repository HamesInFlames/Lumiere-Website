// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import FavouritesCarousel from "../components/FavouritesCarousel";
import ShowcaseImage from "../components/ShowcaseImage";
import VisitUs from "../components/VisitUs";
import "../styles/Home.css";

/* public/ images */
const cakesImg = "/Noisette%20Noir.png";
const personalDessertsImg = "/Sweet.png";
const oneBiteImg = "/Bitters.png";

function Hero() {
  return (
    <section className="home-hero">
      <img className="home-heroImg" alt="Hero dessert" src="/desserts.webp" />
      <div className="home-heroOverlay" />
      <div className="home-container home-heroInner">
        <div className="home-heroContent">
          <h1 className="home-heroH1">Artfully Crafted, Made for Sharing</h1>
          {/* Go to the new products index */}
          <Link to="/e-boutique" className="home-cta">BROWSE MENU</Link>
        </div>
      </div>
    </section>
  );
}

function PastriesSection() {
  const cards = [
    { title: "Cakes",               img: cakesImg,            to: "/products?category=cakes" },
    { title: "Personal Desserts",   img: personalDessertsImg, to: "/products?category=personal-desserts" },
    { title: "One-Bite Assortments",img: oneBiteImg,          to: "/products?category=onebite" },
  ];

  return (
    <section className="home-section">
      <div className="home-containerWide">
        <h2 className="home-sectionTitle">Pastries</h2>
        <div className="home-grid3">
          {cards.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="home-card"
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
              }}
              aria-label={c.title}
            >
              <img src={c.img} alt={c.title} className="home-cardImg" />
              <div className="home-overlayFlush">
                <h2 className="home-titleLarge">{c.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GiftBoxes() {
  return (
    <section className="home-giftSection">
      <div className="home-giftGrid">
        <div className="home-giftImgWrap">
          <img src={oneBiteImg} alt="Gift box selection" className="home-giftImg" />
        </div>
        <div className="home-giftTextCol">
          <h2 className="home-giftH2">Illuminate a moment</h2>
          <div className="home-giftAccent" />
          <p className="home-giftP">
            Immerse yourself in the artistry of taste and embark on a journey of unparalleled pleasure
          </p>
          {/* Link to a relevant category in the new products index */}
          <Link to="/e-boutique" className="home-giftBtn">
            SEE OUR MENU
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Hero />
      <PastriesSection />
      <GiftBoxes />
      <FavouritesCarousel />
      <ShowcaseImage imgSrc="/Lumière.png" objectPosition="center right" />
      <VisitUs />
    </div>
  );
}
