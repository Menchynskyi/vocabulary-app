"use client";

import { Inter } from "@next/font/google";
import { useCallback, useEffect, useState } from "react";
import { WordCard } from "./WordCard";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export function WordsList({ words }) {
  const [isTranslationVisible, setIsTranslationVisible] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const isCompleted = currentWordIndex >= words.length;

  const handleKeybordActions = useCallback(
    (event) => {
      if (event.keyCode === 32) {
        setIsTranslationVisible((prev) => !prev);
        return;
      }

      setIsTranslationVisible(false);
      if (event.keyCode === 37 && currentWordIndex !== 0) {
        if (isTranslationVisible) {
          setTimeout(() => {
            setCurrentWordIndex((prev) => prev - 1);
          }, 160);
        } else {
          setCurrentWordIndex((prev) => prev - 1);
        }
      }
      if (event.keyCode === 39 && currentWordIndex < words.length) {
        if (isTranslationVisible) {
          setTimeout(() => {
            setCurrentWordIndex((prev) => prev + 1);
          }, 160);
        } else {
          setCurrentWordIndex((prev) => prev + 1);
        }
      }
    },
    [currentWordIndex, words.length, isTranslationVisible]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeybordActions);

    return () => {
      document.removeEventListener("keydown", handleKeybordActions);
    };
  }, [handleKeybordActions]);

  const currentWord = words[currentWordIndex];

  return (
    <div className={inter.className}>
      {isCompleted ? (
        words.map(({ id, word, translation }) => (
          <div className={styles.wordBlock} key={id}>
            <div>
              <span>{word}</span>
            </div>
            <div>
              <span>{translation}</span>
            </div>
          </div>
        ))
      ) : (
        <WordCard
          word={currentWord.word}
          translation={currentWord.translation}
          isTranslationVisible={isTranslationVisible}
        />
      )}
    </div>
  );
}
