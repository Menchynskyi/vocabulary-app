import styles from "./page.module.css";
import { WordsList } from "./WordsList";
import { generateRandomWords, uri } from "./utils";

async function getWords() {
  return await (
    await fetch(`${uri}/api/words`, { next: { revalidate: 72000 } })
  ).json();
}

export const revalidate = 0;

export default async function Home() {
  const allWords = await getWords();
  const randomWords = generateRandomWords(allWords);

  return (
    <main className={styles.main}>
      <WordsList words={randomWords} />
    </main>
  );
}
