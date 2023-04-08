export const uri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URI;

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
