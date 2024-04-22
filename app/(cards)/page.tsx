import { cookies } from "next/headers";
import { VocabularyMode } from "@/types";
import { uri } from "@/constants";
import { CardsList } from "./_components/CardsList";

async function getCards(mode?: VocabularyMode) {
  try {
    const response = await fetch(`${uri}/api/cards?mode=${mode}`, {
      cache: "no-store",
      headers: {
        Cookie: cookies().toString(),
      },
    });
    const { data } = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

type CardsProps = {
  searchParams: {
    mode?: VocabularyMode;
  };
};

export default async function Cards({ searchParams }: CardsProps) {
  const cards = await getCards(searchParams?.mode);

  return <CardsList cards={cards} vocabularyMode={searchParams?.mode} />;
}
