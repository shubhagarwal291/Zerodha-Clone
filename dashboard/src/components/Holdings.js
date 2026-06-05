import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
import { VerticalGraph } from "./VerticalGraph";

// import { holdings } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("https://investsphere-stock-trading-platform.onrender.com/trade/portfolio", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAllHoldings(res.data);
      })
      .catch((err) => {
        console.error("Portfolio fetch error:", err);
      });
  }, []);

  const labels = allHoldings.map((stock) => stock.stockName);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.avgBuyPrice),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const handleSell = async (stock) => {
    const qty = prompt(`How many ${stock.name} shares do you want to sell?`);

    if (!qty || parseInt(qty) <= 0) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
         "https://investsphere-stock-trading-platform.onrender.com/trade/sell",
        {
          stockName: stock.stockName,
          qty: parseInt(qty),
          price: stock.avgBuyPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to sell stock");
    }
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Stock</th>
            <th>Qty</th>
            <th>Avg Buy</th>
            <th>Current</th>
            <th>Invested</th>
            <th>Current Value</th>
            <th>P&L</th>
            <th>Action</th>
          </tr>

          {allHoldings.map((stock, index) => {
            const invested = stock.totalInvested;
            const currentPrice = stock.avgBuyPrice;
            const currentValue = currentPrice * stock.qty;
            const pnl = currentValue - invested;

            return (
              <tr key={index}>
                <td>{stock.stockName}</td>
                <td>{stock.qty}</td>
                <td>₹{stock.avgBuyPrice.toFixed(2)}</td>
                <td>₹{currentPrice.toFixed(2)}</td>
                <td>₹{invested.toFixed(2)}</td>
                <td>₹{currentValue.toFixed(2)}</td>

                <td className={pnl >= 0 ? "profit" : "loss"}>
                  {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                </td>

                <td>
                  <button
                    onClick={() => handleSell(stock)}
                    style={{
                      backgroundColor: "#c62828",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Holdings;
