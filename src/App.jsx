import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useSearchParams } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Contact from "./pages/Contact.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProductPage from "./pages/Products/Product";

function ProductsRedirect() {
  const [params] = useSearchParams();
  const category = params.get("category");
  if (category) return <Navigate to={`/menu#${category}`} replace />;
  return <Navigate to="/menu" replace />;
}

function MainContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <main style={{ paddingTop: isHome ? 0 : "var(--header-h, 72px)", paddingBottom: 80 }}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pages/contact" element={<Navigate to="/contact" replace />} />
        <Route path="/products" element={<ProductsRedirect />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  );
}

export default function App() {
  useEffect(() => {
    const setSBW = () => {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--sbw", `${sbw}px`);
    };
    setSBW();
    window.addEventListener("resize", setSBW);
    return () => window.removeEventListener("resize", setSBW);
  }, []);

  const onHeaderHeight = (h) =>
    document.documentElement.style.setProperty("--header-h", `${h}px`);

  return (
    <BrowserRouter>
      <Header onHeight={onHeaderHeight} />
      <MainContent />
      <Footer />
    </BrowserRouter>
  );
}
