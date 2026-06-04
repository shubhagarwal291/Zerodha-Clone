import React from "react";

function MarketNewsPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Market News</h1>

      <h3>Top Headlines</h3>
      <ul>
        <li>Sensex gains 500 points amid positive market sentiment.</li>
        <li>Nifty reaches new monthly high.</li>
        <li>Banking stocks lead today's rally.</li>
      </ul>

      <h3 className="mt-5">Top Gainers</h3>
      <ul>
        <li>Reliance Industries</li>
        <li>TCS</li>
        <li>Infosys</li>
      </ul>

      <h3 className="mt-5">Top Losers</h3>
      <ul>
        <li>Wipro</li>
        <li>HCL Tech</li>
        <li>Adani Power</li>
      </ul>
    </div>
  );
}

export default MarketNewsPage;