"use client";

import { Calendar } from "lucide-react";
import { CommandMenu, type PageCommand } from "@/components/CommandMenu";
import { useToggleVocabularyMode } from "@/hooks/useToggleVocabularyMode";

export function ContextCommandMenu() {
  const { toggleVocabularyMode } = useToggleVocabularyMode();

  const pageCommands: PageCommand[] = [
    {
      icon: <Calendar className="mr-2 h-4 w-4" />,
      label: "Toggle vocabulary mode",
      onSelect: toggleVocabularyMode,
      shortcut: { scope: "context", shortcut: "toggleVocabularyMode" },
    },
  ];

  return <CommandMenu pageCommands={pageCommands} showSettings />;
}
