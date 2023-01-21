"use client";

import styles from "./page.module.css";

export function WordCard({ word, translation, isTranslationVisible }) {
  return (
    <div className={styles.card}>
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
