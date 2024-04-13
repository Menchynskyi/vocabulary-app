import { Command } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { CardCommandsConfig } from "@/types";
import { useMediaQuery } from "@/utils/useMediaQuery";

type CommandDropdownProps = {
  isPrimary?: boolean;
  cardCommands: CardCommandsConfig;
};

export function CommandDropdown({
  isPrimary,
  cardCommands,
}: CommandDropdownProps) {
  const { isMobile } = useMediaQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={
                isPrimary ? "text-primary-foreground" : "text-foreground"
              }
            >
              <Command className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Commands</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
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
            <>
              <DropdownMenuGroup key={groupIndex}>
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
            </>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
