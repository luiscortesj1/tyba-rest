const jwt = require("jsonwebtoken");
const authMiddleware = require("../../src/middlewares/authMiddleware"); // Adjust the path to where your middleware is located

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer validToken",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should attach userId to req and call next if token is valid", () => {
    const decoded = { id: "12345" };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validToken",
      process.env.JWT_SECRET,
      expect.any(Function)
    );
    expect(req.userId).toBe(decoded.id);
    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if no token is provided", () => {
    req.headers.authorization = "";

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token verification fails", () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validToken",
      process.env.JWT_SECRET,
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to authenticate token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle missing authorization header gracefully", () => {
    req.headers = {};

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle malformed authorization header gracefully", () => {
    req.headers.authorization = "Bearer";

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to authenticate token",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
