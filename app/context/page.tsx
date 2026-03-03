import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { VocabularyMode, WordObject } from "@/types";
import { Button } from "@/components/ui/Button";
import { VocabularyModeStatus } from "@/components/VocabularyModeStatus";
import { getWords } from "@/server/notion/queries";
import { generateContextRound } from "@/server/ai/queries";
import { getAuthorizedUserSettings } from "@/server/db/queries";
import { defaultContextWordsCount } from "@/constants/context";
import { ContextGame } from "./_components/ContextGame";
import { getAiRetryAfterSeconds } from "@/utils/aiErrors";
import { RetryRoundCountdown } from "./_components/RetryRoundCountdown";
import { getCurrentUserCanUseAI } from "@/server/auth/queries";

type ContextPageProps = {
  searchParams: {
    mode?: VocabularyMode;
  };
};

const toHint = (
  word: Partial<Pick<WordObject, "translation" | "meaning" | "example">>,
) => {
  if (word.translation) {
    return `Translation: ${word.translation}`;
  }
  if (word.meaning) {
    return `Meaning: ${word.meaning}`;
  }
  if (word.example) {
    return `Example: ${word.example}`;
  }

  return "";
};

export default async function ContextPage({ searchParams }: ContextPageProps) {
  const user = auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }
  const canUseAI = await getCurrentUserCanUseAI();
  if (!canUseAI) {
    return (
      <div className="mx-4 mt-6 w-full max-w-2xl rounded-md border bg-background p-4 sm:mt-8 sm:p-6">
        <p className="text-lg font-semibold">AI access is not enabled</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account does not have permission to use this game. Ask an admin
          to enable it.
        </p>
      </div>
    );
  }

  const mode = searchParams?.mode ?? VocabularyMode.latest;
  const settings = await getAuthorizedUserSettings();
  const wordsCount =
    settings.context?.contextWordsCount ?? defaultContextWordsCount;
  const words = await getWords(mode, wordsCount);

  if (!words.length) {
    return (
      <div className="mt-16 flex flex-col sm:mt-36">
        <span className="mb-4 text-lg sm:text-2xl">No words found</span>
        <Button asChild variant="secondary">
          <Link href="/context?mode=random">Random mode</Link>
        </Button>
      </div>
    );
  }

  let generated: Awaited<ReturnType<typeof generateContextRound>> | null = null;
  let generationRetryAfterSeconds: number | null = null;
  try {
    generated = await generateContextRound({
      words,
      mode,
    });
  } catch (error) {
    generationRetryAfterSeconds = getAiRetryAfterSeconds(error);
    if (!generationRetryAfterSeconds) {
      throw error;
    }
  }

  if (!generated && generationRetryAfterSeconds) {
    return (
      <div className="mx-4 mt-6 w-full max-w-4xl sm:mt-8">
        <RetryRoundCountdown retryAfterSeconds={generationRetryAfterSeconds} />
      </div>
    );
  }

  const wordById = new Map(words.map((word) => [word.id, word]));
  const rounds = generated!.rounds.map((round) => ({
    ...round,
    hint: toHint(wordById.get(round.wordId) ?? {}),
  }));

  return (
    <>
      <ContextGame rounds={rounds} />
      <VocabularyModeStatus vocabularyMode={mode} />
    </>
  );
}
