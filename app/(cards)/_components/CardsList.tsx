"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { Card } from "./Card";
import { VocabularyMode, WordObject } from "@/types";
import { CardsContext } from "./CardsContext";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CompletedList } from "./CompletedList";
import { voiceChangeCustomEventName } from "@/constants/voice";
import { toast } from "sonner";
import { getSynthesizedSpeech } from "@/server/gcp/queries";
import { playBufferAudio } from "@/utils/playBufferAudio";
import { useKeyboardShortcuts } from "@/utils/useKeyboardShortcuts";

type CardsListProps = {
  cards: WordObject[];
  vocabularyMode?: VocabularyMode;
};

export function CardsList({ cards, vocabularyMode }: CardsListProps) {
  const { flipMode } = useContext(CardsContext);

  const [isMeaningVisible, setIsMeaningVisible] = useState(flipMode);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [cardAudio, setCardAudio] = useState<Array<Blob | null>>(
    Array(cards.length).fill(null),
  );

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
      setAudioLoading(true);

      try {
        const blob = cardAudio[currentCardIndex];

        if (!blob) {
          const audioData = await getSynthesizedSpeech(
            cards[currentCardIndex].word,
          );
          if (!audioData) throw new Error("No audio data");

          playBufferAudio({
            audioData,
            cacheFunc: (blob) => {
              setCardAudio((prev) =>
                prev.map((item, index) =>
                  index === currentCardIndex ? blob : item,
                ),
              );
            },
          });
          return;
        }

        playBufferAudio({ cachedBlob: blob });
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

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: " ",
        action: (e) => {
          e.preventDefault();
          toggleCard();
        },
      },
      {
        key: "ArrowLeft",
        action: (e) => {
          if (currentCardIndex === 0) return;
          e.preventDefault();
          switchCards(-1);
        },
      },
      {
        key: "ArrowRight",
        action: (e) => {
          if (currentCardIndex >= cards.length) return;
          e.preventDefault();
          switchCards(1);
        },
      },
      {
        key: "p",
        modifier: "ctrl",
        action: (e) => {
          if (isCompleted) return;
          e.preventDefault();
          playWord();
        },
      },
      {
        key: "c",
        modifier: "ctrl",
        action: (e) => {
          if (isCompleted) return;
          e.preventDefault();
          const text = `${cards[currentCardIndex].word} - ${
            cards[currentCardIndex].translation ||
            cards[currentCardIndex].meaning ||
            cards[currentCardIndex].example
          }`;
          navigator.clipboard.writeText(text);
          toast("Copied to clipboard", {
            description: text,
          });
        },
      },
    ],
    deps: [
      currentCardIndex,
      toggleCard,
      switchCards,
      playWord,
      cards,
      isCompleted,
    ],
  });

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
