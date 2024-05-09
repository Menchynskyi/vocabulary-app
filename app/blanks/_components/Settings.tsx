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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import {
  defaultVoiceOption,
  voiceChangeCustomEventName,
  voiceNameCookie,
  voiceOptions,
} from "@/constants/voice";
import { useKeyboardShortcuts } from "@/utils/keyboardShortcuts";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { blanksDifficultyCookie } from "@/constants/blanks";
import { settingsButtonId } from "@/constants";
import { BlanksDifficulty } from "@/types";

const difficultyOptions = [
  {
    label: BlanksDifficulty.Easy,
    value: 1,
  },
  {
    label: BlanksDifficulty.Medium,
    value: 2,
  },
  {
    label: BlanksDifficulty.Hard,
    value: 3,
  },
  {
    label: BlanksDifficulty.Extreme,
    value: 4,
  },
];

export function Settings() {
  const { refresh } = useRouter();
  const ref = useRef<HTMLButtonElement | null>(null);
  const [blanksDifficulty, setBlanksDifficulty] = useState(() => {
    const difficulty = getCookie(blanksDifficultyCookie);
    return (
      difficultyOptions.find((item) => item.label === difficulty)?.value ||
      difficultyOptions[0].value
    );
  });
  const [selectedVoice, setSelectedVoice] = useState(() => {
    return getCookie(voiceNameCookie) || defaultVoiceOption.name;
  });

  const difficulty = difficultyOptions.find(
    (item) => item.value === blanksDifficulty,
  )?.label;

  const handleSaveSettings = () => {
    const currentBlanksDifficulty = getCookie(blanksDifficultyCookie);
    const currentVoiceName = getCookie(voiceNameCookie);

    let isVoiceChanged = false;
    let isSettingsChanged = false;

    const newBlanksDifficulty = difficulty;
    const newVoiceName = selectedVoice;

    if (currentBlanksDifficulty !== newBlanksDifficulty) {
      setCookie(blanksDifficultyCookie, newBlanksDifficulty);
      isSettingsChanged = true;
    }

    if (currentVoiceName !== newVoiceName) {
      const customVoiceChangeEvent = new CustomEvent(
        voiceChangeCustomEventName,
      );
      document.dispatchEvent(customVoiceChangeEvent);

      setCookie(voiceNameCookie, newVoiceName);
      isVoiceChanged = true;
    }

    if (isSettingsChanged || isVoiceChanged) {
      toast("Settings saved successfully");
    }

    if (isSettingsChanged) {
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
          const difficulty = getCookie(blanksDifficultyCookie);
          setBlanksDifficulty(
            difficultyOptions.find((item) => item.label === difficulty)
              ?.value || 1,
          );
          setSelectedVoice(
            getCookie(voiceNameCookie) || defaultVoiceOption.name,
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
              <DrawerDescription>Customize blanks behavior</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 p-4">
              <div>
                <Label htmlFor="voice">Voice</Label>
                <Select
                  value={selectedVoice}
                  onValueChange={(value) => {
                    setSelectedVoice(value);
                  }}
                >
                  <SelectTrigger id="voice" className="mt-2 w-full">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    <SelectGroup>
                      {voiceOptions.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="blanks-difficulty">
                  Blanks difficulty: {difficulty}
                </Label>
                <Slider
                  className="mt-2"
                  id="blanks-difficulty"
                  onPointerMove={(e) => {
                    e.stopPropagation();
                  }}
                  defaultValue={[1]}
                  min={1}
                  max={4}
                  step={1}
                  value={[blanksDifficulty]}
                  onValueChange={(value) => {
                    if (value?.[0]) {
                      setBlanksDifficulty(value[0]);
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
