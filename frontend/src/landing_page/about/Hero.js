import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2 text-center">
          Empowering Investors with Smarter Insights
          <br />
          Track. Analyze. Invest.
        </h1>
      </div>

      <div
        className="row p-5 mt-5 border-top text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-5">
          <p>
            InvestSphere is a modern investment analytics and portfolio
            management platform designed to help investors track holdings,
            monitor portfolio performance, and make informed financial
            decisions.
          </p>

          <p>
            Our mission is to simplify investing through intuitive tools,
            real-time insights, and portfolio analytics that transform complex
            financial data into actionable information.
          </p>

          <p>
            Whether you are a beginner investor or an experienced trader,
            InvestSphere provides a streamlined experience for monitoring
            investments and understanding market trends.
          </p>
        </div>

        <div className="col-6 p-5">
          <p>
            We offer portfolio tracking, stock monitoring, smart alerts, and
            market intelligence features that help users stay connected with
            their investments.
          </p>

          <p>
            Our goal is to build a transparent and accessible investment
            ecosystem where users can confidently manage and analyze their
            portfolios.
          </p>

          <p>
            As InvestSphere continues to grow, we aim to introduce advanced
            analytics, real-time market data, and paper trading capabilities to
            enhance the investing experience.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;