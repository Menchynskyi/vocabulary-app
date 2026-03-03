"use client";

import {
  AudioLines,
  AudioWaveform,
  Laptop,
  Moon,
  SettingsIcon,
  Sun,
  Triangle,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { NotionIcon } from "@/components/icons/NotionIcon";
import { settingsButtonId } from "@/constants";
import {
  type ShortcutsScope,
  type ScopeShortcuts,
  getShortcutDisplayName,
  useKeyboardShortcuts,
} from "@/utils/keyboardShortcuts";
import { CommandMenuTrigger } from "@/components/CommandMenuButton";
import { SignedIn } from "@clerk/nextjs";
import { navLinks } from "@/constants/navigation";
import { useRandomVoice } from "@/hooks/useRandomVoice";

type ShortcutRef = {
  [S in ShortcutsScope]: { scope: S; shortcut: ScopeShortcuts<S> };
}[ShortcutsScope];

function getShortcutLabel(ref: ShortcutRef) {
  return getShortcutDisplayName(
    ref.scope as "global",
    ref.shortcut as ScopeShortcuts<"global">,
  );
}

export type PageCommand = {
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
  shortcut?: ShortcutRef;
};

type CommandMenuProps = {
  pageCommands?: PageCommand[];
  showVoice?: boolean;
  showSettings?: boolean;
};

export function CommandMenu({
  pageCommands,
  showVoice,
  showSettings,
}: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { push } = useRouter();
  const { setRandomVoice } = useRandomVoice();

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

  const openSettings = () => {
    document.getElementById(settingsButtonId)?.click();
  };

  const filteredNavLinks = navLinks.filter((link) => {
    const isActive = link.isActive
      ? link.isActive(pathname)
      : pathname.startsWith(link.path);
    return !isActive;
  });

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key !== "Meta" && e.key !== "Control") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

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
            {pageCommands?.map((cmd) => (
              <CommandItem
                key={cmd.label}
                onSelect={closeAfterDecorator(cmd.onSelect)}
              >
                {cmd.icon}
                <span>{cmd.label}</span>
                {cmd.shortcut && (
                  <CommandShortcut className="hidden sm:block">
                    {getShortcutLabel(cmd.shortcut)}
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
            <CommandItem onSelect={closeAfterDecorator(toggleTheme)}>
              {themeIcon}
              <span>{`Toggle theme`}</span>
              <CommandShortcut className="hidden sm:block">
                {getShortcutDisplayName("global", "toggleTheme")}
              </CommandShortcut>
            </CommandItem>
            {showSettings && (
              <CommandItem onSelect={closeAfterDecorator(openSettings)}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut className="hidden sm:block">
                  {getShortcutDisplayName("global", "toggleSettings")}
                </CommandShortcut>
              </CommandItem>
            )}
          </CommandGroup>

          {showVoice && (
            <>
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
            </>
          )}

          <CommandSeparator />
          <CommandGroup heading="Links">
            {filteredNavLinks.map((link) => {
              const item = (
                <CommandItem key={link.path} onSelect={() => push(link.path)}>
                  <link.icon className="mr-2 h-4 w-4" />
                  <span>{link.label}</span>
                </CommandItem>
              );
              return link.authGated ? (
                <SignedIn key={link.path}>{item}</SignedIn>
              ) : (
                item
              );
            })}
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
