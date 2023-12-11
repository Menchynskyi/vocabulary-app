"use client";

import { Inter } from "@next/font/google";
import { useCallback, useEffect, useState } from "react";
import { WordCard } from "./WordCard";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export function WordsList({ words, noWeekWords }) {
  const [isMeaningVisible, setIsMeaningVisible] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlippedMode, setIsFlippedMode] = useState(false);

  const isCompleted = currentWordIndex >= words.length;

  const toggleCard = useCallback(() => {
    setIsMeaningVisible((prev) => !prev);
  }, []);

  const toggleMode = () => setIsFlippedMode((prev) => !prev);

  const switchWords = useCallback(
    (inc) => {
      setIsMeaningVisible(false);

      if (isMeaningVisible) {
        setTimeout(() => {
          setCurrentWordIndex((prev) => prev + inc);
        }, 160);
      } else {
        setCurrentWordIndex((prev) => prev + inc);
      }
    },
    [isMeaningVisible]
  );

  const handleKeybordActions = useCallback(
    (event) => {
      if (event.keyCode === 32) {
        toggleCard();
        return;
      }

      if (event.keyCode === 37 && currentWordIndex !== 0) {
        switchWords(-1);
      }
      if (event.keyCode === 39 && currentWordIndex < words.length) {
        switchWords(1);
      }
    },
    [currentWordIndex, words.length, toggleCard, switchWords]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeybordActions);

    return () => {
      document.removeEventListener("keydown", handleKeybordActions);
    };
  }, [handleKeybordActions]);

  const currentWord = words[currentWordIndex];

  return (
    <>
      <div className={styles.title} onClick={toggleMode}>
        <h1 className={inter.className}>Vocabulary</h1>
      </div>
      <div className={inter.className}>
        {noWeekWords ? <span>{noWeekWords}</span> : null}
        {isCompleted ? (
          words.map(({ id, word, meaning }) => (
            <div className={styles.wordBlock} key={id}>
              <div>
                <span>{word}</span>
              </div>
              <div>
                <span>{meaning}</span>
              </div>
            </div>
          ))
        ) : (
          <WordCard
            word={currentWord.word}
            toggleCard={toggleCard}
            switchWords={switchWords}
            isFlipped={isFlippedMode}
            isFirst={currentWordIndex === 0}
            meaning={currentWord.meaning}
            isMeaningVisible={isMeaningVisible}
          />
        )}
      </div>
    </>
  );
}
