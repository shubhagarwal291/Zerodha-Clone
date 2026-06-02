import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [mode, setMode] = useState("BUY"); // track BUY or SELL
  const generalContext = useContext(GeneralContext);

  const handleTradeClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in!");
      return;
    }

    const endpoint = mode === "BUY" ? "/trade/buy" : "/trade/sell";

    axios.post(`http://localhost:3002${endpoint}`, {
      stockName: uid,
      qty: parseInt(stockQuantity),
      price: parseFloat(stockPrice),
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      alert(res.data.message || `${mode} order placed!`);
      generalContext.closeBuyWindow();
    })
    .catch((err) => {
      const msg = err.response?.data?.message || "Trade failed!";
      alert(msg);
    });
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        {/* BUY / SELL toggle */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          <button
            onClick={() => setMode("BUY")}
            style={{
              flex: 1,
              padding: "6px",
              background: mode === "BUY" ? "#387ed1" : "#eee",
              color: mode === "BUY" ? "#fff" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            BUY
          </button>
          <button
            onClick={() => setMode("SELL")}
            style={{
              flex: 1,
              padding: "6px",
              background: mode === "SELL" ? "#e74c3c" : "#eee",
              color: mode === "SELL" ? "#fff" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            SELL
          </button>
        </div>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price (₹)</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>

        <div style={{ fontSize: "13px", color: "#555", marginTop: "8px" }}>
          Total: ₹{(stockQuantity * stockPrice).toFixed(2)}
        </div>
      </div>

      <div className="buttons">
        <div>
          <button
            className={`btn ${mode === "BUY" ? "btn-blue" : "btn-red"}`}
            onClick={handleTradeClick}
            style={{
              background: mode === "BUY" ? "#387ed1" : "#e74c3c",
              color: "#fff",
              border: "none",
              padding: "8px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "8px"
            }}
          >
            {mode}
          </button>
          <button
            className="btn btn-grey"
            onClick={handleCancelClick}
            style={{
              background: "#eee",
              border: "none",
              padding: "8px 20px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;