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

export function CommandDropdown({ isPrimary }: { isPrimary?: boolean }) {
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
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
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
        className="w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Flip card
            <DropdownMenuShortcut>Space</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Next card
            <DropdownMenuShortcut>→</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Previous card
            <DropdownMenuShortcut>←</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Pronounce
            <DropdownMenuShortcut>⌘+P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            Edit
            <DropdownMenuShortcut>⌘+E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Copy
            <DropdownMenuShortcut>⌘+C</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>Open in Notion</DropdownMenuItem>
          <DropdownMenuItem>Open in Reverso Context</DropdownMenuItem>
          <DropdownMenuItem>Open in Cambridge Dictionary</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
