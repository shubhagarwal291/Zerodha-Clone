const mongoose = require("mongoose");
const { PortfolioHistorySchema } = require("../schemas/PortfolioHistorySchema");

const PortfolioHistoryModel = mongoose.model(
  "portfoliohistory",
  PortfolioHistorySchema
);

module.exports = { PortfolioHistoryModel };