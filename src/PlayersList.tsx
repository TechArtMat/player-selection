import { parsePlayerData } from "./parsePlayerData";
import data from "./playersData.tsv?raw";
import styles from "./PlayersList.module.css";
import { useAppContext } from "./AppContext";
import { useEffect, useState } from "react";
import { PlayerData } from "./types/PlayerData";
import { importFromTextarea } from "./importFromTextarea";
import { PlayerCard } from "./PlayerCard";

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
    <div className={styles.availablePlayersContainer}>
      <h2 className={styles.textH2}>AVAILABLE PLAYERS</h2>
      <div className={styles.decContainer}>
        <div
          className={styles.decContainerS + " " + styles.decColorAvlPlS}
        ></div>
        <div
          className={styles.decContainerB + " " + styles.decColorAvlPlB}
        ></div>
      </div>
      <div className={styles.availablePlayersInput}>
        <label data-testid="search-players-input">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchPlayerInput}
            placeholder="Search by name..."
          />
        </label>
      </div>
      <ul
        className={styles.availablePlayers}
        data-testid="available-players-list"
      >
        {filteredPlayers.map((playerData) => (
          <li
            className={styles.playerRow}
            data-testid="player-row"
            key={playerData.name}
            onClick={() => addToTeam(playerData)}
          >
            {PlayerCard({ playerData, isInTeam: false })}
            {/* TODO REACT <COMPONENT></COMPONENT> */}
          </li>
        ))}
      </ul>
      <div className={styles.addPlayer}>
        <input
          className={styles.addPlayerItem}
          id="playerName"
          data-testid="name-input"
          type="text"
          value={inputPlayer.name}
          onChange={(e) =>
            setInputPlayer({ ...inputPlayer, name: e.target.value })
          }
          placeholder="Name"
        />
        <input
          className={styles.addPlayerItem}
          id="clanTag"
          data-testid="clanTag-input"
          type="text"
          value={inputPlayer.clanTag}
          onChange={(e) =>
            setInputPlayer({ ...inputPlayer, clanTag: e.target.value })
          }
          placeholder="Clan Tag"
        />
        <input
          className={styles.addPlayerItem}
          id="playerKDTrials"
          data-testid="kdTrials-input"
          type="number"
          value={inputPlayer.kdTrials}
          step={0.1}
          onChange={(e) =>
            setInputPlayer({
              ...inputPlayer,
              kdTrials: parseFloat(e.target.value),
            })
          }
          placeholder="K/D Trials"
        />
        <input
          className={styles.addPlayerItem}
          id="playerKDCrucible"
          data-testid="kdCrucible-input"
          type="number"
          value={inputPlayer.kdCrucible}
          step={0.1}
          onChange={(e) =>
            setInputPlayer({
              ...inputPlayer,
              kdCrucible: parseFloat(e.target.value),
            })
          }
          placeholder="K/D Crucible"
        />
        <button
          data-testid="submit-button"
          className={styles.addPlayerItem}
          onClick={importFromInputs}
        >
          Add Player
        </button>
      </div>
      <div className={styles.availablePlayersInput}>
        <textarea
          className={styles.playerBaseInput}
          data-testid="players-base-input"
          value={textareaData}
          onChange={(e) => setTextareaData(e.target.value)}
          placeholder="Enter players in format: Name ClanTag K/DTrials K/DCrucible"
        ></textarea>
        <button
          id="importPlayers"
          data-testid="players-base-submit-button"
          onClick={handleImportFromTextarea}
        >
          Import Players
        </button>
      </div>
    </div>
  );
}
