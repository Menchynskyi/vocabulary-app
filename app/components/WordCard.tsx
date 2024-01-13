"use client";

import { useEffect, useMemo, useState } from "react";
import { SoundButton } from "./SoundIcon";
import styles from "../styles/page.module.css";
import { isTextToSpeechEnabled } from "@/constants";
import { MeaningModeButton } from "./MeaningModeButton";
import { Word, WordFields } from "@/types";

type WordCardProps = {
  loading: boolean;
  word: Word;
  isFirst: boolean;
  isFlipped: boolean;
  toggleCard: () => void;
  playWord: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  switchWords: (direction: number) => void;
  isMeaningVisible: boolean;
};

export function WordCard({
  loading,
  word,
  isFirst,
  isFlipped,
  toggleCard,
  playWord,
  switchWords,
  isMeaningVisible,
}: WordCardProps) {
  const [meaningMode, setMeaningMode] = useState<WordFields>("translation");

  useEffect(() => {
    setMeaningMode(() => {
      switch (true) {
        case !!word.translation:
          return "translation";
        case !!word.meaning:
          return "meaning";
        case !!word.example:
          return "example";
        default:
          return "translation";
      }
    });
  }, [word]);

  const meaning = word[meaningMode];

  const avaialbleMeaningModes = Object.entries(word)
    .filter(([key, value]) => !!value && key !== "word" && key !== "id")
    .map(([key]) => key) as WordFields[];
  const isOnlyOneMeaningType = avaialbleMeaningModes.length === 1;

  const nextMeaningMode = useMemo(() => {
    const index = avaialbleMeaningModes.indexOf(meaningMode);
    if (index === -1) {
      return avaialbleMeaningModes[0];
    }
    const nextIndex = index + 1;
    return avaialbleMeaningModes[nextIndex] || avaialbleMeaningModes[0];
  }, [avaialbleMeaningModes, meaningMode]);

  const handleChangeMeaningMode = (event: React.MouseEvent) => {
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
