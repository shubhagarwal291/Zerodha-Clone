const { Schema } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 100000, // ₹1,00,000 demo money
  },
  loan: {
    amount: { type: Number, default: 0 },
    interest: { type: Number, default: 0 },
    taken: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastRewardClaim: {
    type: Date,
    default: null,
  },
});

module.exports = { UserSchema };
