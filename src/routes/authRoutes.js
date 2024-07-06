const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const validateJoi = require("../middlewares/validationMiddleware");
const { registerSchema, loginSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", validateJoi(registerSchema), register);
router.post("/login", validateJoi(loginSchema), login);
router.post("/logout", logout);

module.exports = router;
