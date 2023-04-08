import styles from "./page.module.css";
import { WordsList } from "./WordsList";
import { uri } from "./utils";

async function getWords() {
  return await (
    await fetch(`${uri}/api/words`, { next: { revalidate: 36000 } })
  ).json();
}

export default async function Home() {
  const setOfWords = await getWords();

  return (
    <main className={styles.main}>
      <WordsList words={setOfWords} />
    </main>
  );
}
