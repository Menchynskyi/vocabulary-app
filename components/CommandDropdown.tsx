import { Command } from "lucide-react";
import { Button } from "./ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "./ui/DropdownMenu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import { CardCommandsConfig } from "@/types";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { Fragment, useState } from "react";
import { useKeyboardShortcuts } from "@/utils/useKeyboardShortcuts";

type CommandDropdownProps = {
  isPrimary?: boolean;
  cardCommands: CardCommandsConfig;
};

export function CommandDropdown({
  isPrimary,
  cardCommands,
}: CommandDropdownProps) {
  const { isMobile } = useMediaQuery();
  const [open, setOpen] = useState(false);

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: " ",
        action: () => {
          setOpen(false);
        },
      },
    ],
  });

  return (
    <DropdownMenu
      open={open}
      onOpenChange={() => {
        setOpen((prev) => !prev);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
              aria-label="Commands"
              size="icon"
              variant="ghost"
              className={
                isPrimary ? "text-primary-foreground" : "text-foreground"
              }
            >
              <Command className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Commands</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="end"
        side={isMobile ? "right" : "left"}
        sideOffset={isMobile ? 0 : 14}
        alignOffset={isMobile ? 20 : -5}
        className="w-64"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {cardCommands.map((group, groupIndex) => {
          if (isMobile && groupIndex === 0) {
            return null;
          }

          return (
            <Fragment key={groupIndex}>
              <DropdownMenuGroup>
                {group.map((command, commandIndex) => (
                  <DropdownMenuItem
                    key={commandIndex}
                    onSelect={command.onSelect}
                    disabled={command.disabled}
                  >
                    {command.label}
                    {command.shortcut && (
                      <DropdownMenuShortcut className="hidden sm:block">
                        {command.shortcut}
                      </DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {groupIndex < cardCommands.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
