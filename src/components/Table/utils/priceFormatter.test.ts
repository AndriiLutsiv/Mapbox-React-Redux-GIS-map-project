import { priceFormatter } from "./priceFormatter";

describe("priceFormatter function", () => {
  it("should format the price correctly", () => {
    // Test cases for different input values
    const testCases = [
      { input: 0, expected: "0.00" },
      { input: 1000, expected: "1,000.00" },
      { input: 12345.6789, expected: "12,345.68" },
      { input: 9999999.99, expected: "9,999,999.99" },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(priceFormatter(input)).toBe(expected);
    });
  });
});
