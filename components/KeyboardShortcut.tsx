import { cn } from "@/utils/tailwind";

type KeyboardShortcutProps = {
  shortcut: string;
  withModifier?: boolean;
  className?: string;
};

export function KeyboardShortcut({
  shortcut,
  className = "",
  withModifier = false,
}: KeyboardShortcutProps) {
  return (
    <kbd
      className={cn(
        "pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:inline-flex",
        className,
      )}
    >
      {withModifier && <span className="text-xs">⌘</span>}
      {shortcut}
    </kbd>
  );
}
