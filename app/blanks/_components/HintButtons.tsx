"use client";

import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { getSynthesizedSpeech } from "@/server/gcp/queries";
import { playBufferAudio } from "@/utils/playBufferAudio";
import { cn } from "@/utils/tailwind";
import { useKeyboardShortcuts } from "@/utils/useKeyboardShortcuts";
import { toast } from "sonner";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { BlanksDifficulty } from "@/types";

const getNumberOfRevealHints = (difficulty: BlanksDifficulty) => {
  switch (difficulty) {
    case BlanksDifficulty.Easy:
      return 3;
    case BlanksDifficulty.Medium:
      return 2;
    case BlanksDifficulty.Hard:
      return 1;
    case BlanksDifficulty.Extreme:
    default:
      return 0;
  }
};

type HintButtonProps = {
  revealLetter: () => void;
  word: string;
  value: string;
  difficulty: BlanksDifficulty;
};

export function HintButtons({
  revealLetter,
  word,
  value,
  difficulty,
}: HintButtonProps) {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPronounced, setIsPronounced] = useState(false);
  const [numberOfRevealHints, setNumberOfRevealHints] = useState(() =>
    getNumberOfRevealHints(difficulty),
  );

  const handlePronounce = async () => {
    setIsAudioLoading(true);
    const audioData = await getSynthesizedSpeech(word);
    if (!audioData) return;

    playBufferAudio({ audioData });
    setIsAudioLoading(false);
    setIsPronounced(true);
  };

  const handleRevealLetter = () => {
    if (numberOfRevealHints === 0) return;

    revealLetter();
    setNumberOfRevealHints((prev) => prev - 1);
    toast("A letter has been revealed", {
      description:
        numberOfRevealHints - 1 === 0
          ? "You have no more reveal hints left"
          : `You have ${numberOfRevealHints - 1} reveal hints left`,
    });
  };

  useEffect(() => {
    setNumberOfRevealHints(getNumberOfRevealHints(difficulty));
  }, [difficulty]);

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: "p",
        modifier: "ctrl",
        action: (e) => {
          e.preventDefault();
          handlePronounce();
        },
      },
      {
        key: "v",
        modifier: "ctrl",
        action: (e) => {
          e.preventDefault();
          handleRevealLetter();
        },
      },
    ],
    deps: [value],
  });

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row ">
      <Button
        aria-label="Give a hint"
        className="w-full"
        variant="outline"
        disabled={isPronounced || numberOfRevealHints === 0}
        onClick={handleRevealLetter}
      >
        Reveal a letter
        <KeyboardShortcut shortcut="V" withModifier className="ml-2 h-auto" />
      </Button>
      <Button
        aria-label="Pronounce"
        className={cn("w-full", { "animate-pulse": isAudioLoading })}
        variant="outline"
        disabled={isPronounced}
        onClick={handlePronounce}
      >
        Pronounce
        <KeyboardShortcut shortcut="P" withModifier className="ml-2 h-auto" />
      </Button>
    </div>
  );
}
