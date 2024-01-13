import styles from "./styles/page.module.css";
import { WordsList } from "./components/WordsList";
import { uri } from "@/constants";
import { VocabularyMode } from "@/types";

async function getWords(mode: VocabularyMode) {
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

type HomeProps = {
  searchParams: {
    mode: VocabularyMode;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const setOfWords = await getWords(searchParams?.mode);

  return (
    <main className={styles.main}>
      <WordsList
        words={setOfWords}
        noWeekWords={
          searchParams?.mode === VocabularyMode.week && !setOfWords.length
            ? "No words were added last week. Remove this mode please."
            : undefined
        }
      />
    </main>
  );
}
