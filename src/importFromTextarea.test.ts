import { expect, test } from "vitest";
import { importFromTextarea } from "./importFromTextarea";

test("should correctly return that object with #", () => {
  expect(importFromTextarea("qwe#1111 clan 1 1")).toEqual([
    {
      name: "qwe#1111",
      clanTag: "clan",
      kdTrials: 1,
      kdCrucible: 1,
    },
  ]);
});
