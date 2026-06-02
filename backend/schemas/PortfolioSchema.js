const { Schema } = require("mongoose");

const PortfolioSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  stockName: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 0,
  },
  avgBuyPrice: {
    type: Number,
    required: true,
  },
  totalInvested: {
    type: Number,
    required: true,
  },
});

module.exports = { PortfolioSchema };