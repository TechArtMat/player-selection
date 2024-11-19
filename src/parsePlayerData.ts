import { PlayerData } from "./types/PlayerData";
import { sortPlayers } from "./sortPlayer";

export function parsePlayerData(baseText: string) {
  const parsedPlayers: PlayerData[] = [];
  const lines = baseText.split("\n");

  lines.forEach((line) => {
    if (line.includes("#")) {
      // eslint-disable-next-line prefer-const
      let [name, other] = line.split("#");
      if (!other) return;

      const parts = other.split("\t");
      name = name + "#" + (parts[0] || "");
      const [clanTag, kdTrials, kdCrucible] = parts.slice(1);

      const player = {
        name,
        clanTag,
        kdTrials: parseFloat(kdTrials) || 0,
        kdCrucible: parseFloat(kdCrucible) || 0,
      };
      parsedPlayers.push(player);
    } else {
      const parts = line.split(/\s+/);
      const [name, clanTag, kdTrials, kdCrucible] = parts;

      const player = {
        name,
        clanTag,
        kdTrials: parseFloat(kdTrials) || 0,
        kdCrucible: parseFloat(kdCrucible) || 0,
      };
      parsedPlayers.push(player);
    }
  });
  sortPlayers(parsedPlayers);

  return parsedPlayers;
}
