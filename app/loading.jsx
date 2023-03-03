import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Loader() {
  return (
    <div className={inter.className}>
      <span>Generating your daily set of words...</span>
    </div>
  );
}
