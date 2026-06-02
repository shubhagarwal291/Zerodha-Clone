import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3002";

const Orders = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_URL}/trade/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHistory(res.data);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN");
  };

  return (
    <div style={{ padding: "24px" }}>
      <h3 className="title">📜 Trade History</h3>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            color: "#888",
          }}
        >
          No transaction history found.
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Stock</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td>{formatDate(item.createdAt)}</td>

                  <td
                    style={{
                      color:
                        item.type === "BUY"
                          ? "#4caf50"
                          : item.type === "SELL"
                          ? "#f44336"
                          : "#2196f3",
                      fontWeight: "600",
                    }}
                  >
                    {item.type}
                  </td>

                  <td>{item.stockName || "-"}</td>

                  <td>{item.qty || "-"}</td>

                  <td>
                    {item.price
                      ? `₹${item.price.toFixed(2)}`
                      : "-"}
                  </td>

                  <td>
                    ₹{Number(item.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;