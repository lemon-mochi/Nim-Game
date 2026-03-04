import styles from './PileCard.module.scss'

function Stick({ removing }) {
  return (
    <div
      className={`${styles.stick} ${removing ? styles.removing : ""}`}
    />
  );
}

export default function PileCard({ idx, count, selected, onSelect, disabled }) {
  const maxVisible = 20;
  const display = Math.min(count, maxVisible);

  return (
    <div className={`${styles.pileCard} ${selected ? styles.selected : ""}`}>
      <div className={styles.pileLabel}>Pile {idx + 1}</div>

      <div className={styles.sticksGrid}>
        {Array.from({ length: display }).map((_, i) => (
          <Stick key={i} />
        ))}

        {count > maxVisible && (
          <div className={styles.moreText}>
            +{count - maxVisible} more
          </div>
        )}
      </div>

      <div className={styles.stickCount}>{count}</div>
      <div className={styles.stickWord}>
        {count === 1 ? "stick" : "sticks"}
      </div>

      <div className={styles.pileControls}>
        <button
          className={`${styles.pileSelectBtn} ${
            selected ? styles.active : ""
          }`}
          onClick={() => onSelect(idx)}
          disabled={disabled || count === 0}
        >
          {selected ? "✓ Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}