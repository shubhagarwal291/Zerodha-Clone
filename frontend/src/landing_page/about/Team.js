import React from "react";

function Team() {
  return (
    <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center">Why Choose InvestSphere?</h1>
      </div>

      <div
        className="row p-5 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-md-6">
          <h4>Portfolio Analytics</h4>
          <p>
            Gain deeper insights into your investments through portfolio
            tracking, profit and loss monitoring, and performance analysis.
          </p>

          <h4 className="mt-4">Market Insights</h4>
          <p>
            Stay informed with market updates, stock information, and
            data-driven investment decisions.
          </p>
        </div>

        <div className="col-md-6">
          <h4>Smart Alerts</h4>
          <p>
            Monitor important price movements and investment opportunities with
            customizable alert systems.
          </p>

          <h4 className="mt-4">Modern Fintech Experience</h4>
          <p>
            Built using the MERN stack, InvestSphere combines a clean user
            interface with powerful portfolio management capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;