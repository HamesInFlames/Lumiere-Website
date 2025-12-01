import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { fetchProducts } from "../lib/api";

const styles = {
  section: { padding: "80px 0", background: "#fafafa" },
  container: { maxWidth: 1440, margin: "0 auto", padding: "0 24px" },

  headingRow: {
    textAlign: "center",
    marginBottom: 48,
  },
  h2: {
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    fontWeight: 400,
    letterSpacing: "0.01em",
    margin: "0 0 16px",
    color: "#3a3a3a",
  },
  h2Link: { color: "inherit", textDecoration: "none" },
  accent: {
    width: 44,
    height: 3,
    borderRadius: 2,
    margin: "0 auto",
    background: "linear-gradient(90deg, #f6a6d5, #c7b3ff, #9ad3ff)",
  },

  imgBox: {
    position: "relative",
    width: "100%",
    paddingTop: "100%",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(0,0,0,.10)",
    background: "#f6f6f6",
  },
  img: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity .35s ease",
  },

  captionLink: { display: "block", marginTop: 10, textDecoration: "none", color: "#222" },
  title: { display: "block", fontWeight: 700, fontSize: "clamp(14px, 3vw, 18px)", marginBottom: 4, lineHeight: 1.3 },
  price: { fontWeight: 600, color: "#333", fontSize: "clamp(13px, 3vw, 16px)" },
};

/* Utility: pick random unique items */
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/* Helper to cache with expiry */
function setCache(key, data, ttlMs) {
  const record = { data, expires: Date.now() + ttlMs };
  localStorage.setItem(key, JSON.stringify(record));
}

function getCache(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const record = JSON.parse(raw);
    if (record.expires > Date.now()) return record.data;
  } catch {}
  return null;
}

function ProductCard({ p }) {
  const [hover, setHover] = useState(false);
  const second = p.images?.[1] || p.image;

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={styles.imgBox}>
        <img src={p.image} alt={p.title} style={{ ...styles.img, opacity: hover ? 0 : 1 }} />
        {second && (
          <img src={second} alt={p.title} style={{ ...styles.img, opacity: hover ? 1 : 0 }} />
        )}
      </div>

      <Link to={`/product/${p.slug}`} style={styles.captionLink}>
        <span style={styles.title}>{p.title}</span>
        <div style={styles.price}>${(p.price ?? 0).toFixed(2)}</div>
      </Link>
    </div>
  );
}

export default function FavouritesCarousel() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const cacheKey = "todays-favourites";
    const cached = getCache(cacheKey);

    if (cached) {
      setFavourites(cached);
      return;
    }

    // Fetch products then randomize
    fetchProducts()
      .then((products) => {
        if (!Array.isArray(products)) return;
        const randomItems = getRandomItems(products, 5);
        setFavourites(randomItems);
        setCache(cacheKey, randomItems, 5 * 60 * 1000); // 5 minutes cache
      })
      .catch((err) => console.error("Error fetching favourites:", err));
  }, []);

  if (!favourites.length) return null;

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.headingRow}>
          <h2 style={styles.h2}>
            <Link to="/e-boutique" style={styles.h2Link}>
              Today&apos;s Favourites
            </Link>
          </h2>
          <div style={styles.accent} />
        </div>

        <Swiper
          modules={[Navigation, Scrollbar, A11y]}
          slidesPerView={3}
          spaceBetween={20}
          navigation
          scrollbar={{ draggable: true }}
          breakpoints={{
            0: { slidesPerView: 1.2, spaceBetween: 14 },
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          style={{ paddingBottom: 32 }}
        >
          {favourites.map((p) => (
            <SwiperSlide key={p.id}>
              <ProductCard p={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
