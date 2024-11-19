import { PlayerData } from "./types/PlayerData";

export function sortPlayers(players: PlayerData[]) {
  players.sort((a, b) => b.kdTrials - a.kdTrials);
  return players;
}
