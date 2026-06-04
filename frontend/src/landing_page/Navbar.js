import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: "About", to: "/about" },
    { label: "Market News", to: "/market-news" },
    { label: "Resources", to: "/resources" },
    { label: "Contact", to: "/contact" },
    { label: "Login", to: "/login" },
  ];
  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top site-navbar">
      <div className="container py-2">
        <Link className="navbar-brand fw-bold fs-3 text-primary" to="/">
          InvestSphere
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-lg-0 align-items-lg-center">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <Link
                  className={`nav-link ${
                    location.pathname === item.to ? "active" : ""
                  }`}
                  to={item.to}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="nav-item ms-lg-2">
              <Link className="btn btn-primary btn-sm px-3" to="/signup">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
