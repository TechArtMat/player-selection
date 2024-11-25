import { parsePlayerData } from "./parsePlayerData";
import data from "./playersData.tsv?raw";
import styles from "./PlayersList.module.css";
import { useAppContext } from "./AppContext";
import { useEffect } from "react";
import { PlayerData } from "./types/PlayerData";

export function PlayersList() {
  const {
    availablePlayers,
    setAvailablePlayers,
    currentTeamA,
    setCurrentTeamA,
    currentTeamB,
    setCurrentTeamB,
  } = useAppContext();
  useEffect(() => {
    const parseData = parsePlayerData(data);
    setAvailablePlayers(parseData);
  }, []);

  const addToTeam = (playerData: PlayerData) => {
    const updatedAvailablePlayers = availablePlayers.filter(
      (player) => player.name !== playerData.name,
    );
    setAvailablePlayers(updatedAvailablePlayers);

    if (currentTeamA.length <= currentTeamB.length) {
      setCurrentTeamA([...currentTeamA, playerData]);
    } else {
      setCurrentTeamB([...currentTeamB, playerData]);
    }
  };

  return (
    <ul className={styles.list}>
      {availablePlayers.map((playerData) => (
        <li key={playerData.name} onClick={() => addToTeam(playerData)}>
          {playerData.name} {playerData.kdTrials}
        </li>
      ))}
    </ul>
  );
}
