import { parsePlayerData } from "./parsePlayerData";
import data from "./playersData.tsv?raw";
import styles from "./PlayersList.module.css";
import { useAppContext } from "./AppContext";
import { useEffect, useState } from "react";
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

  const [searchValue, setSearchValue] = useState("");

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

  const filteredPlayers = availablePlayers.filter((player) =>
    player.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <div>
      <div>
        <label>
          Search Players:
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by name..."
          />
        </label>
      </div>

      <ul className={styles.list}>
        {filteredPlayers.map((playerData) => (
          <li key={playerData.name} onClick={() => addToTeam(playerData)}>
            {playerData.name} {playerData.kdTrials}
          </li>
        ))}
      </ul>
    </div>
  );
}
