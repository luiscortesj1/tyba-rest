/**
 * Este archivo define las rutas de autenticación para una aplicación Express.js.
 * Importa los módulos y middleware necesarios, incluyendo las funciones del controlador de autenticación (register, login, logout),
 * y el middleware de validación para la validación de solicitudes usando esquemas Joi (registerSchema, loginSchema).
 * Se definen las rutas para el registro de usuarios, inicio de sesión y cierre de sesión, y se exporta el router para su uso en la aplicación principal.
 */
const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const validateJoi = require("../middlewares/validationMiddleware");
const { registerSchema, loginSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", validateJoi(registerSchema), register);
router.post("/login", validateJoi(loginSchema), login);
router.post("/logout", logout);

module.exports = router;
