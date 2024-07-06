/**
 * Este archivo, authController.js, contiene el controlador de autenticación para una aplicación Node.js.
 * Incluye tres funciones principales:
 * 1. register: Maneja el registro de usuarios al encriptar la contraseña y guardar el usuario en la base de datos.
 * 2. login: Maneja el inicio de sesión del usuario al verificar el correo electrónico y la contraseña, luego genera un token JWT.
 * 3. logout: Maneja el cierre de sesión del usuario asumiendo que el cliente eliminará el token JWT.
 */

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    // en un sistema basado en JWT, no se hace nada en el servidor.
    // Se asume que el cliente (Fron-end) eliminará el token JWT.
    res.json({ message: "User logged out" });
  } catch (error) {
    res.status(500).json({ error: "Error logging out" });
  }
};

module.exports = { register, login, logout };
