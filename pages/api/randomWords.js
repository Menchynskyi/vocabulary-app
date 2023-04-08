import { uri } from "@/app/utils";

const numberOfWords = Number(process.env.VOCABULARY_SET_LENGTH || 15);

export function generateRandomWords(words, setLength = numberOfWords) {
  const randomWords = [];
  const indexes = new Set();

  while (indexes.size < setLength) {
    indexes.add(Math.floor(Math.random() * words.length));
  }

  for (const index of indexes) {
    randomWords.push({ id: index, ...words[index] });
  }

  return randomWords;
}

export default async function handler(req, res) {
  const allWords = await (
    await fetch(`${uri}/api/words`, { next: { revalidate: 72000 } })
  ).json();

  const randomWords = generateRandomWords(allWords);

  res.status(200).json(randomWords);
}
