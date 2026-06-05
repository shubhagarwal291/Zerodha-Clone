import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PortfolioPerformanceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(
        "https://investsphere-stock-trading-platform.onrender.com/trade/portfolio-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        const chartData = res.data.map((item, index) => ({
          day: `#${index + 1}`,
          value: item.totalValue,
        }));

        setData(chartData);
      });
  }, []);

  return (
    <div
      style={{
        background: "#151515",
        padding: "24px",
        borderRadius: "16px",
        marginTop: "30px",
        border: "1px solid #2c2c2c",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      <h3
        style={{
          color: "#fff",
          marginBottom: "20px",
          fontWeight: "600",
        }}
      >
        📈 Portfolio Performance Over Time
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />

          <XAxis dataKey="day" stroke="#888" tick={{ fill: "#aaa" }} />

          <YAxis
            stroke="#888"
            tick={{ fill: "#aaa" }}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#121212",
              border: "1px solid #333",
              borderRadius: "10px",
              color: "#fff",
            }}
            formatter={(value) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              "Portfolio Value",
            ]}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#00e676"
            strokeWidth={4}
            dot={{
              r: 6,
              fill: "#00e676",
            }}
            activeDot={{
              r: 8,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPerformanceChart;
