"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { Slider } from "@/components/ui/Slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Settings as SettingsIcon } from "lucide-react";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/Label";
import {
  defaultMatchUpLives,
  defaultMatchUpWordsCount,
  matchUpLivesCookie,
  matchUpLivesMax,
  matchUpLivesMin,
  matchUpWordsCountCookie,
  matchUpWordsCountMax,
  matchUpWordsCountMin,
} from "@/constants/match-up";
import { settingsButtonId } from "@/constants";
import { useKeyboardShortcuts } from "@/utils/keyboardShortcuts";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";

export function Settings() {
  const { refresh } = useRouter();
  const ref = useRef<HTMLButtonElement | null>(null);
  const [lives, setLives] = useState(() => {
    const value = Number(getCookie(matchUpLivesCookie));
    return Number.isNaN(value)
      ? defaultMatchUpLives
      : Math.min(matchUpLivesMax, Math.max(matchUpLivesMin, value));
  });
  const [wordsCount, setWordsCount] = useState(() => {
    const value = Number(getCookie(matchUpWordsCountCookie));
    return Number.isNaN(value)
      ? defaultMatchUpWordsCount
      : Math.min(matchUpWordsCountMax, Math.max(matchUpWordsCountMin, value));
  });

  const handleSaveSettings = () => {
    const currentLives = getCookie(matchUpLivesCookie);
    const currentWordsCount = getCookie(matchUpWordsCountCookie);
    const newLives = lives.toString();
    const newWordsCount = wordsCount.toString();
    let changed = false;

    if (currentLives !== newLives) {
      setCookie(matchUpLivesCookie, newLives);
      changed = true;
    }
    if (currentWordsCount !== newWordsCount) {
      setCookie(matchUpWordsCountCookie, newWordsCount);
      changed = true;
    }
    if (changed) {
      toast("Settings saved successfully");
      refresh();
    }
  };

  useKeyboardShortcuts({
    shortcuts: [
      {
        scope: "global",
        shortcut: "toggleSettings",
        action: (e) => {
          e.preventDefault();
          ref.current?.click();
        },
      },
    ],
  });

  return (
    <TooltipProvider delayDuration={200}>
      <Drawer
        onOpenChange={() => {
          const livesValue = Number(getCookie(matchUpLivesCookie));
          setLives(
            Number.isNaN(livesValue)
              ? defaultMatchUpLives
              : Math.min(
                  matchUpLivesMax,
                  Math.max(matchUpLivesMin, livesValue),
                ),
          );
          const wordsValue = Number(getCookie(matchUpWordsCountCookie));
          setWordsCount(
            Number.isNaN(wordsValue)
              ? defaultMatchUpWordsCount
              : Math.min(
                  matchUpWordsCountMax,
                  Math.max(matchUpWordsCountMin, wordsValue),
                ),
          );
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <DrawerTrigger asChild>
              <Button
                aria-label="Settings"
                id={settingsButtonId}
                ref={ref}
                size="icon"
                variant="ghost"
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>
              Settings
              <KeyboardShortcut
                className="ml-2"
                scope="global"
                shortcut="toggleSettings"
              />
            </p>
          </TooltipContent>
        </Tooltip>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Settings</DrawerTitle>
              <DrawerDescription>Customize Match up behavior</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 p-4">
              <div>
                <Label htmlFor="match-up-lives">Number of lives: {lives}</Label>
                <Slider
                  className="mt-2"
                  id="match-up-lives"
                  onPointerMove={(e) => {
                    e.stopPropagation();
                  }}
                  min={matchUpLivesMin}
                  max={matchUpLivesMax}
                  step={1}
                  value={[lives]}
                  onValueChange={(value) => {
                    if (value?.[0] !== undefined) {
                      setLives(value[0]);
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="match-up-words-count">
                  Number of words: {wordsCount}
                </Label>
                <Slider
                  className="mt-2"
                  id="match-up-words-count"
                  onPointerMove={(e) => {
                    e.stopPropagation();
                  }}
                  min={matchUpWordsCountMin}
                  max={matchUpWordsCountMax}
                  step={1}
                  value={[wordsCount]}
                  onValueChange={(value) => {
                    if (value?.[0] !== undefined) {
                      setWordsCount(value[0]);
                    }
                  }}
                />
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button aria-label="Cancel" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button aria-label="Save settings" onClick={handleSaveSettings}>
                  Save
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </TooltipProvider>
  );
}
