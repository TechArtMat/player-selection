import styles from "./PlayersList.module.css";
import { Team } from "./Team";
import { useAppContext } from "./AppContext";
import { PlayerData } from "./types/PlayerData";
import { useEffect, useRef, useState } from "react";
import { calculateAverageKD } from "./isBalanceValid";
import { takeScreenshot } from "./takeScreenshot";

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
  const [shuffleCriterion, setShuffleCriterion] = useState<
    "kdTrials" | "kdCrucible"
  >("kdTrials");

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

  const teamNames = ["alpha", "bravo"];

  const shuffleArray = (array: PlayerData[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const toggleLockPlayer = (
    player: PlayerData,
    players: PlayerData[],
    setTeam: (players: PlayerData[]) => void,
  ) => {
    const updatedPlayers = players.map((p) =>
      p.name === player.name ? { ...p, isLocked: !p.isLocked } : p,
    );
    setTeam(updatedPlayers);
  };

  const handleShuffleTeams = () => {
    const allPlayers = [...currentTeamA, ...currentTeamB];
    const lockedA = currentTeamA.filter((player) => player.isLocked);
    const lockedB = currentTeamB.filter((player) => player.isLocked);
    const unlockedPlayers = allPlayers.filter((player) => !player.isLocked);
    const shuffledUnlocked = shuffleArray(unlockedPlayers);

    const mid = Math.ceil(shuffledUnlocked.length / 2);
    const newTeamA = [...lockedA, ...shuffledUnlocked.slice(0, mid)];
    const newTeamB = [...lockedB, ...shuffledUnlocked.slice(mid)];

    setCurrentTeamA(newTeamA);
    setCurrentTeamB(newTeamB);
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

  const teamWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleScreenshot = async () => {
    await takeScreenshot(teamWrapperRef.current!);
  };

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
      <div ref={teamWrapperRef} data-testid="teams-wrapper">
        {teamsConfig.map(
          ({ players, setTeam, otherTeam, setOtherTeam }, index) => (
            <div
              key={index}
              className={styles.list}
              data-testid={`team-${teamNames[index]}`}
            >
              <Team
                players={players}
                onRemove={handleRemovePlayer(players, setTeam)}
                onSwitch={handleSwitchPlayer(
                  players,
                  setTeam,
                  otherTeam,
                  setOtherTeam,
                )}
                onLockToggle={(player) =>
                  toggleLockPlayer(player, players, setTeam)
                }
                name={teamNames[index]}
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
            data-testid="range-input-min"
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
            data-testid="range-input-max"
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
        <div>
          <label>
            <input
              type="radio"
              name="shuffleCriterion"
              value="kdTrials"
              checked
            />
            K/D Trials
          </label>
          <label>
            <input type="radio" name="shuffleCriterion" value="kdCrucible" />
            K/D Crucible
          </label>
        </div>
        <br />
        <button data-testid="reset-teams-button" onClick={handleResetBothTeams}>
          Clear
        </button>
        <br />
        <button data-testid="shuffle-teams-button" onClick={handleShuffleTeams}>
          Shuffle
        </button>
        <button
          data-testid="screenshot-teams-button"
          onClick={handleScreenshot}
        >
          Take Screenshot
        </button>
      </div>
    </div>
  );
}
