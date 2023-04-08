import { Client } from "@notionhq/client";

const notionClient = new Client({
  auth: process.env.NOTION_SECRET,
});

const databaseId = process.env.NOTION_VOCABULARY_DATABASE_ID;

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

  return words;
}

export default async function handler(req, res) {
  const allWords = await getWords();

  res.status(200).json(allWords);
}
