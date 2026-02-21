"use client";

import {
  AudioLines,
  AudioWaveform,
  BarChart3,
  Calendar,
  Laptop,
  Layers3,
  Moon,
  SettingsIcon,
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
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { CommandMenuTrigger } from "@/components/CommandMenuButton";
import { SignedIn } from "@clerk/nextjs";
import { VocabularyMode } from "@/types";
import { getNextVocabularyMode } from "@/utils/getNextVocabularyMode";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const searchParams = useSearchParams();
  const { push, replace } = useRouter();
  const pathname = usePathname();

  const [isToggleModePending, startTransition] = useTransition();
  const pendingToggleModeResolveRef = useRef<(() => void) | null>(null);

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

  const toggleVocabularyMode = () => {
    const params = new URLSearchParams(searchParams);
    const currentMode = params.get("mode") as VocabularyMode;
    const newMode = getNextVocabularyMode(currentMode);

    const promise = new Promise<string>((resolve) => {
      pendingToggleModeResolveRef.current = () => resolve(newMode);
    });

    toast.promise(promise, {
      loading: "Toggling vocabulary mode...",
      success: (mode) => `Toggled to ${mode} mode`,
      error: "Failed to toggle mode",
    });

    startTransition(() => {
      replace(`${pathname}?mode=${newMode}`);
    });
  };

  useEffect(() => {
    if (!isToggleModePending && pendingToggleModeResolveRef.current) {
      pendingToggleModeResolveRef.current();
      pendingToggleModeResolveRef.current = null;
    }
  }, [isToggleModePending]);

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
        scope: "matchup",
        shortcut: "toggleVocabularyMode",
        action: (e) => {
          if (isToggleModePending) return;

          e.preventDefault();
          toggleVocabularyMode();
          setOpen(false);
        },
      },
    ],
    deps: [searchParams, toggleTheme, isToggleModePending],
  });

  return (
    <>
      <CommandMenuTrigger onOpen={() => setOpen(true)} />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={closeAfterDecorator(toggleVocabularyMode)}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Toggle vocabulary mode</span>
              <CommandShortcut className="hidden sm:block">
                {getShortcutDisplayName("matchup", "toggleVocabularyMode")}
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
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => push("/")}>
              <Layers3 className="mr-2 h-4 w-4" />
              <span>Cards</span>
            </CommandItem>
            <CommandItem onSelect={() => push("/blanks")}>
              <Wand className="mr-2 h-4 w-4" />
              <span>Blanks</span>
            </CommandItem>
            <SignedIn>
              <CommandItem onSelect={() => push("/stats")}>
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Stats</span>
              </CommandItem>
            </SignedIn>
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
