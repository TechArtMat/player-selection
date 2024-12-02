import styles from "./PlayersList.module.css";
import { Team } from "./Team";
import { useAppContext } from "./AppContext";
import { PlayerData } from "./types/PlayerData";
import { useEffect, useState } from "react";
import { calculateAverageKD } from "./isBalanceValid";

export function Teams() {
  const {
    currentTeamA,
    setCurrentTeamA,
    setCurrentTeamB,
    currentTeamB,
    setAvailablePlayers,
    availablePlayers,
  } = useAppContext();

  const [minValue, setMinValue] = useState(0.01);
  const [maxValue, setMaxValue] = useState(0.5);

  const teamsConfig = [
    {
      players: currentTeamA,
      setTeam: setCurrentTeamA,
      otherTeam: currentTeamB,
      setOtherTeam: setCurrentTeamB,
    },
    {
      players: currentTeamB,
      setTeam: setCurrentTeamB,
      otherTeam: currentTeamA,
      setOtherTeam: setCurrentTeamA,
    },
  ];

  const shuffleArray = (array: PlayerData[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleShuffleTeams = () => {
    const allPlayers = [...currentTeamA, ...currentTeamB];
    const shuffledPlayers = shuffleArray(allPlayers);
    const mid = Math.ceil(shuffledPlayers.length / 2);

    setCurrentTeamA(shuffledPlayers.slice(0, mid));
    setCurrentTeamB(shuffledPlayers.slice(mid));
    // TODO: WHILE
  };

  const handleRemovePlayer =
    (team: PlayerData[], setTeam: (players: PlayerData[]) => void) =>
    (playerToRemove: PlayerData) => {
      setTeam(team.filter((player) => player !== playerToRemove));
      setAvailablePlayers([...availablePlayers, playerToRemove]);
    };

  const handleResetBothTeams = () => {
    const allPlayers = [...currentTeamA, ...currentTeamB];
    setAvailablePlayers([...availablePlayers, ...allPlayers]);
    setCurrentTeamA([]);
    setCurrentTeamB([]);
  };

  const kdDifference = Math.abs(
    calculateAverageKD(currentTeamA) - calculateAverageKD(currentTeamB),
  );

  const handleSwitchPlayer =
    (
      fromTeam: PlayerData[],
      setFromTeam: (players: PlayerData[]) => void,
      toTeam: PlayerData[],
      setToTeam: (players: PlayerData[]) => void,
    ) =>
    (playerToSwitch: PlayerData) => {
      setFromTeam(fromTeam.filter((player) => player !== playerToSwitch));
      setToTeam([...toTeam, playerToSwitch]);
    };

  useEffect(() => {
    if (kdDifference <= minValue || kdDifference >= maxValue) {
      handleShuffleTeams();
    }
  }, [kdDifference, minValue, maxValue]);

  return (
    <div>
      <div>
        {teamsConfig.map(
          ({ players, setTeam, otherTeam, setOtherTeam }, index) => (
            <div key={index} className={styles.list}>
              <Team
                players={players}
                onRemove={handleRemovePlayer(players, setTeam)}
                onSwitch={handleSwitchPlayer(
                  players,
                  setTeam,
                  otherTeam,
                  setOtherTeam,
                )}
              />
            </div>
          ),
        )}
      </div>
      <br />
      <p>K/D Difference: {kdDifference.toFixed(2)}</p>
      <br />
      <div>
        <label>
          minValue
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value))}
          />
          <br />
          {minValue}
        </label>
        <br />
        <label>
          maxValue
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
          />
          <br />
          {maxValue}
        </label>
        <br />
        <button onClick={handleResetBothTeams}>Clear</button>
        <br />
        <button onClick={handleShuffleTeams}>Shuffle</button>
      </div>
    </div>
  );
}
