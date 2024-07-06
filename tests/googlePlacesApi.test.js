const axios = require("axios");
const { getRestaurants } = require("../src/utils/googlePlacesApi");

// Mock de axios para simular la respuesta de la API
jest.mock("axios");

describe("getRestaurants", () => {
  it("should return a list of restaurants", async () => {
    const mockData = {
      data: {
        results: [
          { name: "Restaurant A" },
          { name: "Restaurant B" },
          { name: "Restaurant C" },
        ],
      },
    };

    axios.get.mockResolvedValue(mockData);

    const location = { lat: 40.7128, lng: -74.006 };

    const restaurants = await getRestaurants(location);

    expect(restaurants).toHaveLength(3);
    expect(restaurants[0].name).toEqual("Restaurant A");
    expect(restaurants[1].name).toEqual("Restaurant B");
    expect(restaurants[2].name).toEqual("Restaurant C");
  });

  it("should handle errors gracefully", async () => {
    const errorMessage = "Network Error";

    axios.get.mockRejectedValue(new Error(errorMessage));

    const location = { lat: 40.7128, lng: -74.006 };

    await expect(getRestaurants(location)).rejects.toThrow(errorMessage);
  });
});
