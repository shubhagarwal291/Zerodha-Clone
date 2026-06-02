import React from "react";

function Hero() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <img
          src="media/images/homeHero.png"
          alt="Hero Image"
          className="mb-5"
        />
        <h1 className="mt-5 section-title">Invest in everything</h1>
        <p className="section-muted">
          Online platform to invest in stocks, derivatives, mutual funds, and
          more
        </p>
        <button
          className="btn btn-primary fs-5 mb-5 hero-cta-btn"
        >
          Signup Now
        </button>
      </div>
    </div>
  );
}

export default Hero;
