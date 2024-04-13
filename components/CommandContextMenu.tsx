import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { CardCommandsConfig } from "@/types";

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
          <>
            <ContextMenuGroup key={groupIndex}>
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
          </>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
