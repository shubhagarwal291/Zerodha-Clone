const express = require("express");
const router = express.Router();

const { AlertModel } = require("../model/AlertModel");
const { verifyToken } = require("../middleware/authMiddleware");

// Create Alert
router.post("/", verifyToken, async (req, res) => {
  try {
    const alert = new AlertModel({
      userId: req.user.id,
      stockName: req.body.stockName,
      targetPrice: req.body.targetPrice,
      condition: req.body.condition,
      triggered: false,
    });

    await alert.save();

    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create alert" });
  }
});

// Get User Alerts
router.get("/", verifyToken, async (req, res) => {
  try {
    const alerts = await AlertModel.find({
      userId: req.user.id,
    });

    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
});

// Delete Alert
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await AlertModel.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete alert" });
  }
});

router.post("/check", verifyToken, async (req, res) => {
  try {
    const { stockName, currentPrice } = req.body;

    const alerts = await AlertModel.find({
      stockName,
      triggered: false,
    });

    const triggeredAlerts = [];

    for (const alert of alerts) {
      if (
        alert.condition === ">" &&
        currentPrice >= alert.targetPrice
      ) {
        alert.triggered = true;
        await alert.save();

        triggeredAlerts.push(alert);
      }
    }

    res.json(triggeredAlerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Alert check failed",
    });
  }
});

module.exports = router;