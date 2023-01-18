import { Inter } from "@next/font/google";
import { Suspense } from "react";
import styles from "./page.module.css";
import { getRandomSetOfWords } from "./utils";

const inter = Inter({ subsets: ["latin"] });

async function WordsList({ words }) {
  const wordsList = await words;
  return (
    <div className={inter.className}>
      {wordsList.map((element) => (
        <div key={element.id} className={styles.wordBlock}>
          <div>
            <span>{element.word}</span>
          </div>
          <div>
            <span>{element.translation}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  const setOfWords = getRandomSetOfWords();

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1 className={inter.className}>Vocabulary</h1>
      </div>
      <Suspense
        fallback={
          <div className={inter.className}>
            <span>Generating your daily set of words...</span>
          </div>
        }
      >
        <WordsList words={setOfWords} />
      </Suspense>
    </main>
  );
}
