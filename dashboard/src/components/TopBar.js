import React from "react";

import Menu from "./Menu";

const TopBar = () => {
  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2} </p>
          <p className="percent"> </p>
        </div>
      <div className="insight-box">
  <p className="insight-title">InvestSphere Insight</p>
  <p className="insight-quote">
    "Time in the market beats timing the market."
  </p>
</div> 
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
