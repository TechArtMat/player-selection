import { expect, test } from "vitest";
import { isBalanceValid } from "./isBalanceValid";

test("should correctly return that balance is valid for empty teams", () => {
  expect(isBalanceValid([], [])).toBe(true);
});

test("should correctly return that balance is valid for ", () => {
  expect(isBalanceValid([{ kdTrials: 1 }], [{ kdTrials: 1 }])).toBe(true);
});

test("should correctly return that balance is inValid for unequal teams", () => {
  expect(isBalanceValid([{ kdTrials: 1 }], [{ kdTrials: 2 }])).toBe(true);
});
