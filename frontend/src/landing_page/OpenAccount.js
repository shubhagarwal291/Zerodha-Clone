import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5 section-title">
          Start Your Investment Journey Today
        </h1>

        <p className="section-muted">
          Track portfolios, analyze performance, monitor market trends, and make
          smarter financial decisions with InvestSphere.
        </p>

        <Link to="/signup" className="btn btn-primary fs-5 mb-5 hero-cta-btn">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default OpenAccount;
