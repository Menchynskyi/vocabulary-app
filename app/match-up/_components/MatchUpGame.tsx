"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { WordObject } from "@/types";
import { cn } from "@/utils/tailwind";
import { Heart } from "lucide-react";
import { MatchUpBlock } from "./MatchUpBlock";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useRouter } from "next/navigation";

type MatchUpGameProps = {
  words: WordObject[];
  initialLives: number;
};

type Feedback =
  | { type: "correct"; wordId: number }
  | { type: "wrong"; draggedId: string }
  | null;

function getWordIdFromBlockId(blockId: string): number {
  const n = blockId.includes("word-")
    ? blockId.replace("word-", "")
    : blockId.replace("translation-", "");
  return Number(n);
}

export function MatchUpGame({ words, initialLives }: MatchUpGameProps) {
  const router = useRouter();
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [lives, setLives] = useState(initialLives);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [activeDrag, setActiveDrag] = useState<{
    id: string;
    text: string;
    variant: "word" | "translation";
  } | null>(null);

  type BlockItem = { id: string; text: string; variant: "word" | "translation"; wordId: number };
  const allBlocksShuffled = useMemo(() => {
    const blocks: BlockItem[] = [];
    words.forEach((w) => {
      blocks.push({
        id: `word-${w.id}`,
        text: w.word,
        variant: "word",
        wordId: w.id,
      });
      blocks.push({
        id: `translation-${w.id}`,
        text: w.translation || w.meaning || w.example,
        variant: "translation",
        wordId: w.id,
      });
    });
    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }
    return blocks;
  }, [words]);
  const blocks = allBlocksShuffled.filter((b) => !matchedIds.has(b.wordId));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id);
      const wordId = getWordIdFromBlockId(id);
      const word = words.find((w) => w.id === wordId);
      if (!word) return;
      const isWord = id.startsWith("word-");
      setActiveDrag({
        id,
        text: isWord ? word.word : word.translation || word.meaning || word.example,
        variant: isWord ? "word" : "translation",
      });
    },
    [words],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDrag(null);
      const { active, over } = event;
      if (status !== "playing" || !over || active.id === over.id) {
        return;
      }

      const draggedId = String(active.id);
      const overId = String(over.id);
      const draggedIsWord = draggedId.startsWith("word-");
      const overIsWord = overId.startsWith("word-");
      if (draggedIsWord === overIsWord) {
        return;
      }

      const draggedWordId = getWordIdFromBlockId(draggedId);
      const overWordId = getWordIdFromBlockId(overId);

      if (draggedWordId === overWordId) {
        setFeedback({ type: "correct", wordId: draggedWordId });
        setTimeout(() => {
          setMatchedIds((prev) => new Set(prev).add(draggedWordId));
          setFeedback(null);
        }, 500);
      } else {
        setFeedback({ type: "wrong", draggedId });
        setTimeout(() => {
          setFeedback(null);
          setLives((l) => {
            const next = l - 1;
            if (next <= 0) setStatus("lost");
            return next;
          });
        }, 500);
      }
    },
    [status, words.length, matchedIds],
  );

  useEffect(() => {
    if (
      status === "playing" &&
      words.length > 0 &&
      matchedIds.size === words.length
    ) {
      setStatus("won");
    }
  }, [matchedIds.size, words.length, status]);

  const startOver = useCallback(() => {
    setMatchedIds(new Set());
    setLives(initialLives);
    setStatus("playing");
    setFeedback(null);
  }, [initialLives]);

  const newSetOfWords = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    setMatchedIds(new Set());
    setLives(initialLives);
    setStatus("playing");
    setFeedback(null);
  }, [words, initialLives]);

  if (words.length === 0) {
    return (
      <div className="mt-16 flex flex-col sm:mt-36">
        <span className="mb-4 text-lg sm:text-2xl">No words to match</span>
        <Button variant="secondary" onClick={() => router.refresh()}>
          New set of words
        </Button>
      </div>
    );
  }

  if (status === "won" || status === "lost") {
    return (
      <div className="flex flex-col">
        <p className="mb-4 text-lg">
          {status === "won"
            ? "You matched all pairs!"
            : "Out of lives. Better luck next time!"}
        </p>
        <ScrollArea className="h-[340px] min-w-[90vw] max-w-[90vw] rounded-md border sm:h-[450px] sm:min-w-[450px] sm:max-w-[500px]">
          {words.map(({ id, word, translation, meaning, example }) => (
            <div
              key={id}
              className="p-4 text-lg [&:not(:last-of-type)]:border-b"
            >
              <div>
                <span>{word}</span>
              </div>
              <div>
                <span>{translation || meaning || example}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-10 flex flex-col justify-between gap-2 sm:mt-4 sm:flex-row">
          <Button
            aria-label="Start over"
            variant="outline"
            className="w-full"
            onClick={startOver}
          >
            <span>Start over</span>
          </Button>
          <Button
            aria-label="New set of words"
            className="w-full"
            onClick={newSetOfWords}
          >
            <span>New set of words</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-6 px-4 pb-10">
      <p className="flex items-center gap-2 text-muted-foreground">
      <span>Matched: {matchedIds.size} / {words.length}</span>
        {initialLives > 1 && <span>· </span>}
        {initialLives > 1 && (
          <span className="flex items-center gap-0.5" aria-label={`${lives} lives left`}>
            {Array.from({ length: initialLives }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < lives ? "fill-red-500 text-red-500" : "fill-none text-muted-foreground/40",
                )}
                aria-hidden
              />
            ))}
          </span>
        )}
      </p>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveDrag(null)}
        sensors={sensors}
      >
        <div className="flex flex-wrap gap-3">
          {blocks.map((b) => (
            <MatchUpBlock
              key={b.id}
              id={b.id}
              text={b.text}
              variant={b.variant}
              activeDragVariant={activeDrag?.variant ?? null}
              isCorrect={
                feedback?.type === "correct" && feedback.wordId === b.wordId
              }
              isWrong={
                feedback?.type === "wrong" && feedback.draggedId === b.id
              }
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeDrag ? (
            <div
              className={cn(
                "cursor-grabbing rounded-lg border px-4 py-3 text-center shadow-lg",
                "touch-none select-none",
                activeDrag.variant === "word" &&
                  "border-primary/50 bg-card",
                activeDrag.variant === "translation" &&
                  "border-muted-foreground/30 bg-muted",
              )}
            >
              <span className="text-sm font-medium sm:text-base">
                {activeDrag.text}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
