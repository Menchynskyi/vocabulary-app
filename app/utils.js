import { Client } from "@notionhq/client";

const notionClient = new Client({ auth: process.env.NOTION_SECRET });
const notionVocabularyPageId = process.env.NOTION_VOCABULARY_PAGE_ID;

function generateRandomSet(wordsArr, setLength) {
  const randomSet = [];
  while (randomSet.length < setLength) {
    const randomIndex = Math.floor(Math.random() * wordsArr.length - 1);
    const randomWord = wordsArr[randomIndex];
    if (randomSet.findIndex((block) => block.id === randomWord.id) === -1) {
      randomSet.push(randomWord);
    }
  }
  return randomSet;
}

async function getAllWords(client, pageId, accumWordsArr = []) {
  const response = await client.blocks.children.list({
    block_id: pageId,
    page_size: 100,
    start_cursor: accumWordsArr[accumWordsArr.length - 1]?.id,
  });

  const wordsArr = response.results
    .filter((block) => block.type === "toggle")
    .map((block) => ({
      id: block.id,
      word: block.toggle.rich_text[0].plain_text,
    }));
  const concatedWordsArr = [...accumWordsArr, ...wordsArr];

  if (response.has_more) {
    return getAllWords(client, pageId, concatedWordsArr);
  }

  return concatedWordsArr;
}

async function getWordTranslation(client, blockId) {
  const response = await client.blocks.children.list({
    block_id: blockId,
  });
  return response.results.reduce((translation, block) => {
    const paragraphText = block.paragraph.rich_text
      .map((block) => block.plain_text)
      .join("");
    return translation + paragraphText;
  }, "");
}

export async function getRandomSetOfWords() {
  const wordsArr = await getAllWords(notionClient, notionVocabularyPageId);

  const randomSetOfWords = generateRandomSet(wordsArr, 10);

  const randomSetOfWordsTranslations = await Promise.all(
    randomSetOfWords.map((word) => getWordTranslation(notionClient, word.id))
  );

  const randomSetOfWordsWithTranslations = randomSetOfWords.map(
    (word, index) => ({
      ...word,
      translation: randomSetOfWordsTranslations[index],
    })
  );

  return randomSetOfWordsWithTranslations;
}
