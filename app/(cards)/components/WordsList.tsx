"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { WordCard } from "./WordCard";
import { uri } from "@/constants";
import { Word } from "@/types";
import { CardsContext } from "../layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CompletedList } from "./CompletedList";

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
  const { flippedMode } = useContext(CardsContext);

  const [isMeaningVisible, setIsMeaningVisible] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [audioLoading, setAudioLoading] = useState(false);
  const [wordsAudio, setWordsAudio] = useState(Array(words.length).fill(null));

  const isCompleted = currentWordIndex >= words.length;

  const toggleCard = useCallback(() => {
    setIsMeaningVisible((prev) => !prev);
  }, []);

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
    [currentWordIndex, words, wordsAudio],
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
    [isMeaningVisible],
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
    [currentWordIndex, words.length, toggleCard, switchWords],
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
      {noWeekWords ? <span>{noWeekWords}</span> : null}

      {isCompleted ? (
        <CompletedList words={words} />
      ) : (
        <div className="flex items-center">
          <Button
            size="icon"
            variant="outline"
            onClick={() => switchWords(-1)}
            disabled={currentWordIndex === 0}
            className="mb-[45px] mr-4 rounded-full"
          >
            <ArrowLeft />
          </Button>
          <WordCard
            loading={audioLoading}
            playWord={playWord}
            word={currentWord}
            toggleCard={toggleCard}
            isFlipped={flippedMode}
            isMeaningVisible={isMeaningVisible}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => switchWords(1)}
            disabled={currentWordIndex >= words.length}
            className="mb-[45px] ml-4 rounded-full"
          >
            <ArrowRight />
          </Button>
        </div>
      )}
    </>
  );
}
