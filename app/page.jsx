import styles from "./page.module.css";
import { WordsList } from "./WordsList";
import { getWordsFromFile } from "./utils";

export default function Home() {
  const setOfWords = getWordsFromFile();

  return (
    <main className={styles.main}>
      <WordsList words={setOfWords} />
    </main>
  );
}
