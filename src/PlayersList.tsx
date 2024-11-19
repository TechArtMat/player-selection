import { parsePlayerData } from "./parsePlayerData";
import data from "./playersData.tsv?raw";
import styles from "./PlayersList.module.css";
import { useAppContext } from "./AppContext";
import { useEffect } from "react";

export function PlayersList() {
  const { availablePlayers, setAvailablePlayers } = useAppContext();
  useEffect(() => {
    console.log("pids");
    const parseData = parsePlayerData(data);
    setAvailablePlayers(parseData);
  }, []);
  // console.log({ parseData });
  return (
    <ul className={styles.list}>
      {availablePlayers.map((playerData) => {
        return (
          <li>
            {playerData.name} {playerData.kdTrials}
          </li>
        );
      })}
    </ul>
  );
}
