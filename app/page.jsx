import { use } from "react";

import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { WordsList } from "./WordsList";

const inter = Inter({ subsets: ["latin"] });

const uri = `${
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${process.env.VERCEL_URL}`
}`;

async function getWords() {
  return await (
    await fetch(
      `https://vocabulary-app-git-main-menchynskyi.vercel.app/api/words`,
      { next: { revalidate: 60 } }
    )
  ).json();
}

export default function Home() {
  const setOfWords = use(getWords());

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1 className={inter.className}>Vocabulary</h1>
      </div>
      <WordsList words={setOfWords} />
    </main>
  );
}
