"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  cardsListLengthCookie,
  cardsListWeekModeLengthCookie,
  defaultCardsListLength,
  defaultCardsListWeekModeLength,
} from "@/constants/cards";
import { Settings as SettingsIcon } from "lucide-react";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Settings() {
  const { refresh } = useRouter();
  const [cardsListLength, setCardsListLength] = useState(() => {
    return Number(getCookie(cardsListLengthCookie)) || defaultCardsListLength;
  });
  const [cardsListWeekModeLength, setCardsListWeekModeLength] = useState(() => {
    return (
      Number(getCookie(cardsListWeekModeLengthCookie)) ||
      defaultCardsListWeekModeLength
    );
  });

  const handleSaveSettings = () => {
    const currentCardsListLength = getCookie(cardsListLengthCookie);
    const currentCardsListWeekModeLength = getCookie(
      cardsListWeekModeLengthCookie,
    );

    let isSettingsChanged = false;

    const newCardsListLength = cardsListLength.toString();
    const newCardsListWeekModeLength = cardsListWeekModeLength.toString();

    if (currentCardsListLength !== newCardsListLength) {
      setCookie(cardsListLengthCookie, newCardsListLength);
      isSettingsChanged = true;
    }

    if (currentCardsListWeekModeLength !== newCardsListWeekModeLength) {
      setCookie(cardsListWeekModeLengthCookie, newCardsListWeekModeLength);
      isSettingsChanged = true;
    }

    if (isSettingsChanged) {
      toast("Settings saved successfully");
      refresh();
    }
  };

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
        }}
      >
        <DrawerTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Cards settings</DrawerTitle>
              <DrawerDescription>Customize cards behavior</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 p-4">
              <p className="text-sm">
                Random mode card limit: {cardsListLength}
              </p>
              <Slider
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
              <p className="text-sm">
                Week mode card limit: {cardsListWeekModeLength}
              </p>
              <Slider
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
            <DrawerFooter>
              <DrawerClose asChild>
                <Button onClick={handleSaveSettings}>Save</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </TooltipProvider>
  );
}
