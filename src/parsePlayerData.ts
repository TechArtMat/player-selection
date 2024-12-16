import { PlayerData } from "./types/PlayerData";
import { sortPlayers } from "./sortPlayer";

export function parsePlayerData(baseText: string) {
  const parsedPlayers: PlayerData[] = [];
  const lines = baseText.split("\n");

  lines.forEach((line) => {
    // eslint-disable-next-line prefer-const
    let [name, other] = line.split("#");

    const parts = other.split("\t");
    name = name + "#" + parts[0];
    const [clanTag, kdTrials, kdCrucible] = parts.slice(1);

    const player = {
      name,
      clanTag,
      kdTrials: parseFloat(kdTrials),
      kdCrucible: parseFloat(kdCrucible),
    };
    parsedPlayers.push(player);
  });
  sortPlayers(parsedPlayers);

  return parsedPlayers;
}
