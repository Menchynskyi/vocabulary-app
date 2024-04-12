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

export function CommandContextMenu({
  children,
  cardCommands,
}: {
  children: React.ReactNode;
  cardCommands: CardCommandsConfig;
}) {
  return (
    <ContextMenu modal>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className="w-64"
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
