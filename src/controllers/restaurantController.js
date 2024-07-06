const axios = require("axios");
const Transaction = require("../models/Transaction");

const getRestaurants = async (req, res) => {
  const { city, coordinates } = req.query;
  try {
    let location;
    if (city) {
      // Obtener coordenadas de la ciudad (usando una API externa como Google Geocoding)
      const geoResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: city,
            key: process.env.GOOGLE_API_KEY,
          },
        }
      );
      location = geoResponse.data.results[0].geometry.location;
    } else if (coordinates) {
      location = {
        lat: coordinates.split(",")[0],
        lng: coordinates.split(",")[1],
      };
    } else {
      return res
        .status(400)
        .json({ message: "City or coordinates are required" });
    }

    // Obtener restaurantes cercanos usando Google Places API
    const placesResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: 5000,
          type: "restaurant",
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );
    // Guardar la transacción en el historial
    const transactionData = {
      userId: req.userId, // Suponiendo que tienes el ID del usuario desde la autenticación
      amount: placesResponse.data.results.length, // Ejemplo de monto (cantidad de resultados)
      location: city ?? `${location.lat},${location.lng}`, // Guarda la ciudad o las coordenadas según lo que se usó
    };
    const newTransaction = new Transaction(transactionData);
    await newTransaction.save();
    console.log("Transacción registrada correctamente");

    res.json(placesResponse.data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRestaurants };
