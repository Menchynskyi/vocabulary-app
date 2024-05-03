"use client";

import {
  Moon,
  Sun,
  Laptop,
  Triangle,
  Layers3,
  Search,
  SettingsIcon,
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
} from "@/components/ui/Command";
import { useCallback, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { NotionIcon } from "@/components/icons/NotionIcon";
import { useKeyboardShortcuts } from "@/utils/useKeyboardShortcuts";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { settingsButtonId } from "@/constants";
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

  const openSettings = () => {
    document.getElementById(settingsButtonId)?.click();
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
        key: "k",
        modifier: "ctrl",
        action: (e) => {
          e.preventDefault();
          setOpen((open) => !open);
        },
      },
      {
        key: "/",
        action: (e) => {
          e.preventDefault();
          setOpen((open) => !open);
        },
      },
      {
        key: "x",
        modifier: "ctrl",
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
      <Button
        aria-label="Open command menu"
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="mr-2"
      >
        <span className="hidden pr-2 text-sm text-muted-foreground sm:inline">
          Search commands...
        </span>
        <KeyboardShortcut shortcut="K" withModifier />
        <Search className="h-4 w-4 sm:hidden" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={closeAfterDecorator(toggleTheme)}>
              {themeIcon}
              <span>{`Toggle theme`}</span>
              <CommandShortcut className="hidden sm:block">⌘+X</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={closeAfterDecorator(openSettings)}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut className="hidden sm:block">⌘+S</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => push("/")}>
              <Layers3 className="mr-2 h-4 w-4" />
              <span>Cards</span>
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
