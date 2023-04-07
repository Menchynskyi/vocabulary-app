import { Client } from "@notionhq/client";

export const uri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URI;

const notionClient = new Client({
  auth: process.env.NOTION_SECRET,
});

const databaseId = process.env.NOTION_VOCABULARY_DATABASE_ID;

const numberOfWords = Number(process.env.VOCABULARY_SET_LENGTH || 15);

function generateRandomWords(words, setLength) {
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

export async function getWords(startCursor = undefined, words = []) {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "Created date",
        direction: "descending",
      },
    ],
    start_cursor: startCursor,
  });

  words = [
    ...words,
    ...response.results.map((result) => {
      const properties = result.properties;
      return {
        word: properties.Word.title[0].text.content,
        meaning:
          properties.Translation.rich_text[0].text.content ||
          properties.Meaning.rich_text[0].text.content ||
          properties.Example.rich_text[0].text.content,
      };
    }),
  ];

  if (response.has_more) return getWords(response.next_cursor, words);

  const randomWords = generateRandomWords(words, numberOfWords);

  return randomWords;
}

export function getWordsFromFile() {
  const words = process.env.WORDS;
  if (!words) {
    process.env.WORDS = JSON.stringify([
      { id: 701, word: "eviction", meaning: "виселення" },
      { id: 313, word: "scented candle", meaning: "арома свічка" },
      { id: 567, word: "rust", meaning: "іржа" },
      {
        id: 390,
        word: "make friends with someone",
        meaning: "подружитися з кимось",
      },
      { id: 214, word: "holly", meaning: "падуб(різдвяна рослина)" },
      { id: 414, word: "flooded", meaning: "затоплений" },
      { id: 593, word: "so far", meaning: "досі, поки, до цього моменту" },
      { id: 603, word: "reach", meaning: "дотягнутись" },
      { id: 636, word: "established", meaning: "створений; встановлений" },
      { id: 516, word: "clumsy", meaning: "незгарбний" },
      { id: 640, word: "slip someone's mind", meaning: "вилетіло з голови" },
      { id: 49, word: "shedding", meaning: "линька" },
      {
        id: 230,
        word: "get expelled from uni",
        meaning: "бути виключеним з універу",
      },
      { id: 585, word: "mortality", meaning: "смертність" },
      {
        id: 728,
        word: "regret",
        meaning: "жаліти, шкодувати за чимось, жаль, шкода",
      },
    ]);
  }

  const result = JSON.parse(process.env.WORDS);

  return result;
}
