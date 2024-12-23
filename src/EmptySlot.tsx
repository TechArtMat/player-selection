import styles from "./EmptySlot.module.css";

export function EmptySlot() {
  return (
    <li className={styles.slot}>
      <span className={styles.slotDecContainer}>
        <div className={styles.slotDecTl}></div>
        <div className={styles.slotDecTr}></div>
      </span>
      <span className={styles.slotDecContainer}>
        <div className={styles.slotDecBl}></div>
        <div className={styles.slotDecBr}></div>
      </span>
    </li>
  );
}
