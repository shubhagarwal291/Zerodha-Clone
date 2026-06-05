import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import StockDetails from "./components/StockDetails";

// ─── Protected Route ──────────────────────────────────────
// Checks if JWT token exists in localStorage
// If not, redirects to frontend signup/login page
function ProtectedRoute({ children }) {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");

  if (urlToken) {
    localStorage.setItem("token", urlToken);
    window.history.replaceState({}, "", "/");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href =
  "https://investsphere-stock-trading-platform.vercel.app/signup";
    return null;
  }
  return children;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/stock/:symbol" element={<StockDetails />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
