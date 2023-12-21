"use client";

import { useEffect, useMemo, useState } from "react";
import { SoundButton } from "./SoundIcon";
import styles from "./page.module.css";
import { isTextToSpeechEnabled } from "./utils";
import { MeaningModeButton } from "./MeaningModeButton";

export function WordCard({
  loading,
  word,
  isFirst,
  isFlipped,
  toggleCard,
  playWord,
  switchWords,
  isMeaningVisible,
}) {
  const [meaningMode, setMeaningMode] = useState("translation");

  useEffect(() => {
    setMeaningMode(() => {
      switch (true) {
        case !!word.translation:
          return "translation";
        case !!word.meaning:
          return "meaning";
        case !!word.example:
          return "example";
      }
    });
  }, [word]);

  const meaning = word[meaningMode];

  const avaialbleMeaningModes = Object.entries(word)
    .filter(([key, value]) => !!value && key !== "word" && key !== "id")
    .map(([key]) => key);
  const isOnlyOneMeaningType = avaialbleMeaningModes.length === 1;

  const nextMeaningMode = useMemo(() => {
    const index = avaialbleMeaningModes.indexOf(meaningMode);
    if (index === -1) {
      return;
    }
    const nextIndex = index + 1;
    return avaialbleMeaningModes[nextIndex] || avaialbleMeaningModes[0];
  }, [avaialbleMeaningModes, meaningMode]);

  const handleChangeMeaningMode = (event) => {
    event.stopPropagation();

    setMeaningMode(nextMeaningMode);
  };

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
            <span>{isFlipped ? meaning : word.word}</span>
          </div>
          <div className={styles.back}>
            {!isOnlyOneMeaningType ? (
              <MeaningModeButton
                nextMeaningMode={nextMeaningMode}
                onClick={handleChangeMeaningMode}
              />
            ) : null}
            <span>{isFlipped ? word.word : meaning}</span>
          </div>
        </div>
      </div>
      <div onClick={() => switchWords(1)} className={styles.cardButton}></div>
    </div>
  );
}
