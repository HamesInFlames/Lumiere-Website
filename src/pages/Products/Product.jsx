import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct } from "../../lib/api";
import "../../styles/Product.css";

/** Display labels aligned with Menu.jsx section ids */
const CATEGORY_LABELS = {
  cakes: "Cakes",
  "personal-desserts": "Personal Desserts",
  onebite: "One-Bite Creations",
  pastries: "Pastries",
  bread: "Breads",
  "bakery-shelf": "Bakery Shelf",
};

function categoryLabel(categoryId) {
  if (!categoryId) return null;
  return (
    CATEGORY_LABELS[categoryId] ||
    categoryId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function ProductBreadcrumbs({ product, loading, error }) {
  const cat = product?.category;
  const catText = categoryLabel(cat);
  const showCategory = Boolean(product && cat && catText);

  return (
    <nav className="product-bc" aria-label="Breadcrumb">
      <ol className="product-bc__list">
        <li className="product-bc__item">
          <Link to="/" className="product-bc__link">
            Home
          </Link>
        </li>
        <li className="product-bc__item">
          <span className="product-bc__sep" aria-hidden="true">
            /
          </span>
          <Link to="/menu" className="product-bc__link">
            Menu
          </Link>
        </li>
        {showCategory && (
          <li className="product-bc__item">
            <span className="product-bc__sep" aria-hidden="true">
              /
            </span>
            <Link to={`/menu#${cat}`} className="product-bc__link">
              {catText}
            </Link>
          </li>
        )}
        <li className="product-bc__item">
          <span className="product-bc__sep" aria-hidden="true">
            /
          </span>
          {error ? (
            <span className="product-bc__current product-bc__current--muted">
              Unable to load
            </span>
          ) : loading ? (
            <span className="product-bc__current product-bc__current--muted">
              Loading…
            </span>
          ) : (
            <span className="product-bc__current" aria-current="page">
              {product.title}
            </span>
          )}
        </li>
      </ol>
    </nav>
  );
}

// Accordion item component with +/- toggle
function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`acc-item ${isOpen ? 'acc-item--open' : ''}`}>
      <button 
        className="acc-item__header" 
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="acc-item__title">{title}</span>
        <span className="acc-item__icon">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="acc-item__content">
          {children}
        </div>
      )}
    </div>
  );
}

// Image gallery with main image and thumbnails
function ProductGallery({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="product__gallery">
        <div className="gallery__main">
          <div className="ph" />
        </div>
      </div>
    );
  }

  return (
    <div className="product__gallery">
      <div className="gallery__main">
        <img src={images[selectedIndex]} alt={`${title}`} />
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              className={`gallery__thumb ${i === selectedIndex ? 'gallery__thumb--active' : ''}`}
              onClick={() => setSelectedIndex(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt={`${title} thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ok = true;
    fetchProduct(slug)
      .then((d) => ok && setP(d))
      .catch((e) => ok && setErr(e.message));
    return () => (ok = false);
  }, [slug]);

  if (err) {
    return (
      <div className="wrap">
        <ProductBreadcrumbs error={err} />
        <p className="product-bc__errorDetail">Error: {err}</p>
      </div>
    );
  }
  if (!p) {
    return (
      <div className="wrap">
        <ProductBreadcrumbs loading />
        <p>Loading…</p>
      </div>
    );
  }

  const gallery = p.images?.length ? p.images : (p.image ? [p.image] : []);

  return (
    <section className="product wrap">
      <ProductBreadcrumbs product={p} />
      <div className="product__grid">
        {/* Left side: product images with thumbnails */}
        <div className="product__media">
          <ProductGallery images={gallery} title={p.title} />
        </div>

        {/* Right side: info */}
        <div className="product__info">
          <h1 className="product__title">{p.title}</h1>
          {typeof p.price === "number" && (
            <div className="product__price">${p.price.toFixed(2)}</div>
          )}

          {/* Description & details with +/- accordion */}
          <div className="acc">
            {p.description && (
              <AccordionItem title="Description" defaultOpen={true}>
                <p>{p.description}</p>
              </AccordionItem>
            )}
            {(p.allergens || p.allergenFree) && (
              <AccordionItem title="Allergen Information" defaultOpen={true}>
                <div className="allergen-info">
                  {p.allergenFree && (
                    <div className="allergen-free">
                      <strong>Free From:</strong>
                      <span>{p.allergenFree.replace(/ Free/gi, '')}</span>
                    </div>
                  )}
                  {p.allergens && (
                    <div className="allergen-warning">
                      <strong>Contains:</strong>
                      <span>{p.allergens.replace(/has /gi, '')}</span>
                    </div>
                  )}
                </div>
              </AccordionItem>
            )}
            {p.ingredients && (
              <AccordionItem title="Ingredients" defaultOpen={true}>
                <p>{p.ingredients}</p>
              </AccordionItem>
            )}
            {p.serving_size && (
              <AccordionItem title="Serving Size" defaultOpen={true}>
                <p>{p.serving_size}</p>
              </AccordionItem>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
