// App/src/pages/Products/Product.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../../lib/api";
import "../../styles/Product.css";

export default function ProductPage() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let ok = true;
    fetchProduct(slug)
      .then((d) => ok && setP(d))
      .catch((e) => ok && setErr(e.message));
    return () => (ok = false);
  }, [slug]);

  if (err) return <div className="wrap"><p>Error: {err}</p></div>;
  if (!p) return <div className="wrap"><p>Loading…</p></div>;

  const addToCart = () => {
    console.log("Add to cart", { id: p.id, qty });
    alert("Added to cart");
  };

  const gallery = p.images?.length ? p.images : (p.image ? [p.image] : []);

  return (
    <section className="product wrap">
      <div className="product__grid">
        <div className="product__media">
          {(gallery.length ? gallery : [null]).map((src, i) => (
            <div key={i} className="media__item">
              {src ? <img src={src} alt={`${p.title} ${i + 1}`} /> : <div className="ph" />}
            </div>
          ))}
        </div>

        <div className="product__info">
          <h1 className="product__title">{p.title}</h1>
          <div className="product__price">${(p.price ?? 0).toFixed(2)}</div>

          <div className="product__buy">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <input value={qty} onChange={(e)=>setQty(Math.max(1, Number(e.target.value)||1))}/>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn-grad" onClick={addToCart}>Add to Cart</button>
          </div>

          <div className="acc">
            {p.serving_size && <details><summary>Serving size</summary><div>{p.serving_size}</div></details>}
            {p.ingredients && <details><summary>Ingredients</summary><div>{p.ingredients}</div></details>}
            {p.allergens && <details><summary>Allergens</summary><div>{p.allergens}</div></details>}
            {p.description && <details open><summary>Description</summary><div>{p.description}</div></details>}
          </div>
        </div>
      </div>
    </section>
  );
}
