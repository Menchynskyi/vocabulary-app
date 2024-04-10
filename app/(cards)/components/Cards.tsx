import { WordsList } from "./WordsList";
import { uri } from "@/constants";
import { DateRangeMode } from "@/types";

async function getWords(mode: DateRangeMode) {
  try {
    const response = await fetch(`${uri}/api/words?mode=${mode}`, {
      cache: "no-store",
    });
    const { data } = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

type CardsProps = {
  dateRangeMode: DateRangeMode;
};

export async function Cards({ dateRangeMode }: CardsProps) {
  const setOfWords = await getWords(dateRangeMode);

  return (
    <WordsList
      words={setOfWords}
      noWeekWords={
        dateRangeMode === DateRangeMode.week && !setOfWords.length
          ? "No words were added last week"
          : undefined
      }
    />
  );
}
