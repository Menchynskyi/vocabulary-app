"use client";

import styles from "./page.module.css";

export function WordCard({
  word,
  translation,
  toggleCard,
  isTranslationVisible,
}) {
  return (
    <div className={styles.card} onClick={toggleCard}>
      <div
        className={`${styles.content} ${
          isTranslationVisible ? styles.flipped : ""
        }`}
      >
        <div className={styles.front}>
          <span>{word}</span>
        </div>
        <div className={styles.back}>
          <span>{translation}</span>
        </div>
      </div>
    </div>
  );
}
