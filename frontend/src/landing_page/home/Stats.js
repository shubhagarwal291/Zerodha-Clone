import React from "react";

function Stats() {
  return (
    <div className="container py-5">
      {/* Heading */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Why Investors Choose InvestSphere</h1>
      </div>

      {/* Features */}
      <div className="row g-5">
        {/* Left Side */}
        <div className="col-md-6">
          <div className="mb-5">
            <h3 className="fw-bold">Portfolio Tracking</h3>
            <p className="text-muted fs-5">
              Monitor holdings, portfolio value, invested capital, and
              profit/loss through a clean and intuitive dashboard.
            </p>
          </div>

          <div>
            <h3 className="fw-bold">Investment Analytics</h3>
            <p className="text-muted fs-5">
              Analyze portfolio performance and make informed investment
              decisions using meaningful financial insights.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-6">
          <div className="mb-5">
            <h3 className="fw-bold">Market Intelligence</h3>
            <p className="text-muted fs-5">
              Stay updated with market movements, stock information, and
              investment-focused resources.
            </p>
          </div>

          <div>
            <h3 className="fw-bold">Smart Alerts</h3>
            <p className="text-muted fs-5">
              Create custom alerts and monitor important price movements to stay
              ahead of market opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Image */}
      <div className="text-center mt-5">
        <img
          src="media/images/dashboard2.png"
          alt="Dashboard Preview"
          style={{
            width: "90%",
            maxWidth: "1200px",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}

export default Stats;