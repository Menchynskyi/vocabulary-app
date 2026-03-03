"use client";

import { useRouter } from "next/navigation";
import { RetryCountdownMessage } from "./RetryCountdownMessage";

type RetryRoundCountdownProps = {
  retryAfterSeconds: number;
};

export function RetryRoundCountdown({
  retryAfterSeconds,
}: RetryRoundCountdownProps) {
  const { refresh } = useRouter();

  return (
    <RetryCountdownMessage
      retryAfterSeconds={retryAfterSeconds}
      title="Context game is temporarily unavailable"
      description="Gemini quota is temporarily exceeded. Please try again later."
      retryLabel="Retry"
      onRetry={refresh}
    />
  );
}
