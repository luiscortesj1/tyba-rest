module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  testTimeout: 70000,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/server.js",
    "!src/**/*.test.js",
  ],
  coverageReporters: ["text", "text-summary"],
};
