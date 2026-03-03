import { VocabularyMode } from "@/types";
import { CardsList } from "./_components/CardsList";
import { getWords } from "@/server/notion/queries";
import { VocabularyModeStatus } from "@/components/VocabularyModeStatus";
import { cookies } from "next/headers";
import {
  getDefaultCookieLikeSettings,
  getEffectiveUserSettings,
} from "@/server/db/queries";

type CardsProps = {
  searchParams: {
    mode?: VocabularyMode;
  };
};

export default async function Cards({ searchParams }: CardsProps) {
  const cookieStore = await cookies();
  const fallbackSettings = await getDefaultCookieLikeSettings(cookieStore);
  const settings = await getEffectiveUserSettings(fallbackSettings);

  const mode = searchParams?.mode ?? VocabularyMode.latest;
  const cardsLengthByMode = {
    [VocabularyMode.latest]: settings.cards.cardsListLatestLength,
    [VocabularyMode.random]: settings.cards.cardsListRandomLength,
    [VocabularyMode.week]: settings.cards.cardsListWeekModeLength,
  };

  const cards = await getWords(mode, cardsLengthByMode[mode]);

  return (
    <>
      <CardsList cards={cards} vocabularyMode={searchParams?.mode} />
      <VocabularyModeStatus vocabularyMode={searchParams?.mode} />
    </>
  );
}
