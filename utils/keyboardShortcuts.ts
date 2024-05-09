import { DependencyList, useEffect } from "react";
import { isClerkModalOpen, isRadixModalOpen } from "./modals";

export type Shortcut = {
  key: string;
  withModifier?: boolean;
  displayName: string;
};

type ShortcutsObject = {
  global: {
    toggleTheme: Shortcut;
    toggleSettings: Shortcut;
    toggleCommandMenu: Shortcut;
  };
  cards: {
    flipCard: Shortcut;
    prevCard: Shortcut;
    nextCard: Shortcut;
    pronounceWord: Shortcut;
    editWord: Shortcut;
    toggleFlipMode: Shortcut;
    toggleVocabularyMode: Shortcut;
    copyCard: Shortcut;
  };
  blanks: {
    nextWord: Shortcut;
    revealLetter: Shortcut;
    pronounceWord: Shortcut;
  };
};

export const shortcuts: ShortcutsObject = {
  global: {
    toggleTheme: { key: "u", withModifier: true, displayName: "U" },
    toggleSettings: { key: "s", withModifier: true, displayName: "S" },
    toggleCommandMenu: { key: "k", withModifier: true, displayName: "K" },
  },
  cards: {
    flipCard: { key: " ", displayName: "Space" },
    prevCard: { key: "ArrowLeft", displayName: "←" },
    nextCard: { key: "ArrowRight", displayName: "→" },
    pronounceWord: { key: "p", withModifier: true, displayName: "P" },
    editWord: { key: "e", withModifier: true, displayName: "E" },
    toggleFlipMode: { key: "f", withModifier: true, displayName: "F" },
    toggleVocabularyMode: {
      key: "i",
      withModifier: true,
      displayName: "I",
    },
    copyCard: { key: "b", withModifier: true, displayName: "B" },
  },
  blanks: {
    nextWord: { key: "Enter", withModifier: true, displayName: "↵" },
    revealLetter: { key: "f", withModifier: true, displayName: "F" },
    pronounceWord: { key: "p", withModifier: true, displayName: "P" },
  },
};

export type ShortcutsScope = keyof ShortcutsObject;
export type ScopeShortcuts<T extends ShortcutsScope> = keyof ShortcutsObject[T];

export const getShortcutDisplayName = <T extends ShortcutsScope>(
  scope: T,
  shortcut: ScopeShortcuts<T>,
) => {
  const { displayName, withModifier } = shortcuts[scope][shortcut] as Shortcut;

  return withModifier ? `⌘+${displayName}` : displayName;
};

const isModifierPressed = (e: KeyboardEvent, withModifier?: boolean) => {
  if (withModifier === undefined) return true;

  return e.metaKey || e.ctrlKey;
};

type UseKeyboardShortcutsParams<T extends ShortcutsScope> = {
  shortcuts: Array<{
    scope: T;
    // TS limitation
    shortcut:
      | ScopeShortcuts<"global">
      | ScopeShortcuts<"cards">
      | ScopeShortcuts<"blanks">;
    action: (e: KeyboardEvent) => void;
  }>;
  deps?: DependencyList;
};

export const useKeyboardShortcuts = <T extends ShortcutsScope>({
  shortcuts: shortcutsList,
  deps = [],
}: UseKeyboardShortcutsParams<T>) => {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (isClerkModalOpen()) return;

      shortcutsList.forEach(({ scope, shortcut, action }) => {
        const currShortcut = shortcuts[scope][
          shortcut as ScopeShortcuts<T>
        ] as Shortcut;
        if (!currShortcut) throw new Error(`Shortcut ${shortcut} not found`);
        if (!currShortcut.withModifier && isRadixModalOpen()) return;

        if (
          e.key === currShortcut.key &&
          isModifierPressed(e, currShortcut.withModifier)
        ) {
          action(e);
        }
      });
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
