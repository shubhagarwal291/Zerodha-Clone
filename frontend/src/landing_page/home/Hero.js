import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <img
          src="media/images/dashboard.png"
          alt="Hero Image"
          className="mb-5"
        />
        <h1 className="mt-5 section-title">
          Invest Smarter with Real-Time Portfolio Analytics
        </h1>

        <p className="section-muated">
          Track investments, monitor portfolio performance, analyze market
          trends, and make data-driven financial decisions with InvestSphere.
        </p>

        <Link to="/signup" className="btn btn-primary fs-5 mb-5 hero-cta-btn">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Hero;
