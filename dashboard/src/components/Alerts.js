import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3002";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [stock, setStock] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  const token = localStorage.getItem("token");

  const fetchAlerts = async () => {
    const res = await axios.get(`${API_URL}/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAlerts(res.data);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

const addAlert = async () => {
  const newAlert = {
    stockName: stock.toUpperCase(),
    targetPrice: Number(targetPrice),
    condition: ">",
  };

  await axios.post(
    `${API_URL}/alerts`,
    newAlert,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // Save in localStorage also
  const existingAlerts =
    JSON.parse(localStorage.getItem("priceAlerts")) || [];

  existingAlerts.push(newAlert);

  localStorage.setItem(
    "priceAlerts",
    JSON.stringify(existingAlerts)
  );

  setStock("");
  setTargetPrice("");

  fetchAlerts();
};

  const deleteAlert = async (id, stockName) => {
    await axios.delete(`${API_URL}/alerts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const existingAlerts =
  JSON.parse(localStorage.getItem("priceAlerts")) || [];

const updatedAlerts = existingAlerts.filter(
  (a) => a.stockName !== stockName
);

localStorage.setItem(
  "priceAlerts",
  JSON.stringify(updatedAlerts)
);

    fetchAlerts();
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>🔔 Price Alerts</h2>

      <input
        placeholder="Stock Name"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <input
        placeholder="Target Price"
        type="number"
        value={targetPrice}
        onChange={(e) => setTargetPrice(e.target.value)}
      />

      <button onClick={addAlert}>Create Alert</button>

      <br />
      <br />

      {alerts.map((alert) => (
        <div key={alert._id}>
          {alert.stockName} {alert.condition} ₹{alert.targetPrice}
          <button
            onClick={() => deleteAlert(alert._id, alert.stockName)}
            style={{
              marginLeft: "10px",
              background: "#e53935",
              color: "white",
              border: "none",
              padding: "4px 8px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
