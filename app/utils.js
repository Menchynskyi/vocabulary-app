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
