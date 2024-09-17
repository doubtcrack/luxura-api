const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
} = require("../controllers/userController");

const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET a specific user by ID
router.get("/:id", getUserById);

// POST a new user
router.post("/", createUser);

module.exports = router;
