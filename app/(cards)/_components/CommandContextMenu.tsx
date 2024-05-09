import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/ContextMenu";
import { CardCommandsConfig } from "@/types";
import { Fragment } from "react";

type CommandContextMenuProps = {
  children: React.ReactNode;
  cardCommands: CardCommandsConfig;
};

export function CommandContextMenu({
  children,
  cardCommands,
}: CommandContextMenuProps) {
  return (
    <ContextMenu modal>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className="w-64 max-sm:hidden"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {cardCommands.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            <ContextMenuGroup>
              {group.map((command, commandIndex) => (
                <ContextMenuItem
                  key={commandIndex}
                  onSelect={command.onSelect}
                  disabled={command.disabled}
                >
                  {command.label}
                  {command.shortcut && (
                    <ContextMenuShortcut>
                      {command.shortcut}
                    </ContextMenuShortcut>
                  )}
                </ContextMenuItem>
              ))}
            </ContextMenuGroup>
            {groupIndex < cardCommands.length - 1 && <ContextMenuSeparator />}
          </Fragment>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
