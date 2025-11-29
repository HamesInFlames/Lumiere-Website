import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Home from "./pages/Home.jsx";
import EBoutique from "./pages/EBoutique.jsx";
import Contact from "./pages/Contact.jsx";
import Checkout from "./pages/Checkout.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProductsIndex from "./pages/Products";
import ProductPage from "./pages/Products/Product";

function MainContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <main style={{ paddingTop: isHome ? 0 : "var(--header-h, 90px)", paddingBottom: 80 }}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/e-boutique" element={<EBoutique />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pages/contact" element={<Navigate to="/contact" replace />} />
        <Route path="/products" element={<ProductsIndex />} />
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
      <CartProvider>
        <Header onHeight={onHeaderHeight} />
        <MainContent />
        <Footer />
        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  );
}
