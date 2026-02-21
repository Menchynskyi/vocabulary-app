import { VocabularyMode } from "@/types";
import { CardsList } from "./_components/CardsList";
import { getWords } from "@/server/notion/queries";
import { VocabularyModeStatus } from "@/components/VocabularyModeStatus";

type CardsProps = {
  searchParams: {
    mode?: VocabularyMode;
  };
};

export default async function Cards({ searchParams }: CardsProps) {
  const cards = await getWords(searchParams?.mode);

  return (
    <>
      <CardsList cards={cards} vocabularyMode={searchParams?.mode} />
      <VocabularyModeStatus vocabularyMode={searchParams?.mode} />
    </>
  );
}
