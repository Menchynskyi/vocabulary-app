import { DependencyList, useEffect } from "react";

type Modifier = "ctrl";

type UseKeyboardShortcutsParams = {
  shortcuts: Array<{
    key: string;
    modifier?: Modifier;
    action: (e: KeyboardEvent) => void;
  }>;
  deps?: DependencyList;
};

const modifierChecks: Record<Modifier, (e: KeyboardEvent) => boolean> = {
  ctrl: (e: KeyboardEvent) => e.metaKey || e.ctrlKey,
};

const isModifierPressed = (e: KeyboardEvent, modifier?: Modifier): boolean => {
  if (!modifier) return true;
  return modifierChecks[modifier](e);
};

export const useKeyboardShortcuts = ({
  shortcuts,
  deps = [],
}: UseKeyboardShortcutsParams) => {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      shortcuts.forEach(({ key, modifier, action }) => {
        if (e.key === key && isModifierPressed(e, modifier)) {
          action(e);
        }
      });
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
