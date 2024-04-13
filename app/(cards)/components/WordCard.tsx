"use client";

import { useEffect, useMemo, useState } from "react";
import { isTextToSpeechEnabled } from "@/constants";
import { CardCommandsConfig, Word, WordFields } from "@/types";
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
import { toast } from "sonner";

type WordCardProps = {
  loading: boolean;
  word: Word;
  toggleCard: () => void;
  playWord: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isMeaningVisible: boolean;
  nextCard: () => void;
  prevCard: () => void;
};

export function WordCard({
  loading,
  word,
  toggleCard,
  playWord,
  isMeaningVisible,
  nextCard,
  prevCard,
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
    .filter(
      ([key, value]) =>
        !!value && key !== "word" && key !== "id" && key !== "url",
    )
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
    const buttonData: Record<string, { tooltip: string; icon: JSX.Element }> = {
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

    return buttonData[nextMeaningMode];
  }, [nextMeaningMode]);

  const handleChangeMeaningMode = (event: React.MouseEvent) => {
    event.stopPropagation();

    setMeaningMode(nextMeaningMode);
  };

  const cardCommands: CardCommandsConfig = [
    [
      {
        label: "Flip card",
        shortcut: "Space",
        onSelect: toggleCard,
      },
      {
        label: "Next card",
        shortcut: "→",
        onSelect: nextCard,
      },
      {
        label: "Previous card",
        shortcut: "←",
        onSelect: prevCard,
      },
      {
        label: "Pronounce",
        shortcut: "⌘+P",
        onSelect: playWord as () => void,
      },
    ],
    [
      {
        label: "Edit",
        shortcut: "⌘+E",
        disabled: true,
      },
      {
        label: "Copy",
        shortcut: "⌘+C",
        onSelect: () => {
          const text = `${word.word} - ${meaning}`;
          navigator.clipboard.writeText(text);
          toast("Copied to clipboard", {
            description: text,
          });
        },
      },
    ],
    [
      {
        label: "Open in Notion",
        onSelect: () => {
          window.open(word.url, "_blank");
        },
      },
      {
        label: "Open in Reverso Context",
        onSelect: () => {
          window.open(
            `https://context.reverso.net/translation/english-${process.env.NEXT_PUBLIC_TRANSLATION_LANGUAGE === "UA" ? "ukrainian" : "russian"}/${word.word}`,
            "_blank",
          );
        },
      },
      {
        label: "Open in Cambridge Dictionary",
        onSelect: () => {
          window.open(
            `https://dictionary.cambridge.org/dictionary/english/${word.word}`,
            "_blank",
          );
        },
      },
    ],
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <CommandContextMenu cardCommands={cardCommands}>
        <div
          className="h-[400px] w-[90vw] perspective-1000 hover:cursor-pointer sm:w-[400px]"
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
                <span>{word.word}</span>
              </div>
              <div className="flex rounded-b-md  border-t px-2 py-1">
                <CommandDropdown cardCommands={cardCommands} />

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
                <span>{meaning}</span>
              </div>

              <div className="flex rounded-b-md border-t bg-primary/30 px-2 py-1">
                <CommandDropdown isPrimary cardCommands={cardCommands} />

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
