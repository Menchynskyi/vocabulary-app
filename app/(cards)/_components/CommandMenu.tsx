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
  SettingsIcon,
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
import { useCallback, useContext, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { CardsDispatchContext } from "./CardsContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { VocabularyMode } from "@/types";
import { toast } from "sonner";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { NotionIcon } from "@/components/icons/NotionIcon";
import {
  VoiceLanguageCode,
  VoiceName,
  voiceChangeCustomEventName,
  voiceNameCookie,
  voiceOptions,
} from "@/constants/voice";
import { getCookie, setCookie } from "cookies-next";
import { settingsButtonId } from "@/constants";
import {
  getShortcutDisplayName,
  useKeyboardShortcuts,
} from "@/utils/keyboardShortcuts";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { useIsMounted } from "@/utils/useIsMounted";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dispatch = useContext(CardsDispatchContext);

  const { isMobile } = useMediaQuery();
  const isMounted = useIsMounted();
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

  const toggleVocabularyMode = () => {
    const params = new URLSearchParams(searchParams);
    const isWeekMode = params.get("mode") === VocabularyMode.week;

    if (isWeekMode) {
      params.delete("mode");
    } else {
      params.set("mode", VocabularyMode.week);
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

  const openSettings = () => {
    document.getElementById(settingsButtonId)?.click();
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
      {
        scope: "cards",
        shortcut: "toggleFlipMode",
        action: (e) => {
          e.preventDefault();
          toggleFlipMode();
          setOpen(false);
        },
      },
      {
        scope: "cards",
        shortcut: "toggleVocabularyMode",
        action: (e) => {
          e.preventDefault();
          toggleVocabularyMode();
          setOpen(false);
        },
      },
    ],
    deps: [searchParams, toggleTheme],
  });

  return (
    <>
      {isMounted && (
        <Button
          onClick={() => setOpen(true)}
          variant={isMobile ? "ghost" : "outline"}
          size="sm"
          className="max-sm:h-full sm:mr-2"
          aria-label="Open command menu"
        >
          <span className="hidden pr-2 text-sm text-muted-foreground sm:inline">
            Search commands...
          </span>
          <KeyboardShortcut scope="global" shortcut="toggleCommandMenu" />
          <Search className="h-4 w-4 sm:hidden" />
        </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={closeAfterDecorator(toggleFlipMode)}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              <span>Toggle flip mode</span>
              <CommandShortcut className="hidden sm:block">
                {getShortcutDisplayName("cards", "toggleFlipMode")}
              </CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={closeAfterDecorator(toggleVocabularyMode)}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Toggle vocabulary mode</span>
              <CommandShortcut className="hidden sm:block">
                {getShortcutDisplayName("cards", "toggleVocabularyMode")}
              </CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={closeAfterDecorator(toggleTheme)}>
              {themeIcon}
              <span>{`Toggle theme`}</span>
              <CommandShortcut className="hidden sm:block">
                {getShortcutDisplayName("global", "toggleTheme")}
              </CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={closeAfterDecorator(openSettings)}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut className="hidden sm:block">
                {getShortcutDisplayName("global", "toggleSettings")}
              </CommandShortcut>
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
