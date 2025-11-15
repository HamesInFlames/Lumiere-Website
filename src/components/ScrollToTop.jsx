// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If a hash is present, try to scroll to that element; otherwise go to top.
    if (hash) {
      // let the page render first
      requestAnimationFrame(() => {
        const id = hash.replace(/^#/, "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, search, hash]);

  return null;
}
