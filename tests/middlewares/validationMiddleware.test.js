const Joi = require("joi");
const validateJoi = require("../../src/middlewares/validationMiddleware"); // Adjust the path as necessary

// Mock objects for req, res, and next
const mockRequest = (body) => ({
  body,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// Define a Joi schema for testing
const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  age: Joi.number().integer().min(0).max(120).required(),
});

describe("validateJoi Middleware", () => {
  beforeEach(() => {
    mockNext.mockClear();
  });

  test("should call next() for valid input", () => {
    const req = mockRequest({ name: "John Doe", age: 25 });
    const res = mockResponse();

    validateJoi(schema)(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test("should return 400 for invalid input (missing required field)", () => {
    const req = mockRequest({ name: "John Doe" }); // Missing age
    const res = mockResponse();

    validateJoi(schema)(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.any(String),
    });
  });

  test("should return 400 for invalid input (field type mismatch)", () => {
    const req = mockRequest({ name: "John Doe", age: "twenty-five" }); // age should be a number
    const res = mockResponse();

    validateJoi(schema)(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.any(String),
    });
  });

  test("should return 400 for invalid input (string length out of bounds)", () => {
    const req = mockRequest({ name: "J", age: 25 }); // name too short
    const res = mockResponse();

    validateJoi(schema)(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.any(String),
    });
  });

  test("should return 400 for invalid input (number out of bounds)", () => {
    const req = mockRequest({ name: "John Doe", age: 130 }); // age too high
    const res = mockResponse();

    validateJoi(schema)(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.any(String),
    });
  });

  test("should handle edge case of empty body", () => {
    const req = mockRequest({});
    const res = mockResponse();

    validateJoi(schema)(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.any(String),
    });
  });

  test("should handle edge case of null body", () => {
    const req = mockRequest(null);
    const res = mockResponse();

    validateJoi(schema)(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.any(String),
    });
  });
});