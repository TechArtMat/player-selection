import { PlayerCard } from "./PlayerCard";
import { PlayerData } from "./types/PlayerData";
import { EmptySlot } from "./EmptySlot";
import styles from "./Teams.module.css";

export type TeamProps = {
  players: PlayerData[];
  maxPlayers: number;
  onRemove: (player: PlayerData) => void;
  onSwitch: (player: PlayerData) => void;
  onLockToggle: (player: PlayerData) => void;
  name: string;
  kdCriterion: "kdTrials" | "kdCrucible";
};

export function Team(props: TeamProps) {
  const averageKD =
    props.players.length > 0
      ? props.players.reduce(
          (sum, player) => sum + player[props.kdCriterion],
          0,
        ) / props.players.length
      : 0;

  const filledSlots = [...props.players];
  const emptySlotsCount = props.maxPlayers - filledSlots.length;

  for (let i = 0; i < emptySlotsCount; i++) {
    filledSlots.push(null as any);
  }

  return (
    <>
      <div>
        <p className={styles.textH2}>{props.name}</p>
        <div className={styles.decContainer}>
          <div
            className={`${styles.decContainerS} ${styles[`decColor${props.name}S`]}`}
          ></div>
          <div
            className={`${styles.decContainerB} ${styles[`decColor${props.name}B`]}`}
          ></div>
        </div>
        <ul className={styles.team}>
          {filledSlots.map((playerData, index) => {
            if (playerData) {
              return (
                <li
                  key={playerData.name}
                  data-testid={`player-${playerData.name.replace(/\s/g, "-")}`}
                  className={styles.playerRow}
                >
                  <PlayerCard
                    key={playerData.name}
                    playerData={playerData}
                    isInTeam={true}
                    onRemove={props.onRemove}
                    onSwitch={props.onSwitch}
                    onLockToggle={props.onLockToggle}
                  />
                </li>
              );
            } else {
              return (
                <li key={`empty-${index}`} className={styles.playerRow}>
                  <EmptySlot />
                </li>
              );
            }
          })}
        </ul>
        <p>Average K/D: {averageKD.toFixed(2)}</p>
      </div>
    </>
  );
}
