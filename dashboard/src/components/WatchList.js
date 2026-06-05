import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tooltip, Grow } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { DoughnutChart } from "./DoughnoutChart";
import { useNavigate } from "react-router-dom";

const API_URL = "https://investsphere-stock-trading-platform.onrender.com";

const TOP_STOCKS = [
  "RELIANCE",
  "TCS",
  "HDFCBANK",
  "INFY",
  "ICICIBANK",
  "HINDUNILVR",
  "SBIN",
  "BHARTIARTL",
  "WIPRO",
  "ITC",
];

const fetchStockData = async (symbol) => {
  try {
    const res = await axios.get(`${API_URL}/stock/${symbol}`);
    return res.data;
  } catch {
    return null;
  }
};

// ─── BUY/SELL POPUP ───────────────────────────────────────
const TradePopup = ({ stock, mode, onClose, onSuccess }) => {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  const price = parseFloat(stock.price);
  const totalValue = (qty * price).toFixed(2);

  useEffect(() => {
    const fetchData = async () => {
      // ✅ Read token fresh inside the function
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please log in again.");
        return;
      }
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
        const holding = portRes.data.find((p) => p.stockName === stock.name);
        setPortfolio(holding || null);
      } catch (err) {
        console.error("Failed to fetch balance/portfolio:", err);
        setError("Failed to load account data. Check if backend is running.");
      }
    };
    fetchData();
  }, [stock.name]);

  const handleTrade = async () => {
    setLoading(true);
    setError("");

    // ✅ Read token fresh inside the function
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === "buy" ? "/trade/buy" : "/trade/sell";
      const res = await axios.post(
        `${API_URL}${endpoint}`,
        { stockName: stock.name, qty: parseInt(qty), price },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onSuccess(res.data.message, res.data.balance);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLoan = async () => {
    setLoading(true);
    setError("");

    // ✅ Read token fresh inside the function
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/trade/loan`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBalance(res.data.balance);
      alert(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Loan error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "14px",
          padding: "24px",
          minWidth: "340px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
          border: `1px solid ${mode === "buy" ? "#2e7d32" : "#c62828"}`,
          animation: "fadeInUp 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "17px",
                fontWeight: 700,
              }}
            >
              {mode === "buy" ? "🟢 Buy" : "🔴 Sell"} {stock.name}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888" }}>
              Current Price:{" "}
              <span style={{ color: "#fff", fontWeight: 600 }}>
                ₹{stock.price}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#2c2c2c",
              border: "1px solid #444",
              color: "#aaa",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Balance & Holdings Info */}
        <div
          style={{
            backgroundColor: "#2c2c2c",
            borderRadius: "10px",
            padding: "12px 14px",
            marginBottom: "16px",
            fontSize: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}
          >
            <span style={{ color: "#888" }}>Available Balance</span>
            <span
              style={{
                color:
                  balance === null
                    ? "#888"
                    : balance <= 0
                      ? "#e53935"
                      : "#4caf50",
                fontWeight: "600",
              }}
            >
              {balance === null
                ? "Loading..."
                : `₹${balance.toLocaleString("en-IN")}`}
            </span>
          </div>

          {mode === "sell" && portfolio && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#888" }}>You Own</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>
                {portfolio.qty} shares
              </span>
            </div>
          )}
          {mode === "sell" && !portfolio && balance !== null && (
            <p style={{ color: "#e57373", margin: 0, fontSize: "12px" }}>
              ⚠ You don't own this stock
            </p>
          )}
        </div>

        {/* Quantity Input */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              color: "#888",
              fontSize: "12px",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Quantity
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{
                width: "34px",
                height: "34px",
                backgroundColor: "#333",
                border: "1px solid #555",
                color: "#fff",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              −
            </button>
            <input
              type="number"
              value={qty}
              min="1"
              onChange={(e) =>
                setQty(Math.max(1, parseInt(e.target.value) || 1))
              }
              style={{
                flex: 1,
                textAlign: "center",
                backgroundColor: "#2c2c2c",
                border: "1px solid #555",
                color: "#fff",
                borderRadius: "8px",
                padding: "7px",
                fontSize: "15px",
              }}
            />
            <button
              onClick={() => setQty(qty + 1)}
              style={{
                width: "34px",
                height: "34px",
                backgroundColor: "#333",
                border: "1px solid #555",
                color: "#fff",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Total Value */}
        <div
          style={{
            backgroundColor: "#2c2c2c",
            borderRadius: "10px",
            padding: "12px 14px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#888", fontSize: "13px" }}>
            Total {mode === "buy" ? "Cost" : "Value"}
          </span>
          <span style={{ color: "#fff", fontWeight: "700", fontSize: "16px" }}>
            ₹{totalValue}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#2c1010",
              border: "1px solid #e53935",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "14px",
              fontSize: "12px",
              color: "#e57373",
            }}
          >
            {error}
            {error.includes("Insufficient") && (
              <button
                onClick={handleLoan}
                disabled={loading}
                style={{
                  display: "block",
                  marginTop: "10px",
                  backgroundColor: "#1565c0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: 600,
                }}
              >
                💳 Take ₹50,000 Demo Loan (5% interest)
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              backgroundColor: "#2c2c2c",
              border: "1px solid #555",
              color: "#aaa",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleTrade}
            disabled={loading || (mode === "sell" && !portfolio)}
            style={{
              flex: 2,
              padding: "11px",
              backgroundColor: mode === "buy" ? "#2e7d32" : "#c62828",
              border: "none",
              color: "#fff",
              borderRadius: "10px",
              cursor:
                loading || (mode === "sell" && !portfolio)
                  ? "not-allowed"
                  : "pointer",
              fontSize: "13px",
              fontWeight: "700",
              opacity: loading || (mode === "sell" && !portfolio) ? 0.55 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading
              ? "Processing..."
              : mode === "buy"
                ? `Buy ${qty} share${qty > 1 ? "s" : ""}`
                : `Sell ${qty} share${qty > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── WATCHLIST ────────────────────────────────────────────
const WatchList = () => {
  const [topStocks, setTopStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tradePopup, setTradePopup] = useState(null);
  useEffect(() => {
    console.log("tradePopup changed:", tradePopup);
  }, [tradePopup]);
  const [successMsg, setSuccessMsg] = useState("");

  const FALLBACK_STOCKS = [
    { name: "RELIANCE", price: "2850.00", percent: "+1.20%", isDown: false },
    { name: "TCS", price: "3900.00", percent: "-0.50%", isDown: true },
    { name: "HDFCBANK", price: "1650.00", percent: "+0.80%", isDown: false },
    { name: "INFY", price: "1450.00", percent: "-0.30%", isDown: true },
    { name: "ICICIBANK", price: "1100.00", percent: "+1.10%", isDown: false },
    { name: "HINDUNILVR", price: "2500.00", percent: "-0.20%", isDown: true },
    { name: "SBIN", price: "800.00", percent: "+0.60%", isDown: false },
    { name: "BHARTIARTL", price: "1200.00", percent: "+2.10%", isDown: false },
    { name: "WIPRO", price: "480.00", percent: "-0.40%", isDown: true },
    { name: "ITC", price: "450.00", percent: "+0.90%", isDown: false },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const results = await Promise.all(TOP_STOCKS.map(fetchStockData));
      const valid = results.filter(Boolean);

      // PRICE ALERT CHECK
      const alerts = JSON.parse(localStorage.getItem("priceAlerts")) || [];
      console.log("ALERT SYSTEM RUNNING");
      console.log("Stored Alerts:", alerts);

      valid.forEach((stock) => {
        console.log("Stock:", stock.name, stock.price);
        const currentPrice = parseFloat(stock.price);

        alerts.forEach((priceAlert) => {
          console.log("Checking:", {
            stockName: stock.name,
            alertStock: priceAlert.stockName,
            currentPrice,
            targetPrice: priceAlert.targetPrice,
          });
          if (
            priceAlert.stockName?.trim().toUpperCase() ===
              stock.name?.trim().toUpperCase() &&
            priceAlert.condition === ">" &&
            currentPrice >= Number(priceAlert.targetPrice)
          ) {
            alert(
              `🚨 ALERT!\n${stock.name} reached ₹${currentPrice}\nTarget: ₹${priceAlert.targetPrice}`,
            );

            // Remove triggered alert
            const remainingAlerts = alerts.filter(
              (a) =>
                !(
                  a.stockName === priceAlert.stockName &&
                  a.targetPrice === priceAlert.targetPrice &&
                  a.condition === priceAlert.condition
                ),
            );

            localStorage.setItem(
              "priceAlerts",
              JSON.stringify(remainingAlerts),
            );
          }

          if (
            priceAlert.stockName === stock.name &&
            priceAlert.condition === "<" &&
            currentPrice <= priceAlert.targetPrice
          ) {
            alert(
              `🚨 ALERT!\n${stock.name} fell to ₹${currentPrice}\nTarget: ₹${priceAlert.targetPrice}`,
            );

            // Remove triggered alert
            const remainingAlerts = alerts.filter(
              (a) =>
                !(
                  a.stockName === priceAlert.stockName &&
                  a.targetPrice === priceAlert.targetPrice &&
                  a.condition === priceAlert.condition
                ),
            );

            localStorage.setItem(
              "priceAlerts",
              JSON.stringify(remainingAlerts),
            );
          }
        });
      });

      setTopStocks(valid.length === 0 ? FALLBACK_STOCKS : valid);
      setLoading(false);
    };
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value.toUpperCase();
    setSearchQuery(query);
    setSearchError("");
    setSearchResult(null);
    if (query.length < 2) return;
    setSearchLoading(true);
    const result = await fetchStockData(query);
    if (result) {
      setSearchResult(result);
    } else {
      setSearchError("Stock not found. Try NSE symbol (e.g. TATAMOTORS)");
    }
    setSearchLoading(false);
  };

  const handleTradeSuccess = (message) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 4000);
    // Notify other components (e.g. Menu balance) to refresh
    window.dispatchEvent(new Event("balance-updated"));
  };

  const doughnutData = {
    labels: topStocks.map((s) => s.name),
    datasets: [
      {
        label: "Price",
        data: topStocks.map((s) => parseFloat(s.price)),
        backgroundColor: [
          "rgba(255,99,132,0.5)",
          "rgba(54,162,235,0.5)",
          "rgba(255,206,86,0.5)",
          "rgba(75,192,192,0.5)",
          "rgba(153,102,255,0.5)",
          "rgba(255,159,64,0.5)",
          "rgba(255,99,132,0.3)",
          "rgba(54,162,235,0.3)",
          "rgba(255,206,86,0.3)",
          "rgba(75,192,192,0.3)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      {/* Success Toast */}
      {successMsg && (
        <div
          style={{
            backgroundColor: "#1b5e20",
            color: "#fff",
            padding: "10px 16px",
            fontSize: "12px",
            textAlign: "center",
            borderRadius: "6px",
            margin: "6px 10px",
            fontWeight: 600,
          }}
        >
          ✅ {successMsg}
        </div>
      )}

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search eg: TATAMOTORS, BAJFINANCE..."
          className="search"
          value={searchQuery}
          onChange={handleSearch}
        />
        <span className="counts">{topStocks.length} / 50</span>
      </div>

      {/* Search Result */}
      {searchQuery.length >= 2 && (
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #2c2c2c" }}>
          {searchLoading && (
            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
              Searching...
            </p>
          )}
          {searchError && (
            <p style={{ color: "#e57373", fontSize: "12px", margin: 0 }}>
              {searchError}
            </p>
          )}
          {searchResult && !searchLoading && (
            <>
              <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>
                Search Result:
              </p>
              <ul className="list" style={{ margin: 0, padding: 0 }}>
                <WatchListItem
                  stock={searchResult}
                  onTrade={(stock, mode) => setTradePopup({ stock, mode })}
                />
              </ul>
            </>
          )}
        </div>
      )}

      {/* Top 10 Header */}
      <div style={{ padding: "8px 16px 4px" }}>
        <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>
          🔥 TOP 10 POPULAR STOCKS
          {!loading && (
            <span
              style={{ float: "right", color: "#4caf50", fontSize: "10px" }}
            >
              ● LIVE
            </span>
          )}
          {loading && (
            <span style={{ float: "right", color: "#888", fontSize: "10px" }}>
              Loading...
            </span>
          )}
        </p>
      </div>

      {/* Stock List */}
      <ul className="list">
        {loading
          ? [...Array(10)].map((_, i) => (
              <li key={i} style={{ padding: "10px 16px" }}>
                <div
                  style={{
                    background: "#2c2c2c",
                    borderRadius: "4px",
                    height: "20px",
                    marginBottom: "4px",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              </li>
            ))
          : topStocks.map((stock, index) => (
              <WatchListItem
                stock={stock}
                key={index}
                onTrade={(stock, mode) => setTradePopup({ stock, mode })}
              />
            ))}
      </ul>

      <DoughnutChart data={doughnutData} />

      {/* Trade Popup */}
      {tradePopup && (
        <TradePopup
          stock={tradePopup.stock}
          mode={tradePopup.mode}
          onClose={() => setTradePopup(null)}
          onSuccess={handleTradeSuccess}
        />
      )}
    </div>
  );
};

export default WatchList;

// ─── WATCHLIST ITEM ───────────────────────────────────────
// ─── WATCHLIST ITEM ───────────────────────────────────────
const WatchListItem = ({ stock, onTrade }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

  return (
    <li
      style={{
        listStyle: "none",
        position: "relative",
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        style={{
          display: "flex",
          cursor: "default",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          minWidth: "320px",
          gap: "6px",
          borderRadius: "6px",
          background: "#2c2c2c",
        }}
      >
        <p
          onClick={(e) => {
            e.stopPropagation();
            console.log("CLICKED", stock.name);
            navigate(`/stock/${stock.name}`);
          }}
          style={{
            margin: 0,
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "700",
            color: stock.isDown ? "#e53935" : "#4caf50",
            minWidth: "70px",
          }}
        >
          {stock.name}
        </p>

        {showActions && (
          <>
            <button
              className="buy"
              onClick={() => {
                console.log("BUY CLICKED", stock);
                onTrade(stock, "buy");
              }}
              style={{
                padding: "3px 12px",
                fontSize: "11px",
                backgroundColor: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                position: "relative",
                zIndex: 9999,
              }}
            >
              Buy
            </button>

            <button
              className="sell"
              onClick={() => {
                console.log("SELL CLICKED", stock);
                onTrade(stock, "sell");
              }}
              style={{
                padding: "3px 12px",
                fontSize: "11px",
                backgroundColor: "#c62828",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                position: "relative",
                zIndex: 9999,
              }}
            >
              Sell
            </button>
            <button
              className="alert"
              onClick={async () => {
                const targetPrice = prompt(
                  `Set alert price for ${stock.name}:`,
                );

                if (!targetPrice) return;

                try {
                  const token = localStorage.getItem("token");

                  const newAlert = {
                    stockName: stock.name,
                    targetPrice: Number(targetPrice),
                    condition: ">",
                  };

                  await axios.post(
                    "https://investsphere-stock-trading-platform.onrender.com/alerts",
                    newAlert,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );

                  // Save in localStorage also
                  const existingAlerts =
                    JSON.parse(localStorage.getItem("priceAlerts")) || [];

                  existingAlerts.push(newAlert);

                  localStorage.setItem(
                    "priceAlerts",
                    JSON.stringify(existingAlerts),
                  );

                  alert(`✅ Alert created!\n${stock.name} > ₹${targetPrice}`);
                } catch (err) {
                  console.error(err);
                  alert("Failed to create alert");
                }
              }}
              style={{
                padding: "3px 10px",
                fontSize: "11px",
                backgroundColor: "#1565c0",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                position: "relative",
                zIndex: 9999,
              }}
            >
              Alert
            </button>
          </>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
            marginLeft: "auto",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: stock.isDown ? "#e53935" : "#4caf50",
            }}
          >
            {stock.percent}
          </span>

          {stock.isDown ? (
            <KeyboardArrowDown
              style={{
                fontSize: "14px",
                color: "#e53935",
              }}
            />
          ) : (
            <KeyboardArrowUp
              style={{
                fontSize: "14px",
                color: "#4caf50",
              }}
            />
          )}

          <span
            style={{
              fontSize: "12px",
              color: "#fff",
              fontWeight: "600",
            }}
          >
            ₹{stock.price}
          </span>
        </div>
      </div>
    </li>
  );
};
