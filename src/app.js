const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
/*const restaurantRoutes = require("./routes/restaurantRoutes");
const transactionRoutes = require("./routes/transactionRoutes"); */
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
//app.use("/api/restaurants", restaurantRoutes);
//app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT ?? 3000;

/* const connectToDatabaseAndStartServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

connectToDatabaseAndStartServer(); */

module.exports = app;
