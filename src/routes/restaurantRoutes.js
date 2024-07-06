const express = require("express");
const { getRestaurants } = require("../controllers/restaurantController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getRestaurants);

module.exports = router;
