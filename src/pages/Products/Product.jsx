import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../../lib/api";
import "../../styles/Product.css";

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

          {/* Description & details */}
          <div className="acc">
            {p.description && (
              <details open>
                <summary>Description</summary>
                <div>{p.description}</div>
              </details>
            )}
            {p.ingredients && (
              <details>
                <summary>Ingredients</summary>
                <div>{p.ingredients}</div>
              </details>
            )}
            {p.allergens && (
              <details>
                <summary>Allergens</summary>
                <div>{p.allergens}</div>
              </details>
            )}
            {p.serving_size && (
              <details>
                <summary>Serving size</summary>
                <div>{p.serving_size}</div>
              </details>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
