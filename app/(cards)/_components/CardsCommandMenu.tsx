"use client";

import { useCallback, useContext } from "react";
import { Calendar, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { CommandMenu, type PageCommand } from "@/components/CommandMenu";
import { CardsDispatchContext } from "./CardsContext";
import { useToggleVocabularyMode } from "@/hooks/useToggleVocabularyMode";
import { useKeyboardShortcuts } from "@/utils/keyboardShortcuts";

export function CardsCommandMenu() {
  const dispatch = useContext(CardsDispatchContext);
  const { toggleVocabularyMode, searchParams } = useToggleVocabularyMode();

  const toggleFlipMode = useCallback(
    () => {
      dispatch({ type: "toggle_flip_mode" });
      toast("Flip mode toggled", {
        action: {
          label: "Undo",
          onClick: () => dispatch({ type: "toggle_flip_mode" }),
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useKeyboardShortcuts({
    shortcuts: [
      {
        scope: "cards",
        shortcut: "toggleFlipMode",
        action: (e) => {
          e.preventDefault();
          toggleFlipMode();
        },
      },
    ],
    deps: [searchParams, toggleFlipMode],
  });

  const pageCommands: PageCommand[] = [
    {
      icon: <RefreshCcw className="mr-2 h-4 w-4" />,
      label: "Toggle flip mode",
      onSelect: toggleFlipMode,
      shortcut: { scope: "cards", shortcut: "toggleFlipMode" },
    },
    {
      icon: <Calendar className="mr-2 h-4 w-4" />,
      label: "Toggle vocabulary mode",
      onSelect: toggleVocabularyMode,
      shortcut: { scope: "cards", shortcut: "toggleVocabularyMode" },
    },
  ];

  return <CommandMenu pageCommands={pageCommands} showVoice showSettings />;
}
