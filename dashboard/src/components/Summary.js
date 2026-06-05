import React, { useState, useEffect } from "react";
import axios from "axios";
import PortfolioPerformanceChart from "./PortfolioPerformanceChart";
import DailyReward from "./DailyReward";

const API_URL = "https://investsphere-stock-trading-platform.onrender.com";

const Summary = () => {
  const [balance, setBalance] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balRes, portRes] = await Promise.all([
          axios.get(`${API_URL}/trade/balance`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/trade/portfolio`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setBalance(balRes.data.balance);
        setLoan(balRes.data.loan);
        setPortfolio(portRes.data);

        // Fetch live prices for portfolio stocks
        if (portRes.data.length > 0) {
          const pricePromises = portRes.data.map(async (item) => {
            try {
              const res = await axios.get(`${API_URL}/stock/${item.stockName}`);
              return {
                name: item.stockName,
                price: parseFloat(res.data.price),
              };
            } catch {
              return { name: item.stockName, price: item.avgBuyPrice };
            }
          });
          const prices = await Promise.all(pricePromises);
          const priceMap = {};
          prices.forEach((p) => {
            priceMap[p.name] = p.price;
          });
          setStockPrices(priceMap);
        }
      } catch (err) {
        console.error("Summary fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for balance updates from trades
    window.addEventListener("balance-updated", fetchData);
    return () => window.removeEventListener("balance-updated", fetchData);
  }, [token]);

  // Calculate stats
  const totalInvested = portfolio.reduce(
    (sum, item) => sum + item.totalInvested,
    0,
  );
  const currentValue = portfolio.reduce((sum, item) => {
    const currentPrice = stockPrices[item.stockName] || item.avgBuyPrice;
    return sum + currentPrice * item.qty;
  }, 0);
  const pnl = currentValue - totalInvested;
  const pnlPercent =
    totalInvested > 0 ? ((pnl / totalInvested) * 100).toFixed(2) : 0;
  const totalPortfolioValue = balance + currentValue;

  const fmt = (num) =>
    num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "#888" }}>Loading portfolio...</div>
    );
  }

  const handleRepayLoan = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/trade/repay-loan`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message);

      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to repay loan");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Greeting */}
      <h3 style={{ marginBottom: "24px", color: "#fff" }}>
        Hi, {user.name || "User"}! 👋
      </h3>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {/* Available Balance */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #2c2c2c",
          }}
        >
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#888" }}>
            💰 Available Balance
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "700",
              color: balance <= 0 ? "#e53935" : "#4caf50",
            }}
          >
            ₹{fmt(balance || 0)}
          </p>
          {balance <= 5000 && balance > 0 && (
            <p
              style={{ margin: "4px 0 0", fontSize: "11px", color: "#ff9800" }}
            >
              ⚠️ Low balance!
            </p>
          )}
          {balance <= 0 && (
            <p
              style={{ margin: "4px 0 0", fontSize: "11px", color: "#e57373" }}
            >
              ❌ No balance! Consider taking a loan.
            </p>
          )}
        </div>

        {/* Money Invested */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #2c2c2c",
          }}
        >
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#888" }}>
            📈 Money Invested
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            ₹{fmt(totalInvested)}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#888" }}>
            {portfolio.length} stock{portfolio.length !== 1 ? "s" : ""} in
            portfolio
          </p>
        </div>

        {/* Current Value */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #2c2c2c",
          }}
        >
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#888" }}>
            📊 Current Value
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            ₹{fmt(currentValue)}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#888" }}>
            Total portfolio: ₹{fmt(totalPortfolioValue)}
          </p>
        </div>

        {/* Net P&L */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #2c2c2c",
          }}
        >
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#888" }}>
            {pnl >= 0 ? "🟢" : "🔴"} Net P&L
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "700",
              color: pnl >= 0 ? "#4caf50" : "#e53935",
            }}
          >
            {pnl >= 0 ? "+" : ""}₹{fmt(Math.abs(pnl))}
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "11px",
              color: pnl >= 0 ? "#4caf50" : "#e53935",
            }}
          >
            {pnl >= 0 ? "▲" : "▼"} {Math.abs(pnlPercent)}%
          </p>
        </div>
      </div>

      {/* Loan Section */}
      {loan && loan.taken && (
        <div
          style={{
            backgroundColor: "#1a1a2e",
            borderRadius: "12px",
            padding: "16px 20px",
            border: "1px solid #1565c0",
            marginBottom: "24px",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#90caf9" }}>
            💳 Active Demo Loan
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
            Borrowed: ₹{fmt(loan.amount)} | Interest (5%): ₹{fmt(loan.interest)}{" "}
            | Total Repayable:{" "}
            <button
              onClick={handleRepayLoan}
              style={{
                marginLeft: "15px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Repay Loan
            </button>
            <strong style={{ color: "#fff" }}>
              ₹{fmt(loan.amount + loan.interest)}
            </strong>
          </p>
        </div>
      )}

      {/* Portfolio Holdings */}
      {portfolio.length > 0 && (
        <div>
          <h4 style={{ color: "#fff", marginBottom: "12px" }}>
            📋 Your Holdings
          </h4>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #333" }}>
                  {[
                    "Stock",
                    "Qty",
                    "Avg Buy",
                    "Current",
                    "Invested",
                    "Current Value",
                    "P&L",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        textAlign: "left",
                        color: "#888",
                        fontWeight: "500",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => {
                  const currPrice =
                    stockPrices[item.stockName] || item.avgBuyPrice;
                  const currValue = currPrice * item.qty;
                  const itemPnl = currValue - item.totalInvested;

                  const handleSell = async (item) => {
                    const qty = prompt(
                      `How many ${item.stockName} shares do you want to sell?`,
                    );

                    if (!qty || parseInt(qty) <= 0) return;

                    try {
                      const res = await axios.post(
                        `${API_URL}/trade/sell`,
                        {
                          stockName: item.stockName,
                          qty: parseInt(qty),
                          price:
                            stockPrices[item.stockName] || item.avgBuyPrice,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );

                      alert(res.data.message);

                      // Refresh portfolio
                      window.dispatchEvent(new Event("balance-updated"));
                    } catch (err) {
                      alert(
                        err.response?.data?.message || "Failed to sell stock",
                      );
                    }
                  };

                  return (
                    <tr
                      key={item.stockName}
                      style={{ borderBottom: "1px solid #222" }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#fff",
                          fontWeight: "600",
                        }}
                      >
                        {item.stockName}
                      </td>

                      <td style={{ padding: "10px 12px", color: "#ccc" }}>
                        {item.qty}
                      </td>

                      <td style={{ padding: "10px 12px", color: "#ccc" }}>
                        ₹{fmt(item.avgBuyPrice)}
                      </td>

                      <td style={{ padding: "10px 12px", color: "#ccc" }}>
                        ₹{fmt(currPrice)}
                      </td>

                      <td style={{ padding: "10px 12px", color: "#ccc" }}>
                        ₹{fmt(item.totalInvested)}
                      </td>

                      <td style={{ padding: "10px 12px", color: "#fff" }}>
                        ₹{fmt(currValue)}
                      </td>

                      <td
                        style={{
                          padding: "10px 12px",
                          color: itemPnl >= 0 ? "#4caf50" : "#e53935",
                          fontWeight: "600",
                        }}
                      >
                        {itemPnl >= 0 ? "+" : ""}₹{fmt(Math.abs(itemPnl))}
                      </td>

                      <td style={{ padding: "10px 12px" }}>
                        <button
                          onClick={() => handleSell(item)}
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
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty portfolio message */}
      {portfolio.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#888",
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            border: "1px solid #2c2c2c",
          }}
        >
          <p style={{ fontSize: "32px", margin: "0 0 8px" }}>📭</p>
          <p style={{ margin: 0, fontSize: "14px" }}>
            No stocks in your portfolio yet.
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "12px" }}>
            Buy stocks from the watchlist to get started!
          </p>
        </div>
      )}
      <PortfolioPerformanceChart />
      <DailyReward />
    </div>
    
  );
};

export default Summary;
