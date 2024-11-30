import { PlayerData } from "./types/PlayerData";
import { sortPlayers } from "./sortPlayer";

type TeamProps = {
  players: PlayerData[];
  onRemove: (player: PlayerData) => void;
  name?: string;
};

// sortPlayers()

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
              onClick={() => props.onRemove(playerData)}
            >
              {playerData.name} {playerData.kdTrials}
            </li>
          );
        })}
      </ul>
      <p>Average K/D: {averageKD.toFixed(2)}</p>
    </>
  );
}
