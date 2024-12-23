import { useState } from "react";

export type ShuffleCriterion = "kdTrials" | "kdCrucible";

export function useShuffleCriterion(
  initialValue: ShuffleCriterion = "kdTrials",
) {
  const [shuffleCriterion, setShuffleCriterion] =
    useState<ShuffleCriterion>(initialValue);

  const handleShuffleCriterionChange = (value: ShuffleCriterion) => {
    setShuffleCriterion(value);
  };

  return { shuffleCriterion, handleShuffleCriterionChange };
}
