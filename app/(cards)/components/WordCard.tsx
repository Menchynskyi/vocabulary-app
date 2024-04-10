"use client";

import { useEffect, useMemo, useState } from "react";
import { isTextToSpeechEnabled } from "@/constants";
import { Word, WordFields } from "@/types";
import { cn } from "@/utils/tailwind";
import { Button } from "@/components/ui/button";
import { AudioLines, Languages, Sparkle, Lightbulb } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CommandDropdown } from "@/components/CommandDropdown";
import { CommandContextMenu } from "@/components/CommandContextMenu";

type WordCardProps = {
  loading: boolean;
  word: Word;
  isFlipped: boolean;
  toggleCard: () => void;
  playWord: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isMeaningVisible: boolean;
};

export function WordCard({
  loading,
  word,
  isFlipped,
  toggleCard,
  playWord,
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

  const nextMeaningButton = useMemo(() => {
    const data: Record<string, { tooltip: string; icon: JSX.Element }> = {
      translation: {
        tooltip: "Show translation",
        icon: <Languages className="h-4 w-4" />,
      },
      meaning: {
        tooltip: "Show meaning",
        icon: <Lightbulb className="h-4 w-4" />,
      },
      example: {
        tooltip: "Show example",
        icon: <Sparkle className="h-4 w-4" />,
      },
    };

    return data[nextMeaningMode];
  }, [nextMeaningMode]);

  const handleChangeMeaningMode = (event: React.MouseEvent) => {
    event.stopPropagation();

    setMeaningMode(nextMeaningMode);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <CommandContextMenu>
        <div
          className="h-[400px] w-[400px] perspective-1000 hover:cursor-pointer"
          onClick={toggleCard}
        >
          <div
            className={cn(
              "relative h-full w-full  transition-all	 duration-500 preserve-3d",
              {
                "rotate-y-180": isMeaningVisible,
              },
            )}
          >
            <div className="absolute flex h-full w-full flex-col rounded-md border bg-background text-center text-[1rem] text-secondary-foreground backface-hidden">
              <div className="flex	h-full items-center justify-center p-[40px] text-2xl">
                <span>{isFlipped ? meaning : word.word}</span>
              </div>
              <div className="flex rounded-b-md  border-t px-2 py-1">
                <CommandDropdown />

                {isTextToSpeechEnabled && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={playWord}
                        className="ml-auto text-foreground"
                      >
                        <AudioLines
                          className={cn("h-3.5 w-3.5", {
                            "animate-pulse": loading,
                          })}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Pronounce</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="absolute flex h-full w-full flex-col whitespace-pre-line rounded-md border bg-primary/100 from-black text-center text-[1rem] text-primary-foreground backface-hidden rotate-y-180">
              <div className="flex h-full items-center justify-center p-[40px] text-2xl">
                <span>{isFlipped ? word.word : meaning}</span>
              </div>

              <div className="flex rounded-b-md border-t bg-primary/30 px-2 py-1">
                <CommandDropdown isPrimary />

                {!isOnlyOneMeaningType && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleChangeMeaningMode}
                        className="ml-auto text-primary-foreground"
                      >
                        {nextMeaningButton.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{nextMeaningButton.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
      </CommandContextMenu>
    </TooltipProvider>
  );
}
