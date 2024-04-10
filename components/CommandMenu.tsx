"use client";

import {
  Calendar,
  Moon,
  Sun,
  Laptop,
  Triangle,
  Wand,
  Layers3,
  RefreshCcw,
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
} from "@/components/ui/command";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { CardsDispatchContext } from "@/app/(cards)/layout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateRangeMode } from "@/types";
import { toast } from "sonner";
import { GithubIcon } from "./icons/GithubIcon";
import { NotionIcon } from "./icons/NotionIcon";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dispatch = useContext(CardsDispatchContext);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();

  const isCardsPage = pathname === "/";

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast("Theme toggled", {
      description: `Changed to ${theme === "dark" ? "light" : "dark"} mode`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const toggleFlippedMode = useCallback(
    () => {
      dispatch({ type: "toggle_flipped_mode" });
      toast("Flipped mode toggled", {
        action: {
          label: "Undo",
          onClick: () => dispatch({ type: "toggle_flipped_mode" }),
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const toggleDateRangeMode = () => {
    const params = new URLSearchParams(searchParams);
    const isWeekMode = params.get("mode") === DateRangeMode.week;

    if (isWeekMode) {
      params.delete("mode");
    } else {
      params.set("mode", DateRangeMode.week);
    }

    replace(`${pathname}?${params.toString()}`);
  };

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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleTheme();
      }

      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleFlippedMode();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="mr-2"
      >
        <span className="pr-2 text-sm text-muted-foreground">
          Search commands...
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {isCardsPage && (
              <>
                <CommandItem onSelect={closeAfterDecorator(toggleFlippedMode)}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  <span>Toggle flipped mode</span>
                  <CommandShortcut>⌘F</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={closeAfterDecorator(toggleDateRangeMode)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Toggle date range mode</span>
                </CommandItem>
              </>
            )}
            <CommandItem onSelect={closeAfterDecorator(toggleTheme)}>
              {themeIcon}
              <span>{`Toggle theme`}</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => push(isCardsPage ? "/matchup" : "/")}>
              {isCardsPage ? (
                <Wand className="mr-2 h-4 w-4" />
              ) : (
                <Layers3 className="mr-2 h-4 w-4" />
              )}
              <span>{isCardsPage ? "Matchup" : "Cards"}</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                window.open(
                  "https://www.notion.so/menchynskyi/Words-and-expressions-beab3c4d95a44f5fb55e49040ec2c314?pvs=4",
                  "_blank",
                )
              }
            >
              <NotionIcon className="mr-2 h-5 w-5" />
              <span>Notion vocabulary</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                window.open(
                  "https://vercel.com/menchynskyis-projects/vocabulary-app",
                  "_blank",
                )
              }
            >
              <Triangle className="mr-2 h-4 w-4" />
              <span>Vercel</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                push("https://github.com/Menchynskyi/vocabulary-app")
              }
            >
              <GithubIcon className="mr-2 h-3 w-3" />
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
