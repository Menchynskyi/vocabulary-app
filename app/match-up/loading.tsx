import { cookies } from "next/headers";
import {
  defaultMatchUpWordsCount,
  matchUpWordsCountCookie,
  matchUpWordsCountMax,
  matchUpWordsCountMin,
} from "@/constants/match-up";
import { MatchUpSkeleton } from "./_components/MatchUpSkeleton";

export default function Loading() {
  const cookieStore = cookies();
  const value = Number(cookieStore.get(matchUpWordsCountCookie)?.value);
  const wordsCount = Number.isNaN(value)
    ? defaultMatchUpWordsCount
    : Math.min(matchUpWordsCountMax, Math.max(matchUpWordsCountMin, value));
  return <MatchUpSkeleton wordsCount={wordsCount} />;
}
