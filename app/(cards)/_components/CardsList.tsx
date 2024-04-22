"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { Card } from "./Card";
import { uri } from "@/constants";
import { VocabularyMode, WordCard } from "@/types";
import { CardsContext } from "./CardsContext";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CompletedList } from "./CompletedList";
import { voiceChangeCustomEventName } from "@/constants/voice";
import { toast } from "sonner";

async function transformTextToSpeech(text: string) {
  try {
    const response = await fetch(`${uri}/api/text-to-speech?text=${text}`, {
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

type CardsListProps = {
  cards: WordCard[];
  vocabularyMode?: VocabularyMode;
};

export function CardsList({ cards, vocabularyMode }: CardsListProps) {
  const { flipMode } = useContext(CardsContext);

  const [isMeaningVisible, setIsMeaningVisible] = useState(flipMode);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [cardAudio, setCardAudio] = useState(Array(cards.length).fill(null));

  const isCompleted = currentCardIndex >= cards.length;

  const toggleCard = useCallback(() => {
    setIsMeaningVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsMeaningVisible(flipMode);
  }, [flipMode]);

  useEffect(() => {
    setCurrentCardIndex(0);
    setCardAudio(Array(cards.length).fill(null));

    const handleVoiceChange = () => {
      setCardAudio(Array(cards.length).fill(null));
    };
    document.addEventListener(voiceChangeCustomEventName, handleVoiceChange);
    return () => {
      document.removeEventListener(
        voiceChangeCustomEventName,
        handleVoiceChange,
      );
    };
  }, [cards.length]);

  const playWord = useCallback(
    async (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event?.stopPropagation();
      try {
        let blob = cardAudio[currentCardIndex];

        if (!blob) {
          setAudioLoading(true);
          blob = await transformTextToSpeech(cards[currentCardIndex].word);
          setCardAudio((prev) => {
            prev[currentCardIndex] = blob;
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
    [currentCardIndex, cards, cardAudio],
  );

  const switchCards = useCallback(
    (inc: number) => {
      setIsMeaningVisible(flipMode);
      const isNext = inc > 0;
      const isCardFlipped = isMeaningVisible !== flipMode;

      if (isCardFlipped) {
        setTimeout(() => {
          setCurrentCardIndex((prev) =>
            isNext
              ? Math.min(prev + inc, cards.length)
              : Math.max(prev + inc, 0),
          );
        }, 100);
      } else {
        setCurrentCardIndex((prev) =>
          isNext ? Math.min(prev + inc, cards.length) : Math.max(prev + inc, 0),
        );
      }
    },
    [isMeaningVisible, flipMode, cards.length],
  );

  const handleKeybordActions = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        toggleCard();
        return;
      }

      if (event.key === "ArrowLeft" && currentCardIndex !== 0) {
        event.preventDefault();
        switchCards(-1);
      }
      if (event.key === "ArrowRight" && currentCardIndex < cards.length) {
        event.preventDefault();
        switchCards(1);
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
        const text = `${cards[currentCardIndex].word} - ${cards[currentCardIndex].translation || cards[currentCardIndex].meaning || cards[currentCardIndex].example}`;
        navigator.clipboard.writeText(text);
        toast("Copied to clipboard", {
          description: text,
        });
      }
    },
    [currentCardIndex, toggleCard, switchCards, playWord, cards, isCompleted],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeybordActions);

    return () => {
      document.removeEventListener("keydown", handleKeybordActions);
    };
  }, [handleKeybordActions]);

  const currentCard = cards[currentCardIndex];

  const noCardsMessage =
    vocabularyMode === VocabularyMode.week && !cards.length
      ? "No words were added last week"
      : undefined;

  return (
    <>
      {noCardsMessage ? (
        <span className="text-2xl sm:text-4xl">{noCardsMessage}</span>
      ) : null}

      {isCompleted ? (
        <CompletedList cards={cards} startOver={() => setCurrentCardIndex(0)} />
      ) : (
        <div className="flex flex-col items-center sm:flex-row">
          <Button
            size="icon"
            variant="outline"
            aria-label="Previous card"
            onClick={() => switchCards(-1)}
            disabled={currentCardIndex === 0}
            className="mb-[45px] mr-4 hidden rounded-full sm:flex"
          >
            <ArrowLeft />
          </Button>
          <Card
            nextCard={() => switchCards(1)}
            prevCard={() => switchCards(-1)}
            loading={audioLoading}
            playWord={playWord}
            card={currentCard}
            toggleCard={toggleCard}
            isMeaningVisible={isMeaningVisible}
          />
          <Button
            size="icon"
            variant="outline"
            aria-label="Next card"
            onClick={() => switchCards(1)}
            disabled={currentCardIndex >= cards.length}
            className="mb-[45px] ml-4 hidden rounded-full sm:flex"
          >
            <ArrowRight />
          </Button>
          <div className="mt-10 flex w-full justify-between sm:hidden">
            <Button
              size="icon"
              variant="outline"
              aria-label="Previous card"
              className="h-16 w-16"
              onClick={() => switchCards(-1)}
              disabled={currentCardIndex === 0}
            >
              <ArrowLeft className="h-8 w-8" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Next card"
              className="h-16 w-16"
              onClick={() => switchCards(1)}
              disabled={currentCardIndex >= cards.length}
            >
              <ArrowRight className="h-8 w-8" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
