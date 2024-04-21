import {
  defaultCardsListLength,
  defaultCardsListWeekModeLength,
} from "@/constants/cards";
import notionClient from ".";
import {
  generateFilter,
  generateRandomWords,
  generateSorts,
  notionVocabularyDatabaseId,
} from "./utils";
import {
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type GetWordsParams = {
  isWeekMode?: boolean;
  wordsLength?: number;
};

export async function getWords({ isWeekMode, wordsLength }: GetWordsParams) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const fallbackLength = isWeekMode
    ? defaultCardsListWeekModeLength
    : defaultCardsListLength;

  const _numberOfWords = wordsLength || fallbackLength;

  let response = await notionClient.databases.query({
    database_id: notionVocabularyDatabaseId,
    filter: isWeekMode
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
      database_id: notionVocabularyDatabaseId,
      filter: isWeekMode
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
