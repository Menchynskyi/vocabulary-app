"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { WordCard } from "./WordCard";
import { uri } from "@/constants";
import { Word } from "@/types";
import { CardsContext } from "./CardsContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CompletedList } from "./CompletedList";
import { toast } from "sonner";
import { voiceChangeCustomEventName } from "@/constants/voice";

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

  const [isMeaningVisible, setIsMeaningVisible] = useState(flippedMode);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [wordsAudio, setWordsAudio] = useState(Array(words.length).fill(null));

  const isCompleted = currentWordIndex >= words.length;

  const toggleCard = useCallback(() => {
    setIsMeaningVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsMeaningVisible(flippedMode);
  }, [flippedMode]);

  useEffect(() => {
    setCurrentWordIndex(0);
    setWordsAudio(Array(words.length).fill(null));

    const handleVoiceChange = () => {
      setWordsAudio(Array(words.length).fill(null));
    };
    document.addEventListener(voiceChangeCustomEventName, handleVoiceChange);
    return () => {
      document.removeEventListener(
        voiceChangeCustomEventName,
        handleVoiceChange,
      );
    };
  }, [words.length]);

  const playWord = useCallback(
    async (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event?.stopPropagation();
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
      setIsMeaningVisible(flippedMode);
      const isNext = inc > 0;

      if (isMeaningVisible) {
        setTimeout(() => {
          setCurrentWordIndex((prev) =>
            isNext
              ? Math.min(prev + inc, words.length)
              : Math.max(prev + inc, 0),
          );
        }, 160);
      } else {
        setCurrentWordIndex((prev) =>
          isNext ? Math.min(prev + inc, words.length) : Math.max(prev + inc, 0),
        );
      }
    },
    [isMeaningVisible, flippedMode, words.length],
  );

  const handleKeybordActions = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        toggleCard();
        return;
      }

      if (event.key === "ArrowLeft" && currentWordIndex !== 0) {
        event.preventDefault();
        switchWords(-1);
      }
      if (event.key === "ArrowRight" && currentWordIndex < words.length) {
        event.preventDefault();
        switchWords(1);
      }

      if (
        event.key === "p" &&
        (event.metaKey || event.ctrlKey) &&
        !isCompleted
      ) {
        event.preventDefault();
        playWord();
      }

      if (
        event.key === "c" &&
        (event.metaKey || event.ctrlKey) &&
        !isCompleted
      ) {
        event.preventDefault();
        const text = `${words[currentWordIndex].word} - ${words[currentWordIndex].translation || words[currentWordIndex].meaning || words[currentWordIndex].example}`;
        navigator.clipboard.writeText(text);
        toast("Copied to clipboard", {
          description: text,
        });
      }
    },
    [currentWordIndex, toggleCard, switchWords, playWord, words, isCompleted],
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
      {noWeekWords ? (
        <span className="text-2xl sm:text-4xl">{noWeekWords}</span>
      ) : null}

      {isCompleted ? (
        <CompletedList
          words={words}
          goBack={() => setCurrentWordIndex((prev) => prev - 1)}
          startOver={() => setCurrentWordIndex(0)}
        />
      ) : (
        <div className="flex flex-col items-center sm:flex-row">
          <Button
            size="icon"
            variant="outline"
            onClick={() => switchWords(-1)}
            disabled={currentWordIndex === 0}
            className="mb-[45px] mr-4 hidden rounded-full sm:flex"
          >
            <ArrowLeft />
          </Button>
          <WordCard
            nextCard={() => switchWords(1)}
            prevCard={() => switchWords(-1)}
            loading={audioLoading}
            playWord={playWord}
            word={currentWord}
            toggleCard={toggleCard}
            isMeaningVisible={isMeaningVisible}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => switchWords(1)}
            disabled={currentWordIndex >= words.length}
            className="mb-[45px] ml-4 hidden rounded-full sm:flex"
          >
            <ArrowRight />
          </Button>
          <div className="mt-10 flex w-full justify-between sm:hidden">
            <Button
              size="icon"
              variant="outline"
              className="h-16 w-16"
              onClick={() => switchWords(-1)}
              disabled={currentWordIndex === 0}
            >
              <ArrowLeft className="h-8 w-8" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-16 w-16"
              onClick={() => switchWords(1)}
              disabled={currentWordIndex >= words.length}
            >
              <ArrowRight className="h-8 w-8" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
