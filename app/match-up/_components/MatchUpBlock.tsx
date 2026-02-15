"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@/utils/tailwind";

type MatchUpBlockProps = {
  id: string;
  text: string;
  variant: "word" | "translation";
  activeDragVariant?: "word" | "translation" | null;
  isCorrect?: boolean;
  isWrong?: boolean;
};

export function MatchUpBlock({
  id,
  text,
  variant,
  activeDragVariant = null,
  isCorrect,
  isWrong,
}: MatchUpBlockProps) {
  const isValidDropTarget =
    activeDragVariant != null && activeDragVariant !== variant;
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id,
  });

  const setRef = (node: HTMLDivElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  return (
    <div
      ref={setRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab rounded-lg border px-4 py-3 text-center transition-colors active:cursor-grabbing",
        "touch-none select-none",
        variant === "word" && "border-primary/50 bg-card",
        variant === "translation" && "border-muted-foreground/30 bg-muted/50",
        isOver && isValidDropTarget && "ring-2 ring-primary",
        isDragging && "opacity-50",
        isCorrect && "border-green-500 bg-green-500/20",
        isWrong && "animate-shake border-red-500 bg-red-500/20",
      )}
    >
      <span className="text-sm font-medium sm:text-base">{text}</span>
    </div>
  );
}
