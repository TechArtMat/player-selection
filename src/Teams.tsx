import styles from "./Teams.module.css";
import { Team } from "./Team";
import { useAppContext } from "./AppContext";
import { PlayerData } from "./types/PlayerData";
import { useEffect, useRef, useState } from "react";
import { calculateAverageKD } from "./isBalanceValid";
import { takeScreenshot } from "./takeScreenshot";
import { useShuffleCriterion } from "./useShuffleCriterion";

export function Teams() {
  const {
    currentTeamA,
    setCurrentTeamA,
    setCurrentTeamB,
    currentTeamB,
    setAvailablePlayers,
    availablePlayers,
  } = useAppContext();

  const { shuffleCriterion, handleShuffleCriterionChange } =
    useShuffleCriterion();

  // const [minValue, setMinValue] = useState(0.01);
  const [minValue] = useState(0.01);
  const [maxValue, setMaxValue] = useState(0.5);

  const teamsConfig = [
    {
      players: currentTeamA,
      setTeam: setCurrentTeamA,
      otherTeam: currentTeamB,
      setOtherTeam: setCurrentTeamB,
      maxSlots: 6,
    },
    {
      players: currentTeamB,
      setTeam: setCurrentTeamB,
      otherTeam: currentTeamA,
      setOtherTeam: setCurrentTeamA,
      maxSlots: 6,
    },
  ];

  const teamNames = ["Alpha", "Bravo"];

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

  const shuffleArray = (array: PlayerData[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleShuffleTeams = () => {
    const allPlayers = [...currentTeamA, ...currentTeamB];
    const lockedA = currentTeamA.filter((player) => player.isLocked);
    const lockedB = currentTeamB.filter((player) => player.isLocked);
    const unlockedPlayers = allPlayers.filter((player) => !player.isLocked);
    const shuffledUnlocked = shuffleArray(unlockedPlayers);

    const targetLengthA = Math.floor(
      (currentTeamA.length + currentTeamB.length) / 2,
    );

    const newTeamA = [
      ...lockedA,
      ...shuffledUnlocked.slice(0, targetLengthA - lockedA.length),
    ];
    const newTeamB = [
      ...lockedB,
      ...shuffledUnlocked.slice(targetLengthA - lockedA.length),
    ];

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
    <div className={styles.teams}>
      <div
        className={styles.teamWrapper}
        ref={teamWrapperRef}
        data-testid="teams-wrapper"
      >
        {teamsConfig.map(
          ({ players, setTeam, otherTeam, setOtherTeam }, index) => (
            <div
              key={index}
              className={styles.team}
              data-testid={`team-${teamNames[index]}`}
            >
              <Team
                players={players}
                maxPlayers={6}
                kdCriterion={shuffleCriterion}
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
      <div className={styles.tools}>
        <p data-testid="kdDiff">K/D Difference: {kdDifference.toFixed(2)}</p>
        <div>
          <div className={styles.toolsBtnSliderWrapper}>
            {/* <label className={styles.sliderText}>
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
              {minValue}
            </label> */}
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
              {maxValue}
            </label>
          </div>
          <div className={styles.toolsBtnWrapper}>
            <div className={styles.toolsBtnContainer}>
              <button
                className={`${styles.btnTrials} ${styles.toolsBtn} ${
                  shuffleCriterion === "kdTrials" ? styles.active : ""
                }`}
                data-testid="radio-trials"
                onClick={() => handleShuffleCriterionChange("kdTrials")}
              ></button>
              <div className={styles.radioBtnDec}></div>
            </div>
            <div className={styles.toolsBtnContainer}>
              <button
                className={`${styles.radioBtn} ${styles.btnCrucible} ${styles.toolsBtn} ${
                  shuffleCriterion === "kdCrucible" ? styles.active : ""
                }`}
                data-testid="radio-crucible"
                onClick={() => handleShuffleCriterionChange("kdCrucible")}
              ></button>
              <div className={styles.radioBtnDec}></div>
            </div>
          </div>
          <div className={styles.toolsBtnWrapper}>
            <div className={styles.toolsBtnContainer}>
              <button
                className={styles.toolsBtn}
                data-testid="reset-teams-button"
                onClick={handleResetBothTeams}
              >
                Clear
              </button>
              {/* <div className={styles.radioBtnDec}></div> */}
            </div>
            <div className={styles.toolsBtnContainer}>
              <button
                className={styles.toolsBtn}
                data-testid="shuffle-teams-button"
                onClick={handleShuffleTeams}
              >
                Shuffle
              </button>
              {/* <div className={styles.radioBtnDec}></div> */}
            </div>
            <div className={styles.toolsBtnContainer}>
              <button
                className={styles.toolsBtn}
                data-testid="screenshot-teams-button"
                onClick={handleScreenshot}
              >
                Take Screenshot
              </button>
              {/* <div className={styles.radioBtnDec}></div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
