/**
 * Este archivo define un controlador para manejar operaciones relacionadas con transacciones.
 * Incluye una función `getTransactions` que recupera las transacciones asociadas con un usuario específico.
 * La función extrae el ID del usuario autenticado del objeto de la solicitud, consulta la base de datos
 * para obtener las transacciones que coinciden con ese ID de usuario y devuelve los resultados en formato JSON.
 * En caso de error, responde con un código de estado 500 y un mensaje de error.
 */
const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  const userId = req.userId; // Obtén el ID del usuario autenticado desde req.user

  try {
    // Buscar transacciones filtrando por userId
    const transactions = await Transaction.find({ userId }).select("-__v");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTransactions };
