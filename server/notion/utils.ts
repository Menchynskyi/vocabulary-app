import { Word } from "@/types";

type Order = "ascending" | "descending";

const alphabets = {
  en: "abcdefghijklmnopqrstuvwxyz",
  ua: "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя",
  ru: "абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
};

const isUkrainianTranslation =
  process.env.NEXT_PUBLIC_TRANSLATION_LANGUAGE === "UA";

export const notionVocabularyDatabaseId =
  process.env.NOTION_VOCABULARY_DATABASE_ID || "";

export function generateRandomWords(
  words: Omit<Word, "id">[],
  setLength: number,
) {
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

export function generateSorts() {
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

export function generateFilter(length = 5) {
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
