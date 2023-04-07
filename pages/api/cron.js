import { getWords } from "@/app/utils";
import fs from "fs";

export default async function handler(req, res) {
  const words = await getWords();
  const wordsFileContent = JSON.stringify(words);
  fs.writeFileSync("words.json", wordsFileContent, "utf-8");

  res.status(200).end("Generated");
}
