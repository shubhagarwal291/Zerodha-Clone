import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function StockDetails() {
  const { symbol } = useParams();

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
  `https://investsphere-stock-trading-platform.onrender.com/stock-details/${symbol}`
);

        setStock(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [symbol]);

  if (loading) {
    return <h2 style={{ color: "white" }}>Loading...</h2>;
  }

  if (!stock) {
    return <h2 style={{ color: "white" }}>Stock not found</h2>;
  }

  return (
    <div
      style={{
        padding: "30px",
        color: "white",
        background: "#0f1117",
        minHeight: "100vh",
      }}
    >
      <h1>{symbol}</h1>

      <h3>Current Price: ₹{stock.price}</h3>
      <h3>52 Week High: ₹{stock.high52}</h3>
      <h3>52 Week Low: ₹{stock.low52}</h3>
      <h3>Market Cap: {stock.marketCap}</h3>
      <h3>P/E Ratio: {stock.pe}</h3>
      <h3>Volume: {stock.volume}</h3>
    </div>
  );
}