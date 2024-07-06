/**
 * Este módulo utiliza la API de Google Places para obtener una lista de restaurantes cerca de una ubicación dada.
 * Exporta una única función, `getRestaurants`, que toma un objeto de ubicación con latitud y longitud,
 * hace una solicitud HTTP GET a la API de Google Places y devuelve un array de resultados de restaurantes.
 */
const axios = require("axios");

const getRestaurants = async (location) => {
  const response = await axios.get(
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
  return response.data.results;
};

module.exports = { getRestaurants };
