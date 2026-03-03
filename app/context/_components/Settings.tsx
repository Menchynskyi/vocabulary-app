"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Settings as SettingsIcon } from "lucide-react";
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
import { Label } from "@/components/ui/Label";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { settingsButtonId } from "@/constants";
import { useKeyboardShortcuts } from "@/utils/keyboardShortcuts";
import {
  getAuthorizedUserSettings,
  upsertAuthorizedUserSettings,
} from "@/server/db/queries";
import {
  contextWordsCountMax,
  contextWordsCountMin,
  defaultContextWordsCount,
} from "@/constants/context";

export function Settings() {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { refresh } = useRouter();
  const [wordsCount, setWordsCount] = useState(defaultContextWordsCount);

  const loadSettings = useCallback(async () => {
    try {
      const settings = await getAuthorizedUserSettings();
      setWordsCount(
        settings.context?.contextWordsCount ?? defaultContextWordsCount,
      );
    } catch (error) {
      console.error(error);
      toast("Failed to load settings");
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const handleSaveSettings = async () => {
    try {
      const settings = await getAuthorizedUserSettings();
      const previousWordsCount =
        settings.context?.contextWordsCount ?? defaultContextWordsCount;
      if (previousWordsCount === wordsCount) {
        return;
      }

      await upsertAuthorizedUserSettings({
        context: {
          contextWordsCount: wordsCount,
        },
      });
      toast("Settings saved successfully");
      refresh();
    } catch (error) {
      console.error(error);
      toast("Failed to save settings");
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
              <DrawerDescription>
                Customize context game behavior
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 p-4">
              <div>
                <Label htmlFor="context-words-count">
                  Words per round: {wordsCount}
                </Label>
                <Slider
                  className="mt-2"
                  id="context-words-count"
                  onPointerMove={(event) => {
                    event.stopPropagation();
                  }}
                  min={contextWordsCountMin}
                  max={contextWordsCountMax}
                  step={1}
                  value={[wordsCount]}
                  onValueChange={(value) => {
                    if (value?.[0]) {
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
