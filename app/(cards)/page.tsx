import { VocabularyMode } from "@/types";
import { CardsList } from "./_components/CardsList";
import { getWords } from "@/server/notion/queries";

type CardsProps = {
  searchParams: {
    mode?: VocabularyMode;
  };
};

export default async function Cards({ searchParams }: CardsProps) {
  const cards = await getWords(searchParams?.mode);

  return <CardsList cards={cards} vocabularyMode={searchParams?.mode} />;
}
