"use client";

import { SoundButton } from "./SoundIcon";
import styles from "./page.module.css";
import { isTextToSpeechEnabled } from "./utils";

export function WordCard({
  loading,
  word,
  isFirst,
  isFlipped,
  toggleCard,
  meaning,
  playWord,
  switchWords,
  isMeaningVisible,
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
            isMeaningVisible ? styles.flipped : ""
          }`}
        >
          <div className={styles.front}>
            {isTextToSpeechEnabled ? (
              <SoundButton
                onClick={playWord}
                loading={loading}
                disabled={loading}
              />
            ) : null}
            <span>{isFlipped ? meaning : word}</span>
          </div>
          <div className={styles.back}>
            <span>{isFlipped ? word : meaning}</span>
          </div>
        </div>
      </div>
      <div onClick={() => switchWords(1)} className={styles.cardButton}></div>
    </div>
  );
}
