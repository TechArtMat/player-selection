import { PlayerData } from "./types/PlayerData";

type TeamProps = {
  players: PlayerData[];
  onRemove: (player: PlayerData) => void;
  onSwitch: (player: PlayerData) => void;
  onLockToggle: (player: PlayerData) => void;
  name: string;
};

export function Team(props: TeamProps) {
  const averageKD =
    props.players.length > 0
      ? props.players.reduce((sum, player) => sum + player.kdTrials, 0) /
        props.players.length
      : 0;

  return (
    <>
      <p>{props.name}</p>
      <ul>
        {props.players.map((playerData) => {
          return (
            <li
              key={playerData.name}
              data-testid={`player-${playerData.name.replace(/\s/g, "-")}`}
            >
              <div onClick={() => props.onRemove(playerData)}>
                {playerData.name} {playerData.kdTrials}
              </div>
              <button
                data-testid={`lock-player-button-${playerData.name.replace(/\s/g, "-")}`}
                onClick={() => props.onLockToggle(playerData)}
              >
                {playerData.isLocked ? "Unlock" : "Lock"}
              </button>
              <button
                data-testid={`change-team-button-${playerData.name.replace(/\s/g, "-")}`}
                onClick={() => props.onSwitch(playerData)}
              >
                Switch
              </button>
            </li>
          );
        })}
      </ul>
      <p>Average K/D: {averageKD.toFixed(2)}</p>
    </>
  );
}
