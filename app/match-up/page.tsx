import { VocabularyMode } from "@/types";
import { getWords } from "@/server/notion/queries";
import { cookies } from "next/headers";
import { MatchUpGame } from "./_components/MatchUpGame";
import { VocabularyModeStatus } from "@/components/VocabularyModeStatus";
import {
  getDefaultCookieLikeSettings,
  getEffectiveUserSettings,
} from "@/server/db/queries";

type MatchUpPageProps = {
  searchParams: {
    mode?: VocabularyMode;
  };
};

export default async function MatchUpPage({ searchParams }: MatchUpPageProps) {
  const cookieStore = await cookies();
  const fallbackSettings = await getDefaultCookieLikeSettings(cookieStore);
  const settings = await getEffectiveUserSettings(fallbackSettings);
  const lives = settings["match-up"].matchUpLives;
  const wordsCount = settings["match-up"].matchUpWordsCount;

  const words = await getWords(searchParams?.mode, wordsCount);

  return (
    <>
      <MatchUpGame words={words} initialLives={lives} />
      <VocabularyModeStatus vocabularyMode={searchParams?.mode} />
    </>
  );
}
