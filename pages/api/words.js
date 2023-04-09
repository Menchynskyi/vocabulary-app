import { Client } from "@notionhq/client";

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

async function getWords(startCursor = undefined, words = []) {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    start_cursor: startCursor,
  });

  words = [
    ...words,
    ...response.results.map((result) => ({
      word: result.properties.Word.title[0].text.content,
      meaning:
        result.properties.Translation.rich_text[0].text.content ||
        result.properties.Meaning.rich_text[0].text.content ||
        result.properties.Example.rich_text[0].text.content,
    })),
  ];

  if (response.has_more) return getWords(response.next_cursor, words);

  return generateRandomWords(words, numberOfWords);
}

export default async function handler(req, res) {
  const randomWords = await getWords();

  res.status(200).json(randomWords);
}
