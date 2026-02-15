import { VocabularyMode } from "@/types";
import { getWords } from "@/server/notion/queries";
import { cookies } from "next/headers";
import {
  defaultMatchUpLives,
  defaultMatchUpWordsCount,
  matchUpLivesCookie,
  matchUpLivesMax,
  matchUpLivesMin,
  matchUpWordsCountCookie,
  matchUpWordsCountMax,
  matchUpWordsCountMin,
} from "@/constants/match-up";
import { MatchUpGame } from "./_components/MatchUpGame";

type MatchUpPageProps = {
  searchParams: {
    mode?: VocabularyMode;
  };
};

export default async function MatchUpPage({ searchParams }: MatchUpPageProps) {
  const cookieStore = cookies();
  const livesValue = Number(cookieStore.get(matchUpLivesCookie)?.value);
  const lives = Number.isNaN(livesValue)
    ? defaultMatchUpLives
    : Math.min(matchUpLivesMax, Math.max(matchUpLivesMin, livesValue));

  const wordsCountValue = Number(
    cookieStore.get(matchUpWordsCountCookie)?.value,
  );
  const wordsCount = Number.isNaN(wordsCountValue)
    ? defaultMatchUpWordsCount
    : Math.min(
        matchUpWordsCountMax,
        Math.max(matchUpWordsCountMin, wordsCountValue),
      );

  const words = await getWords(searchParams?.mode, wordsCount);

  return <MatchUpGame words={words} initialLives={lives} />;
}
