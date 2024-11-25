import { PlayerData } from "./types/PlayerData";

type TeamProps = {
  players: PlayerData[];
  onRemove: (player: PlayerData) => void;
  name?: string;
};

export function Team(props: TeamProps) {
  return (
    <>
      <p>{props.name}</p>
      <ul>
        {props.players.map((playerData) => {
          return (
            <li onClick={() => props.onRemove(playerData)}>
              {playerData.name} {playerData.kdTrials}
            </li>
          );
        })}
      </ul>
    </>
  );
}
