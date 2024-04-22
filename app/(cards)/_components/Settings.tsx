"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  cardsListLengthCookie,
  cardsListWeekModeLengthCookie,
  defaultCardsListLength,
  defaultCardsListWeekModeLength,
  settingsButtonId,
} from "@/constants/cards";
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

export function Settings() {
  const { refresh } = useRouter();
  const ref = useRef<HTMLButtonElement | null>(null);
  const [cardsListLength, setCardsListLength] = useState(() => {
    return Number(getCookie(cardsListLengthCookie)) || defaultCardsListLength;
  });
  const [cardsListWeekModeLength, setCardsListWeekModeLength] = useState(() => {
    return (
      Number(getCookie(cardsListWeekModeLengthCookie)) ||
      defaultCardsListWeekModeLength
    );
  });
  const [selectedVoice, setSelectedVoice] = useState(() => {
    return getCookie(voiceNameCookie) || defaultVoiceOption.name;
  });

  const handleSaveSettings = () => {
    const currentCardsListLength = getCookie(cardsListLengthCookie);
    const currentCardsListWeekModeLength = getCookie(
      cardsListWeekModeLengthCookie,
    );
    const currentVoiceName = getCookie(voiceNameCookie);

    let isVoiceChanged = false;
    let isSettingsChanged = false;

    const newCardsListLength = cardsListLength.toString();
    const newCardsListWeekModeLength = cardsListWeekModeLength.toString();
    const newVoiceName = selectedVoice;

    if (currentCardsListLength !== newCardsListLength) {
      setCookie(cardsListLengthCookie, newCardsListLength);
      isSettingsChanged = true;
    }

    if (currentCardsListWeekModeLength !== newCardsListWeekModeLength) {
      setCookie(cardsListWeekModeLengthCookie, newCardsListWeekModeLength);
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

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey) && ref.current) {
        e.preventDefault();
        ref.current.click();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <Drawer
        onOpenChange={() => {
          setCardsListLength(
            Number(getCookie(cardsListLengthCookie)) || defaultCardsListLength,
          );
          setCardsListWeekModeLength(
            Number(getCookie(cardsListWeekModeLengthCookie)) ||
              defaultCardsListWeekModeLength,
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
              <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:inline-flex">
                <span className="text-xs">⌘</span>S
              </kbd>
            </p>
          </TooltipContent>
        </Tooltip>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Cards settings</DrawerTitle>
              <DrawerDescription>Customize cards behavior</DrawerDescription>
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
                <Label htmlFor="random-mode-card-limit">
                  Random mode card limit: {cardsListLength}
                </Label>
                <Slider
                  className="mt-2"
                  id="random-mode-card-limit"
                  onPointerMove={(e) => {
                    e.stopPropagation();
                  }}
                  defaultValue={[defaultCardsListLength]}
                  min={5}
                  max={50}
                  step={1}
                  value={[cardsListLength]}
                  onValueChange={(value) => {
                    if (value?.[0]) {
                      setCardsListLength(value[0]);
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="week-mode-card-limit">
                  Week mode card limit: {cardsListWeekModeLength}
                </Label>
                <Slider
                  className="mt-2"
                  id="week-mode-card-limit"
                  onPointerMove={(e) => {
                    e.stopPropagation();
                  }}
                  defaultValue={[defaultCardsListWeekModeLength]}
                  min={5}
                  max={50}
                  step={1}
                  value={[cardsListWeekModeLength]}
                  onValueChange={(value) => {
                    if (value?.[0]) {
                      setCardsListWeekModeLength(value[0]);
                    }
                  }}
                />
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button aria-label="Save settings" onClick={handleSaveSettings}>
                  Save
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button aria-label="Cancel" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </TooltipProvider>
  );
}
