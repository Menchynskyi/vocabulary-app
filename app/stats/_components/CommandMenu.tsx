"use client";

import {
  Laptop,
  Layers3,
  Link2,
  Moon,
  Sun,
  Triangle,
  Wand,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/Command";
import { useCallback, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { NotionIcon } from "@/components/icons/NotionIcon";
import {
  getShortcutDisplayName,
  useKeyboardShortcuts,
} from "@/utils/keyboardShortcuts";
import { CommandMenuTrigger } from "@/components/CommandMenuButton";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { push } = useRouter();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast("Theme toggled", {
      description: `Changed to ${theme === "dark" ? "light" : "dark"} mode`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const changeTheme = (theme: string) => {
    setTheme(theme);
    toast("Theme changed", {
      description: `Changed to ${theme} mode`,
    });
  };

  const themeIcon = useMemo(() => {
    switch (theme) {
      case "dark":
        return <Moon className="mr-2 h-4 w-4" />;
      case "light":
        return <Sun className="mr-2 h-4 w-4" />;
      default:
        return <Laptop className="mr-2 h-4 w-4" />;
    }
  }, [theme]);

  const closeAfterDecorator = (fn: () => void) => () => {
    fn();
    setOpen(false);
  };

  useKeyboardShortcuts({
    shortcuts: [
      {
        scope: "global",
        shortcut: "toggleCommandMenu",
        action: (e) => {
          e.preventDefault();
          setOpen((open) => !open);
        },
      },
      {
        scope: "global",
        shortcut: "toggleTheme",
        action: (e) => {
          e.preventDefault();
          toggleTheme();
          setOpen(false);
        },
      },
    ],
    deps: [toggleTheme],
  });

  return (
    <>
      <CommandMenuTrigger onOpen={() => setOpen(true)} />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={closeAfterDecorator(toggleTheme)}>
              {themeIcon}
              <span>{`Toggle theme`}</span>
              <CommandShortcut className="hidden sm:block">
                {getShortcutDisplayName("global", "toggleTheme")}
              </CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => push("/")}>
              <Layers3 className="mr-2 h-4 w-4" />
              <span>Cards</span>
            </CommandItem>
            <CommandItem onSelect={() => push("/match-up")}>
              <Link2 className="mr-2 h-4 w-4" />
              <span>Match up</span>
            </CommandItem>
            <CommandItem onSelect={() => push("/blanks")}>
              <Wand className="mr-2 h-4 w-4" />
              <span>Blanks</span>
            </CommandItem>
            <CommandItem
              onSelect={closeAfterDecorator(() =>
                window.open(process.env.NEXT_PUBLIC_NOTION_PAGE_URL, "_blank"),
              )}
            >
              <NotionIcon className="mr-2" />
              <span>Notion vocabulary</span>
            </CommandItem>
            <CommandItem
              onSelect={closeAfterDecorator(() =>
                window.open(
                  process.env.NEXT_PUBLIC_VERCEL_PROJECT_URL,
                  "_blank",
                ),
              )}
            >
              <Triangle className="mr-2 h-4 w-4" />
              <span>Vercel</span>
            </CommandItem>
            <CommandItem
              onSelect={closeAfterDecorator(() =>
                window.open(
                  "https://github.com/Menchynskyi/vocabulary-app",
                  "_blank",
                ),
              )}
            >
              <GithubIcon className="mr-2 !h-[1.125rem] !w-[1.125rem]" />
              <span>GitHub</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem
              onSelect={closeAfterDecorator(() => changeTheme("light"))}
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </CommandItem>
            <CommandItem
              onSelect={closeAfterDecorator(() => changeTheme("dark"))}
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem
              onSelect={closeAfterDecorator(() => changeTheme("system"))}
            >
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
