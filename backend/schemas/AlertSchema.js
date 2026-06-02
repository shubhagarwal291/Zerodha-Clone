const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  stockName: {
    type: String,
    required: true,
  },

  condition: {
    type: String,
    enum: [">", "<"],
    required: true,
  },

  targetPrice: {
    type: Number,
    required: true,
  },

  triggered: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { AlertSchema };