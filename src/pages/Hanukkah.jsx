// src/pages/Hanukkah.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePageMeta } from "../lib/usePageMeta";
import { pageMeta } from "../lib/seo";
import {
  HANUKKAH_FORM_URL,
  HANUKKAH_TITLE,
  HANUKKAH_INTRO,
  HANUKKAH_TIERS,
  HANUKKAH_DAYS,
  HANUKKAH_STEPS,
  HANUKKAH_NOTE,
  HANUKKAH_CLOSING,
  HANUKKAH_FLAVOURS,
  IMAGE_BASE,
  formatTierPrice,
} from "../lib/hanukkah";
import "../styles/Hanukkah.css";

const STEP_COLOURS = ["#F6A6D5", "#9AD3FF", "#7AE1C9"];

/** Link to the Google Form in a new tab, or a disabled state while the URL is empty. */
function PreOrderButton({ className = "" }) {
  if (!HANUKKAH_FORM_URL) {
    return (
      <button type="button" className={`hk-btn is-disabled ${className}`} disabled>
        Pre-orders open soon
      </button>
    );
  }
  return (
    <a
      className={`hk-btn ${className}`}
      href={HANUKKAH_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      Pre-order now
    </a>
  );
}

function Lightbox({ index, onClose, onStep }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const flavour = HANUKKAH_FLAVOURS[index];

  // Focus moves into the dialog on open.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Esc closes, arrows move between flavours, Tab is kept inside the dialog.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        onStep(-1);
      } else if (e.key === "ArrowRight") {
        onStep(1);
      } else if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll("button");
        if (!focusable || !focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  return (
    <div className="hk-lightbox" onClick={onClose}>
      <div
        ref={dialogRef}
        className="hk-lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hk-lightbox-name"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="hk-lightbox-close"
          aria-label="Close photo"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
        <button
          type="button"
          className="hk-lightbox-nav is-prev"
          aria-label="Previous flavour"
          onClick={() => onStep(-1)}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          type="button"
          className="hk-lightbox-nav is-next"
          aria-label="Next flavour"
          onClick={() => onStep(1)}
        >
          <span aria-hidden="true">›</span>
        </button>
        <img
          key={flavour.slug}
          className="hk-lightbox-img"
          src={`${IMAGE_BASE}/${flavour.slug}.webp`}
          alt={`${flavour.name} sufganiyah`}
          width="800"
          height="800"
        />
        <div className="hk-lightbox-caption" aria-live="polite">
          <h2 id="hk-lightbox-name">{flavour.name}</h2>
          <p>
            {flavour.tier} · {formatTierPrice(flavour.price)} each
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Hanukkah() {
  usePageMeta(pageMeta("hanukkah"), null);

  const [openIndex, setOpenIndex] = useState(null);
  const [hideSticky, setHideSticky] = useState(false);
  const triggerRef = useRef(null);
  const closingRef = useRef(null);

  const openAt = (i, e) => {
    triggerRef.current = e.currentTarget;
    setOpenIndex(i);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    // Return focus to the tile that opened the lightbox.
    const el = triggerRef.current;
    if (el) requestAnimationFrame(() => el.focus());
  }, []);

  const step = useCallback((dir) => {
    setOpenIndex((i) =>
      i === null ? i : (i + dir + HANUKKAH_FLAVOURS.length) % HANUKKAH_FLAVOURS.length
    );
  }, []);

  // Lock body scroll while the lightbox is open.
  const isOpen = openIndex !== null;
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [isOpen]);

  // The mobile sticky bar steps aside once the closing bar (same button) is reached,
  // so it never sits on top of the end of the page.
  useEffect(() => {
    const el = closingRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([entry]) => {
      setHideSticky(entry.isIntersecting || entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let flavourIndex = -1;

  return (
    <div className="hk-page">
      <div className="hk-top">
        <div>
          <h1>{HANUKKAH_TITLE}</h1>
          <p>{HANUKKAH_INTRO}</p>
        </div>
        <PreOrderButton className="hk-top-btn" />
      </div>

      <section className="hk-steps" aria-label="How pre-order works">
        {HANUKKAH_STEPS.map((s, i) => (
          <div className="hk-step" key={s.title}>
            <span className="hk-step-num" style={{ background: STEP_COLOURS[i] }}>
              {i + 1}
            </span>
            <div>
              <b>{s.title}</b>
              <span>{s.text}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="hk-when" aria-label="Pickup days">
        <h2>Pickup days</h2>
        <ul className="hk-chips">
          {HANUKKAH_DAYS.map((d) => (
            <li key={d.label} className={`hk-chip ${d.closed ? "is-closed" : ""}`}>
              {d.label}
            </li>
          ))}
        </ul>
      </section>

      {HANUKKAH_TIERS.map((tier) => (
        <section className="hk-group" key={tier.id} aria-labelledby={`hk-${tier.id}`}>
          <div className="hk-ghead">
            <h2 id={`hk-${tier.id}`}>{tier.label}</h2>
            <span>{formatTierPrice(tier.price)} each</span>
          </div>
          <div className="hk-grid">
            {tier.flavours.map((f) => {
              flavourIndex += 1;
              const i = flavourIndex;
              return (
                <button
                  type="button"
                  className="hk-item"
                  key={f.slug}
                  onClick={(e) => openAt(i, e)}
                  aria-haspopup="dialog"
                  aria-label={`${f.name}, view larger photo`}
                >
                  <span className="hk-imgwrap">
                    <img
                      src={`${IMAGE_BASE}/${f.slug}-400.webp`}
                      srcSet={`${IMAGE_BASE}/${f.slug}-400.webp 400w, ${IMAGE_BASE}/${f.slug}.webp 800w`}
                      sizes="(max-width: 600px) 45vw, (max-width: 1100px) 22vw, 160px"
                      alt=""
                      loading="lazy"
                      width="400"
                      height="400"
                    />
                  </span>
                  <span className="hk-name">{f.name}</span>
                </button>
              );
            })}
            {tier.id === "classic" && (
              <div className="hk-note">
                <b>{HANUKKAH_NOTE.title}</b>
                <span>{HANUKKAH_NOTE.text}</span>
              </div>
            )}
          </div>
        </section>
      ))}

      <div className="hk-after" ref={closingRef}>
        <p>
          {HANUKKAH_CLOSING.title}
          <span>{HANUKKAH_CLOSING.text}</span>
        </p>
        <PreOrderButton />
      </div>

      <div className={`hk-sticky ${hideSticky ? "is-hidden" : ""}`}>
        <div>
          <b>Pickup Dec 4 – 12</b>
          Pay in the shop
        </div>
        <PreOrderButton />
      </div>

      {isOpen && <Lightbox index={openIndex} onClose={close} onStep={step} />}
    </div>
  );
}
