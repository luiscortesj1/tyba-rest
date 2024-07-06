const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // Cantidad de datos encontrados
  location: { type: String, required: true }, // Ubicación (ciudad o coordenadas)
  timestamp: { type: Date, default: Date.now }, // Fecha y hora de la transacción
});

module.exports = mongoose.model("Transaction", TransactionSchema);
