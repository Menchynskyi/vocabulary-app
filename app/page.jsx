import styles from "./page.module.css";
import { WordsList } from "./WordsList";
import { uri } from "./utils";

async function getAllWords() {
  return await (
    await fetch(`${uri}/api/words`, { next: { revalidate: 432000 } })
  ).json();
}

export default async function Home() {
  const allWords = await getAllWords();

  return (
    <main className={styles.main}>
      <WordsList allWords={allWords} />
    </main>
  );
}
