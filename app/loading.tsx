import { Inter } from "next/font/google";
import styles from "./styles/page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Loader() {
  return (
    <div className={`${inter.className} ${styles.main}`}>
      <div className={styles.loader}>
        <span>Generating a set of words for you...</span>
      </div>
    </div>
  );
}
