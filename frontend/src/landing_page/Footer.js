import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-main mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col">
            <h3 className="text-primary fw-bold">InvestSphere</h3>

            <p className="mt-3 mb-0">Track. Analyze. Invest.</p>

            <p className="mt-2">© 2026 InvestSphere. All rights reserved.</p>
          </div>
          <div className="col">
            <p className="footer-heading">Company</p>

            <Link to="/about" className="footer-link">
              About
            </Link>
            <br />

            <Link to="/market-news" className="footer-link">
              Market News
            </Link>
            <br />

            <Link to="/resources" className="footer-link">
              Resources
            </Link>
            <br />

            <Link to="/contact" className="footer-link">
              Contact
            </Link>
          </div>
          <div className="col">
            <p className="footer-heading">Resources</p>

            <Link to="/resources" className="footer-link">
              Beginner Investing Guide
            </Link>

            <br />

            <Link to="/resources" className="footer-link">
              Stock Market Basics
            </Link>

            <br />

            <Link to="/resources" className="footer-link">
              Risk Management
            </Link>

            <br />

            <Link to="/resources" className="footer-link">
              Learning Center
            </Link>
          </div>
          <div className="col">
            <p className="footer-heading">Account</p>

            <Link to="/login" className="footer-link">
              Login
            </Link>

            <br />

            <Link to="/signup" className="footer-link">
              Sign Up
            </Link>

            <br />

            <Link to="/signup" className="footer-link">
              Open Account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
