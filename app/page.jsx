import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { WordsList } from "./WordsList";
import { uri } from "./utils";

const inter = Inter({ subsets: ["latin"] });

async function getWords() {
  return await (await fetch(`${uri}/api/words`, { cache: "no-store" })).json();
}

export default async function Home() {
  const setOfWords = await getWords();

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1 className={inter.className}>Vocabulary</h1>
      </div>
      <WordsList words={setOfWords} />
    </main>
  );
}
