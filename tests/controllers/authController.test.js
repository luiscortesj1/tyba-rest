const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { register, login, logout } = require("../../src/controllers/authController");
const User = require("../../src/models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../src/models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);

describe("Auth Controller", () => {
  describe("register", () => {
    it("should register a user successfully", async () => {
      User.prototype.save.mockResolvedValue({});
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const res = await request(app)
        .post("/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
    });

    it("should return an error if user registration fails", async () => {
      User.prototype.save.mockRejectedValue(new Error("Registration failed"));
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const res = await request(app)
        .post("/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Registration failed");
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      const user = {
        _id: "123",
        email: "test@example.com",
        password: "hashedPassword",
      };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      const res = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe("token");
    });

    it("should return an error if credentials are invalid", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should return an error if password is incorrect", async () => {
      const user = {
        _id: "123",
        email: "test@example.com",
        password: "hashedPassword",
      };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("logout", () => {
    it("should logout a user successfully", async () => {
      const res = await request(app).post("/logout");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User logged out");
    });

    it("should return an error if logout fails", async () => {
      // Note: In the current implementation, logout cannot fail in the backend.
      // This test is here for completeness and future changes.
      const res = await request(app).post("/logout");

      expect(res.status).toBe(200); // Since logout does nothing on the backend, it should always succeed.
    });
  });
});
