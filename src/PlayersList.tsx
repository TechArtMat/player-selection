import { parsePlayerData } from "./parsePlayerData";
import data from "./playersData.tsv?raw";
import styles from "./PlayersList.module.css";
import { useAppContext } from "./AppContext";
import { useEffect, useState } from "react";
import { PlayerData } from "./types/PlayerData";
import { importFromTextarea } from "./importFromTextarea";

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
  const [textareaData, setTextareaData] = useState("");
  const [inputPlayer, setInputPlayer] = useState({
    name: "",
    clanTag: "",
    kdTrials: 0,
    kdCrucible: 0,
  });

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

  const handleImportFromTextarea = () => {
    const newPlayers = importFromTextarea(textareaData);
    console.log(newPlayers);
    setAvailablePlayers([...availablePlayers, ...newPlayers]);
    setTextareaData("");
  };

  const importFromInputs = () => {
    if (
      inputPlayer.name &&
      inputPlayer.clanTag &&
      !isNaN(inputPlayer.kdTrials) &&
      !isNaN(inputPlayer.kdCrucible)
    ) {
      setAvailablePlayers([...availablePlayers, inputPlayer]);
      setInputPlayer({ name: "", clanTag: "", kdTrials: 0, kdCrucible: 0 });
    }
  };

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

      <div>
        <h3>Import Players Base</h3>
        <textarea
          value={textareaData}
          onChange={(e) => setTextareaData(e.target.value)}
          placeholder="Enter players in format: Name ClanTag K/DTrials K/DCrucible"
        ></textarea>
        <button onClick={handleImportFromTextarea}>Import Players</button>
      </div>

      <div>
        <h3>Import Player</h3>
        <input
          type="text"
          value={inputPlayer.name}
          onChange={(e) =>
            setInputPlayer({ ...inputPlayer, name: e.target.value })
          }
          placeholder="Name"
        />
        <input
          type="text"
          value={inputPlayer.clanTag}
          onChange={(e) =>
            setInputPlayer({ ...inputPlayer, clanTag: e.target.value })
          }
          placeholder="Clan Tag"
        />
        <input
          type="number"
          value={inputPlayer.kdTrials}
          step={0.1}
          onChange={(e) =>
            setInputPlayer({
              ...inputPlayer,
              kdTrials: parseFloat(e.target.value) || 0,
            })
          }
          placeholder="K/D Trials"
        />
        <input
          type="number"
          value={inputPlayer.kdCrucible}
          step={0.1}
          onChange={(e) =>
            setInputPlayer({
              ...inputPlayer,
              kdCrucible: parseFloat(e.target.value) || 0,
            })
          }
          placeholder="K/D Crucible"
        />
        <button onClick={importFromInputs}>Add Player</button>
      </div>
    </div>
  );
}
