"use client";

import styles from "./page.module.css";

export function WordCard({
  word,
  isFirst,
  toggleCard,
  translation,
  switchWords,
  isTranslationVisible,
}) {
  return (
    <div className={styles.cardContainer}>
      <div
        onClick={() => switchWords(-1)}
        className={`${styles.cardButton} ${
          isFirst ? styles.cardButtonNotActive : ""
        }`}
      ></div>
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
      <div onClick={() => switchWords(1)} className={styles.cardButton}></div>
    </div>
  );
}
