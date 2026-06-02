const express = require("express");
const { UserModel } = require("../model/UserModel");
const { TransactionModel } = require("../model/TransactionModel");
const { PortfolioModel } = require("../model/PortfolioModel");
const { AlertModel } = require("../model/AlertModel");
const { PortfolioHistoryModel } = require("../model/PortfolioHistoryModel");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

const savePortfolioSnapshot = async (user) => {
  await PortfolioHistoryModel.create({
    userId: user._id,
    portfolioValue: 0,
    balance: user.balance,
    totalValue: user.balance,
  });
};

// ─── GET BALANCE ──────────────────────────────────────────
router.get("/balance", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select(
      "balance loan name email",
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      balance: user.balance,
      loan: user.loan,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET PORTFOLIO ────────────────────────────────────────
router.get("/portfolio", verifyToken, async (req, res) => {
  try {
    const portfolio = await PortfolioModel.find({ userId: req.user.id });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── BUY STOCK ────────────────────────────────────────────
router.post("/buy", verifyToken, async (req, res) => {
  try {
    const { stockName, qty, price } = req.body;

    if (!stockName || !qty || !price) {
      return res
        .status(400)
        .json({ message: "Stock name, quantity and price are required" });
    }

    if (qty <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const totalCost = qty * price;

    // Get user
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check balance
    if (user.balance < totalCost) {
      return res.status(400).json({
        message: `Insufficient funds! You need ₹${totalCost.toFixed(2)} but have ₹${user.balance.toFixed(2)}`,
        needsLoan: user.balance < totalCost && !user.loan.taken,
      });
    }

    // Deduct balance
    user.balance = parseFloat((user.balance - totalCost).toFixed(2));
    await user.save();
    await savePortfolioSnapshot(user);

    // Update portfolio
    const existing = await PortfolioModel.findOne({
      userId: req.user.id,
      stockName: stockName.toUpperCase(),
    });

    if (existing) {
      // Update average buy price
      const totalQty = existing.qty + qty;
      const totalInvested = existing.totalInvested + totalCost;
      existing.avgBuyPrice = parseFloat((totalInvested / totalQty).toFixed(2));
      existing.qty = totalQty;
      existing.totalInvested = parseFloat(totalInvested.toFixed(2));
      await existing.save();
    } else {
      // Create new portfolio entry
      await PortfolioModel.create({
        userId: req.user.id,
        stockName: stockName.toUpperCase(),
        qty,
        avgBuyPrice: parseFloat(price.toFixed(2)),
        totalInvested: parseFloat(totalCost.toFixed(2)),
      });
    }
    await TransactionModel.create({
      userId: req.user.id,
      type: "BUY",
      stockName: stockName.toUpperCase(),
      qty,
      price,
      amount: totalCost,
    });

    res.json({
      message: `Successfully bought ${qty} shares of ${stockName} at ₹${price}`,
      balance: user.balance,
      totalCost,
    });
  } catch (err) {
    console.error("Buy error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── SELL STOCK ───────────────────────────────────────────
router.post("/sell", verifyToken, async (req, res) => {
  try {
    const { stockName, qty, price } = req.body;

    if (!stockName || !qty || !price) {
      return res
        .status(400)
        .json({ message: "Stock name, quantity and price are required" });
    }

    if (qty <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    // Check if user owns the stock
    const holding = await PortfolioModel.findOne({
      userId: req.user.id,
      stockName: stockName.toUpperCase(),
    });

    if (!holding) {
      return res
        .status(400)
        .json({ message: `You don't own any shares of ${stockName}` });
    }

    if (holding.qty < qty) {
      return res.status(400).json({
        message: `You only have ${holding.qty} shares of ${stockName}`,
      });
    }

    const totalValue = qty * price;

    // Update user balance
    const user = await UserModel.findById(req.user.id);
    user.balance = parseFloat((user.balance + totalValue).toFixed(2));
    await user.save();
    await savePortfolioSnapshot(user);

    // Update portfolio
    if (holding.qty === qty) {
      // Remove completely
      await PortfolioModel.deleteOne({ _id: holding._id });
    } else {
      // Reduce qty
      holding.qty -= qty;
      holding.totalInvested = parseFloat(
        (holding.avgBuyPrice * holding.qty).toFixed(2),
      );
      await holding.save();
    }
    await TransactionModel.create({
      userId: req.user.id,
      type: "SELL",
      stockName: stockName.toUpperCase(),
      qty,
      price,
      amount: totalValue,
    });

    res.json({
      message: `Successfully sold ${qty} shares of ${stockName} at ₹${price}`,
      balance: user.balance,
      totalValue,
    });
  } catch (err) {
    console.error("Sell error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/repay-loan", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user.loan.taken) {
      return res.status(400).json({
        message: "No active loan found.",
      });
    }

    const repayAmount = user.loan.amount + user.loan.interest;

    if (user.balance < repayAmount) {
      return res.status(400).json({
        message: `Insufficient balance. Need ₹${repayAmount.toFixed(2)}.`,
      });
    }

    user.balance -= repayAmount;

    user.loan.amount = 0;
    user.loan.interest = 0;
    user.loan.taken = false;

    await user.save();
    await savePortfolioSnapshot(user);

    await TransactionModel.create({
      userId: req.user.id,
      type: "REPAY",
      amount: repayAmount,
    });

    res.json({
      success: true,
      message: `Loan repaid successfully. ₹${repayAmount.toFixed(2)} deducted.`,
      balance: user.balance,
    });
  } catch (err) {
    console.error("Loan repayment error:", err);

    res.status(500).json({
      message: "Failed to repay loan.",
    });
  }
});
// ─── TAKE LOAN ────────────────────────────────────────────
router.post("/loan", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.loan.taken) {
      return res
        .status(400)
        .json({ message: "You already have an active loan of ₹50,000" });
    }

    const loanAmount = 50000;
    const interest = loanAmount * 0.05; // 5% interest
    const totalRepayable = loanAmount + interest;

    user.balance = parseFloat((user.balance + loanAmount).toFixed(2));
    user.loan = {
      amount: loanAmount,
      interest: interest,
      taken: true,
    };

    await user.save();
    await savePortfolioSnapshot(user);

    await TransactionModel.create({
      userId: req.user.id,
      type: "LOAN",
      amount: loanAmount,
    });

    res.json({
      message: `Loan of ₹50,000 credited! Repay ₹${totalRepayable} (5% interest)`,
      balance: user.balance,
      loan: user.loan,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── REPAY LOAN ───────────────────────────────────────────
router.post("/repay-loan", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.loan.taken) {
      return res
        .status(400)
        .json({ message: "You don't have any active loan" });
    }

    const totalRepayable = user.loan.amount + user.loan.interest;

    if (user.balance < totalRepayable) {
      return res.status(400).json({
        message: `Insufficient funds to repay. Need ₹${totalRepayable} but have ₹${user.balance}`,
      });
    }

    user.balance = parseFloat((user.balance - totalRepayable).toFixed(2));
    user.loan = { amount: 0, interest: 0, taken: false };
    await user.save();

    res.json({
      message: `Loan repaid successfully! ₹${totalRepayable} deducted.`,
      balance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/claim-reward", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    const now = new Date();

    if (user.lastRewardClaim) {
      const diff =
        now.getTime() -
        new Date(user.lastRewardClaim).getTime();

      const twentyFourHours =
        24 * 60 * 60 * 1000;

      if (diff < twentyFourHours) {
        return res.status(400).json({
          message: "Reward already claimed.",
          nextClaim:
            user.lastRewardClaim.getTime() +
            twentyFourHours,
        });
      }
    }

    user.balance += 10000;
    user.lastRewardClaim = now;

    await user.save();

    res.json({
      success: true,
      reward: 10000,
      balance: user.balance,
      nextClaim:
        now.getTime() +
        24 * 60 * 60 * 1000,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to claim reward",
    });
  }
});

router.get("/portfolio-history", verifyToken, async (req, res) => {
  try {
    const history = await PortfolioHistoryModel.find({
      userId: req.user.id,
    }).sort({ createdAt: 1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch portfolio history",
    });
  }
});

router.post("/create-alert", verifyToken, async (req, res) => {
  try {
    const { stockName, condition, targetPrice } = req.body;

    const alert = await AlertModel.create({
      userId: req.user.id,
      stockName: stockName.toUpperCase(),
      condition,
      targetPrice,
    });

    res.json({
      success: true,
      alert,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to create alert",
    });
  }
});

router.get("/alerts", verifyToken, async (req, res) => {
  try {
    const alerts = await AlertModel.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch alerts",
    });
  }
});

router.get("/history", verifyToken, async (req, res) => {
  try {
    const history = await TransactionModel.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({
      message: "Failed to fetch history",
    });
  }
});

module.exports = router;
