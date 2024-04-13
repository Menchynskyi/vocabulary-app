import { Word } from "@/types";
import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

type Order = "ascending" | "descending";

const alphabets = {
  en: "abcdefghijklmnopqrstuvwxyz",
  ua: "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя",
  ru: "абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
};
const isUkrainianTranslation =
  process.env.NEXT_PUBLIC_TRANSLATION_LANGUAGE === "UA";

const notionClient = new Client({
  auth: process.env.NOTION_SECRET,
});

const databaseId = process.env.NOTION_VOCABULARY_DATABASE_ID || "";

const numberOfWords = Number(process.env.VOCABULARY_SET_LENGTH || 15);
const numberOfWordsWeekMode = Number(
  process.env.VOCABULARY_SET_LENGTH_WEEK_MODE || numberOfWords,
);

function generateRandomWords(words: Omit<Word, "id">[], setLength: number) {
  if (setLength > words.length) {
    return words.map((word, index) => ({ id: index, ...word }));
  }

  const randomWords = [];
  const indexes: Set<number> = new Set();

  while (indexes.size < setLength) {
    indexes.add(Math.floor(Math.random() * words.length));
  }

  for (const index of Array.from(indexes)) {
    randomWords.push({ id: index, ...words[index] });
  }

  return randomWords;
}

function getRandomOrder() {
  const orders: (Order | undefined)[] = ["ascending", "descending", undefined];
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

function getRandomEnglishLetter(alphabet: string) {
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
}

function getRandomTranslationLetter(alphabet: string) {
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
              ? getRandomTranslationLetter(
                  isUkrainianTranslation ? alphabets.ua : alphabets.ru,
                )
              : getRandomEnglishLetter(alphabets.en),
        },
      });
    }
  }
  return filters;
}

export async function getWords(isWeek: boolean) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const _numberOfWords = isWeek ? numberOfWordsWeekMode : numberOfWords;

  let response = await notionClient.databases.query({
    database_id: databaseId,
    filter: isWeek
      ? {
          and: [
            {
              property: "Created date",
              date: {
                on_or_after: sevenDaysAgo.toISOString(),
              },
            },
            {
              or: generateFilter(),
            },
          ],
        }
      : {
          or: generateFilter(),
        },
    sorts: generateSorts(),
  });

  if (response.results.length < _numberOfWords) {
    response = await notionClient.databases.query({
      database_id: databaseId,
      filter: isWeek
        ? {
            property: "Created date",
            date: {
              on_or_after: sevenDaysAgo.toISOString(),
            },
          }
        : undefined,
      sorts: generateSorts(),
    });
  }

  return generateRandomWords(
    (response.results as PageObjectResponse[])
      .map((result) => {
        let word = "";
        let translation = "";
        let meaning = "";
        let example = "";

        if (result.properties.Word.type === "title") {
          const wordResponse = result.properties.Word
            .title[0] as TextRichTextItemResponse;
          word = wordResponse?.text.content || "";
        }
        if (result.properties.Translation.type === "rich_text") {
          const translationResponse = result.properties.Translation
            .rich_text[0] as TextRichTextItemResponse;
          translation = translationResponse?.text.content || "";
        }
        if (result.properties.Meaning.type === "rich_text") {
          const meaningResponse = result.properties.Meaning
            .rich_text[0] as TextRichTextItemResponse;
          meaning = meaningResponse?.text.content || "";
        }
        if (result.properties.Example.type === "rich_text") {
          const exampleResponse = result.properties.Example
            .rich_text[0] as TextRichTextItemResponse;
          example = exampleResponse?.text.content || "";
        }

        return {
          word,
          translation,
          meaning,
          example,
          url: result.url,
        };
      })
      .filter(
        (word) =>
          word.word && (word.translation || word.meaning || word.example),
      ),
    _numberOfWords,
  );
}
