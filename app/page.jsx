import styles from "./page.module.css";
import { WordsList } from "./WordsList";
import { uri } from "./utils";

async function getWords(mode) {
  return await (
    await fetch(`${uri}/api/words?mode=${mode}`, { cache: "no-store" })
  ).json();
}

export default async function Home({ searchParams }) {
  const setOfWords = await getWords(searchParams?.mode);

  return (
    <main className={styles.main}>
      <WordsList
        words={setOfWords}
        noWeekWords={
          searchParams?.mode === "week"
            ? "No words were added last week. Remove this mode please."
            : undefined
        }
      />
    </main>
  );
}
