const axios = require("axios");
const { getRestaurants } = require("../../src/controllers/restaurantController");
const Transaction = require("../../src/models/Transaction");

jest.mock("axios");
jest.mock("../../src/models/Transaction");

describe("getRestaurants", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      userId: "12345", // Mock user ID
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Transaction.mockClear();
    axios.get.mockClear();
  });

  it("should return restaurants based on city name", async () => {
    req.query.city = "Maicao, La Guajira";

    axios.get
      .mockResolvedValueOnce({
        data: {
          results: [
            { geometry: { location: { lat: 11.3771, lng: -72.2418 } } },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [{ name: "Restaurant 1" }, { name: "Restaurant 2" }],
        },
      });

    await getRestaurants(req, res);

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith([
      { name: "Restaurant 1" },
      { name: "Restaurant 2" },
    ]);
    expect(Transaction).toHaveBeenCalledWith({
      userId: "12345",
      amount: 2,
      location: "Maicao, La Guajira",
    });
  });

  it("should return restaurants based on coordinates", async () => {
    req.query.coordinates = "11.3771,-72.2418";

    axios.get.mockResolvedValueOnce({
      data: {
        results: [{ name: "Restaurant 1" }, { name: "Restaurant 2" }],
      },
    });

    await getRestaurants(req, res);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([
      { name: "Restaurant 1" },
      { name: "Restaurant 2" },
    ]);
    expect(Transaction).toHaveBeenCalledWith({
      userId: "12345",
      amount: 2,
      location: "11.3771,-72.2418",
    });
  });

  it("should return an error if no city or coordinates are provided", async () => {
    await getRestaurants(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "City or coordinates are required",
    });
  });

  it("should handle errors from the geocoding API", async () => {
    req.query.city = "Nonexistent City";

    axios.get.mockRejectedValueOnce(new Error("Geocoding API Error"));

    await getRestaurants(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Geocoding API Error" });
  });

  it("should handle errors from the places API", async () => {
    req.query.city = "Maicao, La Guajira";

    axios.get
      .mockResolvedValueOnce({
        data: {
          results: [
            { geometry: { location: { lat: 11.3771, lng: -72.2418 } } },
          ],
        },
      })
      .mockRejectedValueOnce(new Error("Places API Error"));

    await getRestaurants(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Places API Error" });
  });

  it("should handle errors when saving the transaction", async () => {
    req.query.city = "Maicao, La Guajira";

    axios.get
      .mockResolvedValueOnce({
        data: {
          results: [
            { geometry: { location: { lat: 11.3771, lng: -72.2418 } } },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [{ name: "Restaurant 1" }, { name: "Restaurant 2" }],
        },
      });

    Transaction.prototype.save.mockRejectedValueOnce(
      new Error("Database Error")
    );

    await getRestaurants(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database Error" });
  });
});
