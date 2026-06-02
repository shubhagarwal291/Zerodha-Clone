const mongoose = require("mongoose");

const PortfolioHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  portfolioValue: {
    type: Number,
    required: true,
  },

  balance: {
    type: Number,
    required: true,
  },

  totalValue: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { PortfolioHistorySchema };