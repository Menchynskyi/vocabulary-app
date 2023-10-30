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

function getRandomOrder() {
  const orders = ["ascending", "descending", undefined];
  const randomIndex = Math.floor(Math.random() * orders.length);
  return orders[randomIndex];
}

function generateSorts() {
  const sorts = [];
  const properties = ["Translation", "Word", "Meaning", "Created date"];
  for (let i = 0; i < properties.length; i++) {
    const direction = getRandomOrder();
    if (direction) {
      sorts.push({
        property: properties[i],
        direction: direction,
      });
    }
  }
  return sorts;
}

function getRandomEnglishLetter() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
}

function getRandomUkrainianLetter() {
  const alphabet =
    process.env.TRANSLATION_LANGUAGE === "UA"
      ? "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя"
      : "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
}

function generateFilter(length = 5) {
  const filters = [];
  const properties = ["Translation", "Word"];
  for (let i = 0; i < length; i++) {
    for (const property of properties) {
      if (Math.random() < 0.3) {
        continue;
      }
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
  }
  return filters;
}

async function getWords() {
  let response = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      or: generateFilter(),
    },
    sorts: generateSorts(),
  });

  if (response.results.length < numberOfWords) {
    response = await notionClient.databases.query({
      database_id: databaseId,
      sorts: generateSorts(),
    });
  }

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
