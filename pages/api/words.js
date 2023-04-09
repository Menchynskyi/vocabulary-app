import { Client } from "@notionhq/client";

const notionClient = new Client({
  auth: process.env.NOTION_SECRET,
});

const databaseId = process.env.NOTION_VOCABULARY_DATABASE_ID;

const numberOfWords = Number(process.env.VOCABULARY_SET_LENGTH || 15);

function generateRandomWords(words, setLength) {
  if (setLength > words.length) {
    return words.map((word, index) => ({ id: index, ...word }));
  }

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

function getRandomEnglishLetter() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
}

function getRandomUkrainianLetter() {
  const alphabet = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
}

function generateFilter(property, length = 5) {
  const filters = [];
  for (let i = 0; i < length; i++) {
    filters.push({
      property: property,
      rich_text: {
        starts_with:
          property === "Translation"
            ? getRandomUkrainianLetter()
            : getRandomEnglishLetter(),
      },
    });
  }
  return filters;
}

async function getWords() {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        ...generateFilter("Word"),
        ...generateFilter("Translation"),
        ...generateFilter("Meaning"),
      ],
    },
  });

  return generateRandomWords(
    response.results.map((result) => ({
      word: result.properties.Word.title[0].text.content,
      meaning:
        result.properties.Translation.rich_text[0].text.content ||
        result.properties.Meaning.rich_text[0].text.content ||
        result.properties.Example.rich_text[0].text.content,
    })),
    numberOfWords
  );
}

export default async function handler(req, res) {
  const randomWords = await getWords();

  res.status(200).json(randomWords);
}
