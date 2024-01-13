"use client";

import { Inter } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import { WordCard } from "./WordCard";
import styles from "../styles/page.module.css";
import { uri } from "@/constants";
import Snowfall from "react-snowfall";
import { Word } from "@/types";

const inter = Inter({ subsets: ["latin"] });

const isSnowing = process.env.NEXT_PUBLIC_IS_SNOWING === "true";

async function transformTextToSpeech(text: string) {
  try {
    const response = await fetch(`${uri}/api/textToSpeech?text=${text}`, {
      cache: "no-store",
    });
    const buffer = await response.arrayBuffer();
    const blob = new Blob([buffer], {
      type: response.headers.get("content-type") || "audio/mpeg",
    });
    return blob;
  } catch (error) {
    console.error(error);
  }
}

type WordsListProps = {
  words: Word[];
  noWeekWords?: string;
};

export function WordsList({ words, noWeekWords }: WordsListProps) {
  const [isMeaningVisible, setIsMeaningVisible] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlippedMode, setIsFlippedMode] = useState(false);

  const [audioLoading, setAudioLoading] = useState(false);
  const [wordsAudio, setWordsAudio] = useState(Array(words.length).fill(null));

  const isCompleted = currentWordIndex >= words.length;

  const toggleCard = useCallback(() => {
    setIsMeaningVisible((prev) => !prev);
  }, []);

  const toggleMode = () => setIsFlippedMode((prev) => !prev);

  const playWord = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      try {
        let blob = wordsAudio[currentWordIndex];

        if (!blob) {
          setAudioLoading(true);
          blob = await transformTextToSpeech(words[currentWordIndex].word);
          setWordsAudio((prev) => {
            prev[currentWordIndex] = blob;
            return prev;
          });
        }

        const audio = new Audio(URL.createObjectURL(blob));
        setTimeout(() => {
          audio.play();
        }, 0);
      } catch (error) {
        console.error(error);
      } finally {
        setAudioLoading(false);
      }
    },
    [currentWordIndex, words, wordsAudio]
  );

  const switchWords = useCallback(
    (inc: number) => {
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
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        toggleCard();
        return;
      }

      if (event.key === "ArrowLeft" && currentWordIndex !== 0) {
        switchWords(-1);
      }
      if (event.key === "ArrowRight" && currentWordIndex < words.length) {
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
      {isSnowing && <Snowfall color="#fff" snowflakeCount={200} />}
      <div className={styles.title} onClick={toggleMode}>
        <h1 className={inter.className}>Vocabulary</h1>
      </div>
      <div
        className={`${inter.className}${
          isCompleted ? ` ${styles.wordsList}` : ""
        }`}
      >
        {noWeekWords ? <span>{noWeekWords}</span> : null}
        {isCompleted ? (
          words.map(({ id, word, translation, meaning, example }) => (
            <div className={styles.wordBlock} key={id}>
              <div>
                <span>{word}</span>
              </div>
              <div>
                <span>{translation || meaning || example}</span>
              </div>
            </div>
          ))
        ) : (
          <WordCard
            loading={audioLoading}
            playWord={playWord}
            word={currentWord}
            toggleCard={toggleCard}
            switchWords={switchWords}
            isFlipped={isFlippedMode}
            isFirst={currentWordIndex === 0}
            isMeaningVisible={isMeaningVisible}
          />
        )}
      </div>
    </>
  );
}
