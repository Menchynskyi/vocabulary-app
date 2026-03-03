"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  cardsListLatestLengthCookie,
  cardsListRandomLengthCookie,
  cardsListWeekModeLengthCookie,
  defaultCardsListLatestLength,
  defaultCardsListRandomLength,
  defaultCardsListWeekModeLength,
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
  VoiceName,
  defaultVoiceOption,
  voiceChangeCustomEventName,
  voiceNameCookie,
  voiceOptions,
} from "@/constants/voice";
import { useKeyboardShortcuts } from "@/utils/keyboardShortcuts";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { settingsButtonId } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import {
  getAuthorizedUserSettings,
  upsertAuthorizedUserSettings,
} from "@/server/db/queries";

export function Settings() {
  const { refresh } = useRouter();
  const { isSignedIn } = useAuth();
  const ref = useRef<HTMLButtonElement | null>(null);
  const [cardsListLatestLength, setCardsListLatestLength] = useState(() => {
    return (
      Number(getCookie(cardsListLatestLengthCookie)) ||
      defaultCardsListLatestLength
    );
  });
  const [cardsListRandomLength, setCardsListRandomLength] = useState(() => {
    return (
      Number(getCookie(cardsListRandomLengthCookie)) ||
      defaultCardsListRandomLength
    );
  });
  const [cardsListWeekModeLength, setCardsListWeekModeLength] = useState(() => {
    return (
      Number(getCookie(cardsListWeekModeLengthCookie)) ||
      defaultCardsListWeekModeLength
    );
  });
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(() => {
    return (getCookie(voiceNameCookie) as VoiceName) || defaultVoiceOption.name;
  });

  const loadSettings = useCallback(async () => {
    const fallbackCardsListLatestLength =
      Number(getCookie(cardsListLatestLengthCookie)) ||
      defaultCardsListLatestLength;
    const fallbackCardsListRandomLength =
      Number(getCookie(cardsListRandomLengthCookie)) ||
      defaultCardsListRandomLength;
    const fallbackCardsListWeekModeLength =
      Number(getCookie(cardsListWeekModeLengthCookie)) ||
      defaultCardsListWeekModeLength;
    const fallbackVoice = getCookie(voiceNameCookie) || defaultVoiceOption.name;

    if (!isSignedIn) {
      setCardsListLatestLength(fallbackCardsListLatestLength);
      setCardsListRandomLength(fallbackCardsListRandomLength);
      setCardsListWeekModeLength(fallbackCardsListWeekModeLength);
      setSelectedVoice(fallbackVoice as VoiceName);
      return;
    }

    try {
      const settings = await getAuthorizedUserSettings();
      setCardsListLatestLength(
        settings.cards?.cardsListLatestLength ?? fallbackCardsListLatestLength,
      );
      setCardsListRandomLength(
        settings.cards?.cardsListRandomLength ?? fallbackCardsListRandomLength,
      );
      setCardsListWeekModeLength(
        settings.cards?.cardsListWeekModeLength ??
          fallbackCardsListWeekModeLength,
      );
      setSelectedVoice(
        (settings.global?.voiceName as VoiceName | undefined) ??
          (fallbackVoice as VoiceName),
      );
    } catch (error) {
      console.error(error);
      setCardsListLatestLength(fallbackCardsListLatestLength);
      setCardsListRandomLength(fallbackCardsListRandomLength);
      setCardsListWeekModeLength(fallbackCardsListWeekModeLength);
      setSelectedVoice(fallbackVoice as VoiceName);
    }
  }, [isSignedIn]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const handleSaveSettings = async () => {
    const currentCardsListLatestLength = Number(
      getCookie(cardsListLatestLengthCookie),
    );
    const currentCardsListRandomLength = Number(
      getCookie(cardsListRandomLengthCookie),
    );
    const currentCardsListWeekModeLength = Number(
      getCookie(cardsListWeekModeLengthCookie),
    );
    const currentVoiceName = getCookie(voiceNameCookie)?.toString();

    let isVoiceChanged = false;
    let isSettingsChanged = false;

    const newCardsListLatestLength = cardsListLatestLength;
    const newCardsListRandomLength = cardsListRandomLength;
    const newCardsListWeekModeLength = cardsListWeekModeLength;
    const newVoiceName: VoiceName = selectedVoice;

    if (isSignedIn) {
      try {
        const settings = await getAuthorizedUserSettings();
        const currentCardsDb = settings.cards;
        const currentGlobalDb = settings.global;

        if (
          currentCardsDb?.cardsListLatestLength !== newCardsListLatestLength ||
          currentCardsDb?.cardsListRandomLength !== newCardsListRandomLength ||
          currentCardsDb?.cardsListWeekModeLength !== newCardsListWeekModeLength
        ) {
          isSettingsChanged = true;
        }

        if (
          (currentGlobalDb?.voiceName ?? defaultVoiceOption.name) !==
          newVoiceName
        ) {
          const customVoiceChangeEvent = new CustomEvent(
            voiceChangeCustomEventName,
          );
          document.dispatchEvent(customVoiceChangeEvent);
          isVoiceChanged = true;
        }

        if (isSettingsChanged || isVoiceChanged) {
          await upsertAuthorizedUserSettings({
            cards: {
              cardsListLatestLength: newCardsListLatestLength,
              cardsListRandomLength: newCardsListRandomLength,
              cardsListWeekModeLength: newCardsListWeekModeLength,
            },
            global: {
              voiceName: newVoiceName,
            },
          });
        }
      } catch (error) {
        console.error(error);
        toast("Failed to save settings");
        return;
      }
    } else {
      if (currentCardsListLatestLength !== newCardsListLatestLength) {
        setCookie(
          cardsListLatestLengthCookie,
          newCardsListLatestLength.toString(),
        );
        isSettingsChanged = true;
      }

      if (currentCardsListRandomLength !== newCardsListRandomLength) {
        setCookie(
          cardsListRandomLengthCookie,
          newCardsListRandomLength.toString(),
        );
        isSettingsChanged = true;
      }

      if (currentCardsListWeekModeLength !== newCardsListWeekModeLength) {
        setCookie(
          cardsListWeekModeLengthCookie,
          newCardsListWeekModeLength.toString(),
        );
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
        onOpenChange={(open) => {
          if (open) {
            void loadSettings();
          }
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
              <DrawerDescription>Customize cards behavior</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 p-4">
              <div>
                <Label htmlFor="voice">Voice</Label>
                <Select
                  value={selectedVoice}
                  onValueChange={(value) => {
                    setSelectedVoice(value as VoiceName);
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
                <Label htmlFor="latest-mode-card-limit">
                  Latest mode card limit: {cardsListLatestLength}
                </Label>
                <Slider
                  className="mt-2"
                  id="latest-mode-card-limit"
                  onPointerMove={(e) => {
                    e.stopPropagation();
                  }}
                  defaultValue={[defaultCardsListLatestLength]}
                  min={5}
                  max={50}
                  step={1}
                  value={[cardsListLatestLength]}
                  onValueChange={(value) => {
                    if (value?.[0]) {
                      setCardsListLatestLength(value[0]);
                    }
                  }}
                />
              </div>

              <div>
                <Label htmlFor="random-mode-card-limit">
                  Random mode card limit: {cardsListRandomLength}
                </Label>
                <Slider
                  className="mt-2"
                  id="random-mode-card-limit"
                  onPointerMove={(e) => {
                    e.stopPropagation();
                  }}
                  defaultValue={[defaultCardsListRandomLength]}
                  min={5}
                  max={50}
                  step={1}
                  value={[cardsListRandomLength]}
                  onValueChange={(value) => {
                    if (value?.[0]) {
                      setCardsListRandomLength(value[0]);
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
                <Button aria-label="Cancel" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button
                  aria-label="Save settings"
                  onClick={() => {
                    void handleSaveSettings();
                  }}
                >
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
