"use client";

import { VocabularyMode } from "@/types";
import { KeyboardShortcut } from "./KeyboardShortcut";
import { getNextVocabularyMode } from "@/utils/getNextVocabularyMode";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/Button";
import { useKeyboardShortcuts } from "@/utils/keyboardShortcuts";

type VocabularyModeStatusProps = {
  vocabularyMode?: VocabularyMode;
};

const MODES_DISPLAY_NAMES: Record<VocabularyMode, string> = {
  [VocabularyMode.random]: "Random words",
  [VocabularyMode.latest]: "Latest words",
  [VocabularyMode.week]: "Last week words",
};

export function VocabularyModeStatus({
  vocabularyMode = VocabularyMode.latest,
}: VocabularyModeStatusProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isPending, startTransition] = useTransition();
  const [showPending, setShowPending] = useState(false);

  const pendingResolveRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleVocabularyMode = () => {
    const params = new URLSearchParams(searchParams);
    const currentMode = params.get("mode") as VocabularyMode;
    const newMode = getNextVocabularyMode(currentMode);

    const promise = new Promise<string>((resolve) => {
      pendingResolveRef.current = () => resolve(newMode);
    });

    toast.promise(promise, {
      loading: "Changing vocabulary mode...",
      success: (mode) => `Changed to ${mode} mode`,
      error: "Failed to change mode",
    });

    startTransition(() => {
      replace(`${pathname}?mode=${newMode}`);
    });
  };

  useEffect(() => {
    if (isPending) {
      timerRef.current = setTimeout(() => setShowPending(true), 100);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setShowPending(false);

      if (pendingResolveRef.current) {
        pendingResolveRef.current();
        pendingResolveRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPending]);

  useKeyboardShortcuts({
    shortcuts: [
      {
        scope: "cards",
        shortcut: "toggleVocabularyMode",
        action: (e) => {
          if (isPending) return;

          e.preventDefault();
          toggleVocabularyMode();
        },
      },
    ],
    deps: [isPending],
  });

  return (
    <Button
      variant="outline"
      disabled={showPending}
      onClick={toggleVocabularyMode}
      className="fixed bottom-4 right-4 z-50 flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 py-2 font-medium shadow-sm transition-[width] duration-1000 hover:bg-accent max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 max-sm:bg-[transparent] max-sm:backdrop-blur-md max-sm:hover:bg-[transparent] max-sm:active:bg-[transparent]"
    >
      {MODES_DISPLAY_NAMES[vocabularyMode]}{" "}
      <KeyboardShortcut
        scope="cards"
        shortcut="toggleVocabularyMode"
        className="ml-2"
      />
    </Button>
  );
}
