import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css"; // ✅ Perfect place for global responsive styles

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
