import { Search } from "lucide-react";
import { KeyboardShortcut } from "./KeyboardShortcut";
import { Button } from "./ui/Button";

type CommandMenuButtonProps = {
  onOpen: () => void;
};

export function CommandMenuTrigger({ onOpen }: CommandMenuButtonProps) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onOpen}
      className="max-sm:h-full sm:mr-2 sm:border sm:border-input sm:bg-background sm:hover:bg-accent sm:hover:text-accent-foreground"
      aria-label="Open command menu"
    >
      <span className="hidden pr-2 text-sm text-muted-foreground sm:inline">
        Search commands...
      </span>
      <KeyboardShortcut scope="global" shortcut="toggleCommandMenu" />
      <Search className="h-4 w-4 sm:hidden" />
    </Button>
  );
}
