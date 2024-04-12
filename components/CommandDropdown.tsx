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

export function CommandDropdown({
  isPrimary,
  cardCommands,
}: {
  isPrimary?: boolean;
  cardCommands: CardCommandsConfig;
}) {
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
        side="left"
        align="end"
        sideOffset={14}
        alignOffset={-5}
        className="w-64"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {cardCommands.map((group, groupIndex) => (
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
                    <DropdownMenuShortcut>
                      {command.shortcut}
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {groupIndex < cardCommands.length - 1 && <DropdownMenuSeparator />}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
