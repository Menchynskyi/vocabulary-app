"use client";

import { useEffect, useMemo, useState } from "react";
import { isTextToSpeechEnabled } from "@/constants";
import { CardCommandsConfig, WordObject, WordObjectFields } from "@/types";
import { cn } from "@/utils/tailwind";
import { Button } from "@/components/ui/Button";
import { AudioLines, Languages, Sparkle, Lightbulb } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { CommandDropdown } from "./CommandDropdown";
import { CommandContextMenu } from "./CommandContextMenu";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getShortcutDisplayName } from "@/utils/keyboardShortcuts";

const meaningModes: Array<WordObjectFields> = [
  "translation",
  "meaning",
  "example",
];

type CardProps = {
  loading: boolean;
  card: WordObject;
  toggleCard: () => void;
  playWord: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isMeaningVisible: boolean;
  nextCard: () => void;
  prevCard: () => void;
  handleEditWord: () => void;
};

export function Card({
  loading,
  card,
  toggleCard,
  playWord,
  isMeaningVisible,
  nextCard,
  prevCard,
  handleEditWord,
}: CardProps) {
  const { isSignedIn } = useAuth();
  const { push } = useRouter();

  const [meaningMode, setMeaningMode] =
    useState<WordObjectFields>("translation");

  useEffect(() => {
    setMeaningMode(() => {
      switch (true) {
        case !!card.translation:
          return "translation";
        case !!card.meaning:
          return "meaning";
        case !!card.example:
          return "example";
        default:
          return "translation";
      }
    });
  }, [card]);

  const meaning = card[meaningMode];

  const avaialbleMeaningModes = Object.entries(card)
    .filter(
      ([key, value]) =>
        !!value && meaningModes.includes(key as WordObjectFields),
    )
    .map(([key]) => key) as WordObjectFields[];
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
    const buttonData: Record<
      string,
      { tooltip: string; icon: JSX.Element; ariaLabel: string }
    > = {
      translation: {
        tooltip: "Show translation",
        ariaLabel: "Show translation",
        icon: <Languages className="h-4 w-4" />,
      },
      meaning: {
        tooltip: "Show meaning",
        ariaLabel: "Show meaning",
        icon: <Lightbulb className="h-4 w-4" />,
      },
      example: {
        tooltip: "Show example",
        ariaLabel: "Show example",
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
        shortcut: getShortcutDisplayName("cards", "flipCard"),
        onSelect: toggleCard,
      },
      {
        label: "Next card",
        shortcut: getShortcutDisplayName("cards", "nextCard"),
        onSelect: nextCard,
      },
      {
        label: "Previous card",
        shortcut: getShortcutDisplayName("cards", "prevCard"),
        onSelect: prevCard,
      },
      {
        label: "Pronounce",
        shortcut: getShortcutDisplayName("cards", "pronounceWord"),
        onSelect: playWord as () => void,
      },
    ],
    [
      {
        label: "Edit",
        shortcut: getShortcutDisplayName("cards", "editWord"),
        disabled: !isSignedIn,
        onSelect: handleEditWord,
      },
      {
        label: "Copy",
        shortcut: getShortcutDisplayName("cards", "copyCard"),
        onSelect: () => {
          const text = `${card.word} - ${meaning}`;
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
          window.open(card.url, "_blank");
        },
      },
      {
        label: "Open in Reverso Context",
        onSelect: () => {
          window.open(
            `https://context.reverso.net/translation/english-${process.env.NEXT_PUBLIC_TRANSLATION_LANGUAGE === "UA" ? "ukrainian" : "russian"}/${card.word}`,
            "_blank",
          );
        },
      },
      {
        label: "Open in Cambridge Dictionary",
        onSelect: () => {
          window.open(
            `https://dictionary.cambridge.org/dictionary/english/${card.word}`,
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
              "relative h-full w-full  transition-all duration-300 preserve-3d",
              {
                "rotate-y-180": isMeaningVisible,
              },
            )}
          >
            <div className="absolute flex h-full w-full flex-col rounded-md border bg-background text-center text-[1rem] text-secondary-foreground backface-hidden">
              <div className="flex	h-full items-center justify-center p-[40px] text-2xl">
                <span>{card.word}</span>
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
                        aria-label="Pronounce word"
                        className="ml-auto text-foreground"
                      >
                        <AudioLines
                          className={cn("h-3.5 w-3.5", {
                            "animate-pulse": loading,
                          })}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="flex flex-nowrap">
                      <p>Pronounce</p>
                      <KeyboardShortcut
                        scope="cards"
                        shortcut="pronounceWord"
                        className="ml-2"
                      />
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
                        aria-label={nextMeaningButton.ariaLabel}
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
