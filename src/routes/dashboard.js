const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/", authMiddleware, (req, res) => {
  res.json({
    user: req.user,
    metrics: { totalTasks: 10, completedTasks: 7, pendingTasks: 3 },
    recentActivity: [
      { action: "Login", timestamp: new Date().toISOString() },
      { action: "Task completed", timestamp: new Date().toISOString() }
    ]
  });
});

module.exports = router;