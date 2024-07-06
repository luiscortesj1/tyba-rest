const request = require("supertest");
const app = require("../src/app"); // Adjust the path as necessary

describe("Express Application", () => {
  it("should have a JSON body parser middleware", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("should route /api/auth to authRoutes", async () => {
    const response = await request(app).get("/api/auth/test");
    expect(response.status).toBe(404);
  });

  it("should route /api/restaurants to restaurantRoutes", async () => {
    const response = await request(app).get("/api/restaurants/test");
    expect(response.status).toBe(404);
  });

  it("should route /api/transactions to transactionRoutes", async () => {
    const response = await request(app).get("/api/transactions/test");
    expect(response.status).toBe(404);
  });
});
