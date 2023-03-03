import { use } from "react";

import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { getRandomSetOfWords } from "./utils";
import { WordsList } from "./WordsList";

const inter = Inter({ subsets: ["latin"] });

export const revalidate = 36000;

export default function Home() {
  const setOfWords = use(getRandomSetOfWords());

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1 className={inter.className}>Vocabulary</h1>
      </div>
      <WordsList words={setOfWords} />
    </main>
  );
}
