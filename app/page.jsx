import styles from "./styles/page.module.css";
import { WordsList } from "./components/WordsList";
import { uri } from "@/constants";

async function getWords(mode) {
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

export default async function Home({ searchParams }) {
  const setOfWords = await getWords(searchParams?.mode);

  return (
    <main className={styles.main}>
      <WordsList
        words={setOfWords}
        noWeekWords={
          searchParams?.mode === "week" && !setOfWords.length
            ? "No words were added last week. Remove this mode please."
            : undefined
        }
      />
    </main>
  );
}
