import { PlayerData } from "./types/PlayerData";

export function importFromTextarea(textareaData: string) {
  const lines = textareaData.split("\n");
  const newPlayers: PlayerData[] = [];

  lines.forEach((line) => {
    let [name, other] = line.split("#");

    let parts = other.split(/\s+/);
    name = name + "#" + parts[0];
    let [clanTag, kdTrials, kdCrucible] = parts.slice(1);

    const player: PlayerData = {
      name,
      clanTag: clanTag,
      kdTrials: parseFloat(kdTrials),
      kdCrucible: parseFloat(kdCrucible),
    };
    newPlayers.push(player);
  });

  return newPlayers;
}
