import { PlayerCard } from "./PlayerCard";
import { PlayerData } from "./types/PlayerData";
import { EmptySlot } from "./EmptySlot";
import styles from "./Teams.module.css";
import { useEffect, useState } from "react";

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
  const [slots, setSlots] = useState<PlayerData[]>([]);
  const averageKD =
    props.players.length > 0
      ? props.players.reduce(
          (sum, player) => sum + player[props.kdCriterion],
          0,
        ) / props.players.length
      : 0;

  useEffect(() => {
    const filledSlots = [...props.players];
    const emptySlotsCount = props.maxPlayers - filledSlots.length;

    for (let i = 0; i < emptySlotsCount; i++) {
      filledSlots.push(null as any);
    }
    setSlots(filledSlots);
  }, [props.players]);

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
          {slots.map((playerData, index) => {
            if (playerData) {
              return (
                <li key={playerData.name} className={styles.playerRow}>
                  <PlayerCard
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
