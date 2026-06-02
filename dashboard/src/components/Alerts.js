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
    await axios.post(
      `${API_URL}/alerts`,
      {
        stockName: stock,
        targetPrice,
        condition: ">",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setStock("");
    setTargetPrice("");
    fetchAlerts();
  };

  const deleteAlert = async (id) => {
    await axios.delete(`${API_URL}/alerts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
            onClick={() => deleteAlert(alert._id)}
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
