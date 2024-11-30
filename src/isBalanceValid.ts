import { PlayerData } from "./types/PlayerData";

export function isBalanceValid(
  teamA: Pick<PlayerData, "kdTrials">[],
  teamB: Pick<PlayerData, "kdTrials">[],
): boolean {
  const avgKDA = calculateAverageKD(teamA);
  const avgKDB = calculateAverageKD(teamB);
  const sizeA = teamA.length;
  const sizeB = teamB.length;

  if (sizeA < sizeB) {
    return avgKDA > avgKDB;
  } else if (sizeB < sizeA) {
    return avgKDB > avgKDA;
  }
  return true;
}

export function calculateAverageKD(
  team: Pick<PlayerData, "kdTrials">[],
): number {
  if (team.length === 0) return 0;
  const totalKD = team.reduce((sum, player) => sum + player.kdTrials, 0);
  return totalKD / team.length;
}
