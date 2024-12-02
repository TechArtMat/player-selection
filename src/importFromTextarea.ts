import { PlayerData } from "./types/PlayerData";

export function importFromTextarea(textareaData: string) {
  const lines = textareaData.split("\n");
  const newPlayers: PlayerData[] = [];

  lines.forEach((line) => {
    if (line.includes("#")) {
      let [name, other] = line.split("#");
      if (!other) return;

      let parts = other.split(/\s+/);
      name = name + "#" + (parts[0] || "");
      let [clanTag, kdTrials, kdCrucible] = parts.slice(1);

      const player: PlayerData = {
        name,
        clanTag: clanTag,
        kdTrials: parseFloat(kdTrials),
        kdCrucible: parseFloat(kdCrucible),
      };
      newPlayers.push(player);
    } else {
      let parts = line.split(/\s+/);
      let [name, clanTag, kdTrials, kdCrucible] = parts;

      const player = {
        name,
        clanTag,
        kdTrials: parseFloat(kdTrials),
        kdCrucible: parseFloat(kdCrucible),
      };
      newPlayers.push(player);
    }
  });

  return newPlayers;
}
