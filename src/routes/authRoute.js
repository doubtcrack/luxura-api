const express = require("express");
const { register, login, protect } = require("../controllers/authController");
const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);

// Protected route example
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = router;
