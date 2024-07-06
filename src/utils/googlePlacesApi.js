const axios = require('axios');

const getRestaurants = async (location) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
    params: {
      location: `${location.lat},${location.lng}`,
      radius: 5000,
      type: 'restaurant',
      key: process.env.GOOGLE_API_KEY
    }
  });
  return response.data.results;
};

module.exports = { getRestaurants };
