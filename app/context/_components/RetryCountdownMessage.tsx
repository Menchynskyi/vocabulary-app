"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

type RetryCountdownMessageProps = {
  retryAfterSeconds: number;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export function RetryCountdownMessage({
  retryAfterSeconds,
  title = "AI rate limit reached",
  description = "Too many requests were sent. Please retry when the timer reaches zero.",
  onRetry,
  retryLabel = "Retry",
  className,
}: RetryCountdownMessageProps) {
  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(0, retryAfterSeconds),
  );

  useEffect(() => {
    setSecondsLeft(Math.max(0, retryAfterSeconds));
  }, [retryAfterSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const countdownLabel = useMemo(() => {
    if (secondsLeft <= 0) {
      return "You can retry now.";
    }

    return `Retry available in ${secondsLeft}s`;
  }, [secondsLeft]);

  return (
    <div className={className}>
      <div className="rounded-md border border-amber-300/60 bg-amber-50/40 p-4 dark:border-amber-700/60 dark:bg-amber-950/20">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-sm">{countdownLabel}</p>
        {onRetry && (
          <div className="mt-3">
            <Button
              onClick={onRetry}
              disabled={secondsLeft > 0}
              variant="outline"
              aria-label={retryLabel}
            >
              {retryLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
