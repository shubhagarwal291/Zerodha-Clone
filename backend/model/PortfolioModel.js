const { model } = require("mongoose");
const { PortfolioSchema } = require("../schemas/PortfolioSchema");

const PortfolioModel = new model("portfolio", PortfolioSchema);

module.exports = { PortfolioModel };