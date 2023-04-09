import styles from "./page.module.css";
import { WordsList } from "./WordsList";
import { getWords } from "./utils";

export const revalidate = 10;

export default async function Home() {
  const setOfWords = await getWords();

  return (
    <main className={styles.main}>
      <WordsList words={setOfWords} />
    </main>
  );
}
