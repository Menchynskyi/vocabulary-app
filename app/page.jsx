import styles from "./page.module.css";
import { WordsList } from "./WordsList";
import { uri } from "./utils";

async function getRandomWords() {
  return await (
    await fetch(`${uri}/api/randomWords`, { cache: "no-store" })
  ).json();
}

export default async function Home() {
  const randomWords = await getRandomWords();

  return (
    <main className={styles.main}>
      <WordsList words={randomWords} />
    </main>
  );
}
