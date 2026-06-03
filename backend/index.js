require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const authRoutes = require("./routes/authRoutes");
const alertRoutes = require("./routes/alertRoutes");
const tradingRoutes = require("./routes/tradingRoutes");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ─── AUTH ROUTES ──────────────────────────────────────────
app.use("/auth", authRoutes);

// ─── TRADING ROUTES ───────────────────────────────────────
app.use("/trade", tradingRoutes);

app.use("/alerts", alertRoutes);

// ─── HOLDINGS ─────────────────────────────────────────────
app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/stock-details/:symbol", (req, res) => {
  const { symbol } = req.params;

  const stockDetails = {
    RELIANCE: {
      price: 1314.6,
      high52: 1608,
      low52: 1120,
      marketCap: "18.2T",
      pe: 24.6,
      volume: "8.3M",
    },

    TCS: {
      price: 2446.9,
      high52: 4592,
      low52: 3050,
      marketCap: "13.8T",
      pe: 31.5,
      volume: "2.1M",
    },

    HDFCBANK: {
      price: 748.25,
      high52: 1880,
      low52: 1363,
      marketCap: "11.2T",
      pe: 18.7,
      volume: "5.6M",
    },

    INFY: {
      price: 1222.6,
      high52: 1903,
      low52: 1351,
      marketCap: "7.8T",
      pe: 27.3,
      volume: "3.8M",
    },

    ICICIBANK: {
      price: 1242.0,
      high52: 1408,
      low52: 1043,
      marketCap: "8.7T",
      pe: 18.5,
      volume: "4.9M",
    },

    HINDUNILVR: {
      price: 2090.6,
      high52: 3035,
      low52: 2035,
      marketCap: "4.9T",
      pe: 52.1,
      volume: "1.7M",
    },

    SBIN: {
      price: 970.45,
      high52: 995,
      low52: 543,
      marketCap: "8.6T",
      pe: 10.4,
      volume: "6.2M",
    },

    BHARTIARTL: {
      price: 1824.1,
      high52: 1917,
      low52: 1012,
      marketCap: "10.9T",
      pe: 72.6,
      volume: "2.4M",
    },

    WIPRO: {
      price: 204.1,
      high52: 318,
      low52: 198,
      marketCap: "2.1T",
      pe: 20.2,
      volume: "5.5M",
    },

    ITC: {
      price: 277.0,
      high52: 528,
      low52: 242,
      marketCap: "3.5T",
      pe: 24.8,
      volume: "7.3M",
    },
  };

  res.json(stockDetails[symbol] || null);
});

// ─── POSITIONS ────────────────────────────────────────────
app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

// ─── ORDERS ───────────────────────────────────────────────
app.post("/newOrder", async (req, res) => {
  let newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });
  newOrder.save();
  res.send("Order saved!");
});

// ─── STOCK PRICE PROXY ────────────────────────────────────
app.get("/stock/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?interval=1d&range=1d`,
    );
    const data = await response.json();
    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice.toFixed(2);
    const prevClose = meta.chartPreviousClose;
    const change = (
      ((meta.regularMarketPrice - prevClose) / prevClose) *
      100
    ).toFixed(2);
    res.json({
      name: symbol,
      price,
      percent: `${change > 0 ? "+" : ""}${change}%`,
      isDown: change < 0,
    });
  } catch (err) {
    res.status(404).json({ error: "Stock not found" });
  }
});

// ─── START SERVER ─────────────────────────────────────────
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB started!");
    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
  });
