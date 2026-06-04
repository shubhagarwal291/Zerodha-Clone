import React from "react";

function Education() {
  return (
    <div className="container mt-5 mb-5">
      <div className="text-center mb-5">
        <h1 className="fs-2">Learning Center</h1>
        <p className="text-muted">
          Build your investing knowledge with curated educational resources.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="p-4 border rounded">
            <h4>📈 Beginner Investing Guide</h4>
            <p className="text-muted">
              Learn the fundamentals of investing, portfolio building,
              diversification, and long-term wealth creation.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-4 border rounded">
            <h4>📊 Stock Market Basics</h4>
            <p className="text-muted">
              Understand how stock exchanges work and what drives stock prices.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-4 border rounded">
            <h4>📉 How to Analyze Stocks</h4>
            <p className="text-muted">
              Learn about market capitalization, P/E ratio, financial
              statements, and valuation metrics.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-4 border rounded">
            <h4>🛡 Risk Management</h4>
            <p className="text-muted">
              Understand diversification, position sizing, and protecting your
              investments from unnecessary risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;