import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function CommandContextMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuGroup>
          <ContextMenuItem>
            Flip card
            <ContextMenuShortcut>Space</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Next card
            <ContextMenuShortcut>→</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Previous card
            <ContextMenuShortcut>←</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Pronounce
            <ContextMenuShortcut>⌘+P</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>

        <ContextMenuSeparator />

        <ContextMenuGroup>
          <ContextMenuItem>
            Edit
            <ContextMenuShortcut>⌘+E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>⌘+C</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>

        <ContextMenuSeparator />

        <ContextMenuGroup>
          <ContextMenuItem>Open in Notion</ContextMenuItem>
          <ContextMenuItem>Open in Reverso Context</ContextMenuItem>
          <ContextMenuItem>Open in Cambridge Dictionary</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
