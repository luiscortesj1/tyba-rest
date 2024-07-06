// __tests__/transactionController.test.js
const {
  getTransactions,
} = require("../../src/controllers/transactionController");
const Transaction = require("../../src/models/Transaction");

jest.mock("../../src/models/Transaction");

describe("getTransactions", () => {
  it("should return transactions for authenticated user", async () => {
    const req = { userId: "user123" };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const transactions = [
      { id: 1, amount: 100 },
      { id: 2, amount: 200 },
    ];

    Transaction.find = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(transactions),
    });

    await getTransactions(req, res);

    expect(Transaction.find).toHaveBeenCalledWith({ userId: "user123" });
    expect(res.json).toHaveBeenCalledWith(transactions);
  });

  it("should return empty array when no transactions found for userId", async () => {
    const req = { userId: "user123" };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Transaction.find = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue([]),
    });

    await getTransactions(req, res);

    expect(Transaction.find).toHaveBeenCalledWith({ userId: "user123" });
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
