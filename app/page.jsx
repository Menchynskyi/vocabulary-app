import { use } from "react";

import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { WordsList } from "./WordsList";

const inter = Inter({ subsets: ["latin"] });

export const revalidate = 36000;
const uri = `${
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URL
}`;

async function getWords() {
  return await (await fetch(`${uri}/api/words`, { cache: "no-store" })).json();
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
