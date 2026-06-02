const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["BUY", "SELL", "LOAN", "REPAY"],
    required: true,
  },

  stockName: {
    type: String,
    default: null,
  },

  qty: {
    type: Number,
    default: null,
  },

  price: {
    type: Number,
    default: null,
  },

  amount: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { TransactionSchema };