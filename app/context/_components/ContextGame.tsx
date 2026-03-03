"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import {
  ContextEvaluationPayload,
  evaluateContextAnswers,
} from "@/server/ai/queries";
import { createUserContextStats } from "@/server/db/queries";
import { cn } from "@/utils/tailwind";
import {
  getAiRetryAfterSeconds,
  isAiAccessDeniedError,
} from "@/utils/aiErrors";
import { RetryCountdownMessage } from "./RetryCountdownMessage";
import { Lightbulb } from "lucide-react";

export type ContextRoundView = {
  wordId: number;
  answer: string;
  sentence: string;
  sentenceWithBlank: string;
  hint: string;
};

type ContextGameProps = {
  rounds: ContextRoundView[];
};

const isValidAccuracyScore = (score: number) =>
  Number.isFinite(score) &&
  Number.isInteger(score) &&
  score >= 1 &&
  score <= 100;

const renderHighlightedSentence = (value: string) => {
  const parts = value.split(/(<hl>.*?<\/hl>)/g).filter(Boolean);

  return parts.map((part, index) => {
    const isHighlighted = part.startsWith("<hl>") && part.endsWith("</hl>");
    if (!isHighlighted) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    const highlighted = part.replace("<hl>", "").replace("</hl>", "");
    return (
      <span
        key={`${highlighted}-${index}`}
        className="rounded bg-primary/10 px-1"
      >
        {highlighted}
      </span>
    );
  });
};

export function ContextGame({ rounds }: ContextGameProps) {
  const { refresh } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRefreshPending, startRefreshTransition] = useTransition();
  const [answers, setAnswers] = useState<string[]>(() =>
    Array.from({ length: rounds.length }).map(() => ""),
  );
  const [revealedHints, setRevealedHints] = useState<boolean[]>(() =>
    Array.from({ length: rounds.length }).map(() => false),
  );
  const [result, setResult] = useState<ContextEvaluationPayload | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(
    null,
  );

  const isReadyToSubmit = useMemo(
    () => answers.every((answer) => answer.trim().length > 0),
    [answers],
  );

  const onChangeAnswer = (index: number, value: string) => {
    setResult(null);
    setRetryAfterSeconds(null);
    setAnswers((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  };

  const handleSubmit = () => {
    if (!isReadyToSubmit || isPending || isRefreshPending) {
      return;
    }

    startTransition(async () => {
      try {
        const evaluation = await evaluateContextAnswers({
          items: rounds.map((round, index) => ({
            answer: round.answer,
            userAnswer: answers[index].trim(),
            sentence: round.sentence,
            sentenceWithBlank: round.sentenceWithBlank,
          })),
        });
        setRetryAfterSeconds(null);
        setResult(evaluation);
        if (isValidAccuracyScore(evaluation.score)) {
          createUserContextStats(evaluation.score).catch((error) => {
            console.error(error);
          });
        }
      } catch (error) {
        console.error(error);
        if (isAiAccessDeniedError(error)) {
          toast("AI access is not enabled for your account.");
          return;
        }
        const seconds = getAiRetryAfterSeconds(error);
        if (seconds) {
          setRetryAfterSeconds(seconds);
          return;
        }
        toast("Failed to evaluate answers. Please try again.");
      }
    });
  };

  const handleRestart = () => {
    setResult(null);
    setAnswers(Array.from({ length: rounds.length }).map(() => ""));
    setRevealedHints(Array.from({ length: rounds.length }).map(() => false));
  };

  if (result) {
    return (
      <div className="mx-4 mt-6 w-full max-w-4xl rounded-md border bg-background p-4 sm:mt-8 sm:p-6">
        <p className="text-lg font-semibold">Score: {result.score}%</p>
        <p className="mt-2 text-sm text-muted-foreground">{result.summary}</p>

        <div className="mt-4 space-y-3">
          {result.items.map((item, index) => (
            <div
              key={`${item.answer}-${index}`}
              className="rounded-md border p-3"
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  item.isCorrect
                    ? "text-green-600 dark:text-green-400"
                    : "text-amber-600",
                )}
              >
                {item.isCorrect ? "Correct" : "Needs improvement"}
              </p>
              <p className="mt-2 text-sm">
                {renderHighlightedSentence(item.correctedSentenceWithHighlight)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.explanation}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:flex sm:justify-end">
          <Button
            onClick={() => {
              startRefreshTransition(() => {
                refresh();
              });
            }}
            loading={isRefreshPending}
            variant="outline"
            aria-label="Generate new context round"
            className="w-full sm:w-auto"
          >
            New round
          </Button>
          <Button
            onClick={handleRestart}
            disabled={isRefreshPending}
            variant="secondary"
            aria-label="Restart context round"
            className="w-full sm:w-auto"
          >
            Restart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-6 w-full max-w-4xl rounded-md border bg-background p-4 sm:mt-8 sm:p-6">
      <div className="space-y-4">
        {rounds.map((round, index) => (
          <div
            key={`${round.wordId}-${index}`}
            className="rounded-md border p-4"
          >
            <p className="text-base">{round.sentenceWithBlank}</p>
            <div className="mt-3">
              <Input
                value={answers[index]}
                onChange={(event) => onChangeAnswer(index, event.target.value)}
                placeholder="Type missing word or expression"
                aria-label={`Answer ${index + 1}`}
              />
            </div>
            {!!round.hint && !revealedHints[index] && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 h-8 rounded-full border-dashed px-3 text-xs text-muted-foreground hover:text-foreground"
                aria-label={`Show hint for sentence ${index + 1}`}
                onClick={() =>
                  setRevealedHints((prev) =>
                    prev.map((isRevealed, itemIndex) =>
                      itemIndex === index ? true : isRevealed,
                    ),
                  )
                }
              >
                <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
                Show hint
              </Button>
            )}
            {!!round.hint && revealedHints[index] && (
              <p className="mt-2 rounded-md bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                {round.hint}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:flex sm:justify-end">
        <Button
          onClick={() => {
            startRefreshTransition(() => {
              refresh();
            });
          }}
          loading={isRefreshPending}
          disabled={isPending}
          variant="outline"
          aria-label="Generate new context round"
          className="w-full sm:w-auto"
        >
          New round
        </Button>
        <Button
          onClick={handleSubmit}
          loading={isPending}
          disabled={!isReadyToSubmit || isRefreshPending || !!retryAfterSeconds}
          aria-label="Submit context answers"
          className="w-full sm:w-auto"
        >
          Submit answers
        </Button>
      </div>

      {retryAfterSeconds && (
        <RetryCountdownMessage
          className="mt-4"
          retryAfterSeconds={retryAfterSeconds}
          title="Evaluation is temporarily unavailable"
          description="Gemini quota is temporarily exceeded. You can submit again when the countdown finishes."
        />
      )}
    </div>
  );
}
