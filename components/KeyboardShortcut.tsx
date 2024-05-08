import {
  ShortcutsScope,
  shortcuts,
  Shortcut,
  ScopeShortcuts,
} from "@/utils/keyboardShortcuts";
import { cn } from "@/utils/tailwind";

type KeyboardShortcutProps<T extends ShortcutsScope> = {
  scope: T;
  shortcut: ScopeShortcuts<T>;
  className?: string;
};

export function KeyboardShortcut<T extends ShortcutsScope>({
  scope,
  shortcut,
  className = "",
}: KeyboardShortcutProps<T>) {
  const { withModifier, displayName } = shortcuts[scope][shortcut] as Shortcut;
  return (
    <kbd
      className={cn(
        "pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:inline-flex",
        className,
      )}
    >
      {withModifier && <span className="text-xs">⌘</span>}
      {displayName}
    </kbd>
  );
}
