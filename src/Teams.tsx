import styles from "./PlayersList.module.css";
import { Team } from "./Team";
import { useAppContext } from "./AppContext";
import { PlayerData } from "./types/PlayerData";

export function Teams() {
  const {
    currentTeamA,
    setCurrentTeamA,
    setCurrentTeamB,
    currentTeamB,
    setAvailablePlayers,
    availablePlayers,
  } = useAppContext();

  const teamsConfig = [
    { players: currentTeamA, setTeam: setCurrentTeamA },
    { players: currentTeamB, setTeam: setCurrentTeamB },
  ];

  const handleRemovePlayer =
    (team: PlayerData[], setTeam: (players: PlayerData[]) => void) =>
    (playerToRemove: PlayerData) => {
      setTeam(team.filter((player) => player !== playerToRemove));
      setAvailablePlayers([...availablePlayers, playerToRemove]);
    };

  return (
    <div>
      {teamsConfig.map(({ players, setTeam }, index) => (
        <div key={index} className={styles.list}>
          <Team
            players={players}
            onRemove={handleRemovePlayer(players, setTeam)}
          />
        </div>
      ))}
    </div>
  );
}
