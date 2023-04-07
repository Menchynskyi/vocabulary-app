import fs from "fs";

export default async function handler(req, res) {
  const wordsFileContent = fs.readFileSync("words.json", "utf-8");
  const words = JSON.parse(wordsFileContent);

  res.status(200).json(words);
}
