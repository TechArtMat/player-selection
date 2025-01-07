import { PlayerData } from "./types/PlayerData";
import styles from "./PlayerCard.module.css";

export function PlayerCard({
  playerData,
  isInTeam,
  onRemove,
  ...playerCardToolsProps
}: {
  isInTeam: boolean;
  onRemove?: (player: PlayerData) => void;
} & PlayerCardToolsProps) {
  return (
    <div
      data-testid={"player-card"}
      className={styles.playerCard}
      onClick={() => onRemove && onRemove(playerData)}
    >
      <div className={styles.playerAvatar}></div>
      <div className={styles.playerInfo}>
        <span
          data-testid={`player-${playerData.name.replace(/\s/g, "-")}`}
          className={styles.playerName}
        >
          {playerData.name}
        </span>
        <span className={styles.playerClan}>[{playerData.clanTag}]</span>
      </div>
      <div className={`${styles.playerKd} ${!isInTeam ? styles.outTeam : ""}`}>
        <div className={styles.playerDecoration}></div>
        <span className={styles.kdTrials}>{playerData.kdTrials}</span>
        <div className={styles.playerDecoration}></div>
        <span className={styles.kdCrucible}>{playerData.kdCrucible}</span>
        <div className={styles.playerDecoration}></div>
      </div>
      {isInTeam && (
        <PlayerCardTools playerData={playerData} {...playerCardToolsProps} />
      )}
    </div>
  );
}

type PlayerCardToolsProps = {
  playerData: PlayerData;
  onSwitch?: (player: PlayerData) => void;
  onLockToggle?: (player: PlayerData) => void;
};

export function PlayerCardTools({
  playerData,
  onSwitch,
  onLockToggle,
}: PlayerCardToolsProps) {
  return (
    <>
      <div className={styles.playerAction}>
        <button
          data-testid={`lock-player-button-${playerData.name.replace(/\s/g, "-")}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onLockToggle) {
              onLockToggle(playerData);
            }
          }}
        >
          {playerData.isLocked ? "Unlock" : "Lock"}
        </button>
        <button
          className={styles.switchBtn}
          data-testid={`change-team-button-${playerData.name.replace(/\s/g, "-")}`}
          onClick={(event) => {
            event.stopPropagation();
            if (onSwitch) {
              onSwitch(playerData);
            }
          }}
        >
          &#8646;
        </button>
      </div>
    </>
  );
}
