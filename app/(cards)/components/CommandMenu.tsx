"use client";

import {
  Calendar,
  Moon,
  Sun,
  Laptop,
  Triangle,
  Wand,
  RefreshCcw,
  Search,
  AudioWaveform,
  AudioLines,
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
import { Button } from "../../../components/ui/button";
import { CardsDispatchContext } from "@/app/(cards)/components/CardsContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateRangeMode } from "@/types";
import { toast } from "sonner";
import { GithubIcon } from "../../../components/icons/GithubIcon";
import { NotionIcon } from "../../../components/icons/NotionIcon";
import {
  VoiceLanguageCode,
  VoiceName,
  voiceChangeCustomEventName,
  voiceNameCookie,
  voiceOptions,
} from "@/constants/voice";
import { getCookie, setCookie } from "cookies-next";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dispatch = useContext(CardsDispatchContext);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();

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

  const toggleVocabularyMode = () => {
    const params = new URLSearchParams(searchParams);
    const isWeekMode = params.get("mode") === DateRangeMode.week;

    if (isWeekMode) {
      params.delete("mode");
    } else {
      params.set("mode", DateRangeMode.week);
    }

    replace(`${pathname}?${params.toString()}`);

    toast("Vocabulary mode toggled", {
      description: `Changed to ${isWeekMode ? "random" : "week"} mode`,
    });
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

  const setRandomVoice = (langCode: VoiceLanguageCode) => () => {
    const currentVoiceName = getCookie(voiceNameCookie) as VoiceName;
    const voices = voiceOptions.filter(
      (item) =>
        item.languageCode === langCode && item.name !== currentVoiceName,
    );
    const randomIndex = Math.floor(Math.random() * voices.length);
    const voiceName = voices[randomIndex].name;

    const customVoiceChangeEvent = new CustomEvent(voiceChangeCustomEventName);
    document.dispatchEvent(customVoiceChangeEvent);

    setCookie(voiceNameCookie, voiceName);
    toast("Voice changed", {
      description: `Changed to ${voices[randomIndex].label} voice`,
      action: {
        label: "Undo",
        onClick: () => {
          setCookie(voiceNameCookie, currentVoiceName);
          document.dispatchEvent(customVoiceChangeEvent);
        },
      },
    });
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }

      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleTheme();
        setOpen(false);
      }

      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleFlippedMode();
        setOpen(false);
      }

      if (e.key === "v" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleVocabularyMode();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="mr-2"
      >
        <span className="hidden pr-2 text-sm text-muted-foreground sm:inline">
          Search commands...
        </span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
        <Search className="h-4 w-4 sm:hidden" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={closeAfterDecorator(toggleFlippedMode)}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              <span>Toggle flipped mode</span>
              <CommandShortcut className="hidden sm:block">⌘F</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={closeAfterDecorator(toggleVocabularyMode)}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Toggle vocabulary mode</span>
              <CommandShortcut className="hidden sm:block">⌘V</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={closeAfterDecorator(toggleTheme)}>
              {themeIcon}
              <span>{`Toggle theme`}</span>
              <CommandShortcut className="hidden sm:block">⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Voice">
            <CommandItem
              onSelect={closeAfterDecorator(setRandomVoice("en-US"))}
            >
              <AudioWaveform className="mr-2 h-4 w-4" />
              <span>Set random US English voice</span>
            </CommandItem>
            <CommandItem
              onSelect={closeAfterDecorator(setRandomVoice("en-GB"))}
            >
              <AudioLines className="mr-2 h-4 w-4" />
              <span>Set random GB English voice</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => push("/matchup")}>
              <Wand className="mr-2 h-4 w-4" />
              <span>Matchup</span>
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
                  "https://vercel.com/menchynskyis-projects/vocabulary-app",
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