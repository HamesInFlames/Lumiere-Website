import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../../lib/api";
import "../../styles/Product.css";

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

  if (err) return <div className="wrap"><p>Error: {err}</p></div>;
  if (!p) return <div className="wrap"><p>Loading…</p></div>;

  const gallery = p.images?.length ? p.images : (p.image ? [p.image] : []);

  return (
    <section className="product wrap">
      <div className="product__grid">
        {/* Left side: product images */}
        <div className="product__media">
          {(gallery.length ? gallery : [null]).map((src, i) => (
            <div key={i} className="media__item">
              {src ? <img src={src} alt={`${p.title} ${i + 1}`} /> : <div className="ph" />}
            </div>
          ))}
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
