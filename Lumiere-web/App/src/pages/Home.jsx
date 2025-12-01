// src/pages/Home.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import FavouritesCarousel from "../components/FavouritesCarousel";
import ShowcaseImage from "../components/ShowcaseImage";
import VisitUs from "../components/VisitUs";
import { fetchProducts } from "../lib/api";
import "../styles/Home.css";

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

function CategoryCard({ category, products, imageIndex = 0 }) {
  // Filter products with valid images
  const validProducts = useMemo(() => products.filter(p => p.image), [products]);

  if (!validProducts.length) return null;

  // Get current image based on passed index
  const currentProduct = validProducts[imageIndex % validProducts.length];
  const to = `/e-boutique#${category.id}`;

  return (
    <Link
      to={to}
      className="home-card"
      aria-label={category.label}
    >
      <img 
        src={currentProduct.image} 
        alt={category.label} 
        className="home-cardImg"
      />
      <div className="home-cardContent">
        <h2 className="home-cardTitle">{category.label}</h2>
      </div>
    </Link>
  );
}

const CATEGORIES = [
  { id: "cakes", label: "Cakes" },
  { id: "personal-desserts", label: "Personal Desserts" },
  { id: "onebite", label: "One-Bite Assortments" },
  { id: "pastries", label: "Pastries" },
  { id: "bread", label: "Breads" },
];

function PastriesSection() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageIndices, setImageIndices] = useState({});
  const prevRealIndexRef = useRef(0);

  useEffect(() => {
    fetchProducts()
      .then((allProducts) => {
        const grouped = {};
        const indices = {};
        CATEGORIES.forEach((cat) => {
          grouped[cat.id] = allProducts.filter((p) => p.category === cat.id);
          indices[cat.id] = 0;
        });
        setProductsByCategory(grouped);
        setImageIndices(indices);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Update only the category that just went out of view (one at a time)
  const handleSlideTransitionEnd = (swiper) => {
    const currentRealIndex = swiper.realIndex;
    const prevRealIndex = prevRealIndexRef.current;
    const totalSlides = CATEGORIES.length;
    
    // Only update if we actually moved
    if (currentRealIndex === prevRealIndex) return;
    
    // Determine direction and which category went out of view
    const movedForward = (currentRealIndex > prevRealIndex) || 
                         (prevRealIndex === totalSlides - 1 && currentRealIndex === 0);
    
    // The category that went out of view
    // If moving forward: it's the one that was "behind" the previous first visible
    // If moving backward: it's the one that was at the end of visible range
    const hiddenIndex = movedForward 
      ? prevRealIndex  // the first slide that was visible is now partially hidden
      : currentRealIndex;
    
    const hiddenCategory = CATEGORIES[hiddenIndex];
    if (hiddenCategory) {
      setImageIndices((prev) => ({
        ...prev,
        [hiddenCategory.id]: (prev[hiddenCategory.id] || 0) + 1
      }));
    }
    
    prevRealIndexRef.current = currentRealIndex;
  };

  if (loading) {
    return (
      <section className="home-section">
        <div className="home-containerWide">
          <h2 className="home-sectionTitle">Our Collections</h2>
          <div className="home-loading">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="home-section home-collectionsSection">
      <div className="home-containerWide">
        <div className="home-sectionHeader">
          <h2 className="home-sectionTitle">Patisserie</h2>
          <div className="home-sectionAccent" />
        </div>
        <div className="home-categoryCarousel">
          <Swiper
            modules={[Autoplay, A11y]}
            slidesPerView={3}
            spaceBetween={32}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            speed={800}
            loop={true}
            grabCursor={true}
            onSlideChangeTransitionEnd={handleSlideTransitionEnd}
            breakpoints={{
              0: { slidesPerView: 1.3, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
              1280: { slidesPerView: 4, spaceBetween: 32 },
            }}
          >
            {CATEGORIES.map((category) => {
              const products = productsByCategory[category.id] || [];
              if (!products.length) return null;
              
              return (
                <SwiperSlide key={category.id}>
                  <CategoryCard 
                    category={category} 
                    products={products} 
                    imageIndex={imageIndices[category.id] || 0}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
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
          <img src="/Bitters.png" alt="Gift box selection" className="home-giftImg" />
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
