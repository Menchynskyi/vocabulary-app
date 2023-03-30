import { Client } from "@notionhq/client";

export const uri = "http://localhost:3000";

const notionClient = new Client({
  auth: process.env.NOTION_SECRET,
});

const databaseId = process.env.NOTION_VOCABULARY_DATABASE_ID;

const numberOfWords = Number(process.env.VOCABULARY_SET_LENGTH || 15);

export async function getWords() {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "Word",
        direction: "ascending",
      },
    ],
  });

  const words = response.results.map((result) => {
    const properties = result.properties;
    return {
      word: properties.Word.title[0].text.content,
      meaning:
        properties.Translation.rich_text[0].text.content ||
        properties.Meaning.rich_text[0].text.content ||
        properties.Example.rich_text[0].text.content,
    };
  });

  const randomWords = [];

  for (let i = 0; i < numberOfWords; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    randomWords.push({ id: randomIndex, ...words[randomIndex] });
  }

  return randomWords;
}
