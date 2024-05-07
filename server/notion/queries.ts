"use server";

import {
  cardsListLengthCookie,
  cardsListWeekModeLengthCookie,
  defaultCardsListLength,
  defaultCardsListWeekModeLength,
} from "@/constants/cards";
import notionClient from ".";
import {
  generateFilter,
  generateRandomWords,
  generateSorts,
  notionVocabularyDatabaseId,
  parseWordResponse,
} from "./utils";
import {
  PageObjectResponse,
  UpdatePageParameters,
} from "@notionhq/client/build/src/api-endpoints";
import { cookies } from "next/headers";
import { EditWordData, VocabularyMode } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getWords(mode?: VocabularyMode) {
  const cookieStore = cookies();
  const cardsLength = Number(cookieStore.get(cardsListLengthCookie)?.value);
  const cardsLengthWeekMode = Number(
    cookieStore.get(cardsListWeekModeLengthCookie)?.value,
  );

  const isWeekMode = mode === "week";

  let _numberOfWords = isWeekMode
    ? defaultCardsListWeekModeLength
    : defaultCardsListLength;

  if (!isNaN(cardsLength) && !isWeekMode) {
    _numberOfWords = cardsLength;
  }
  if (!isNaN(cardsLengthWeekMode) && isWeekMode) {
    _numberOfWords = cardsLengthWeekMode;
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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
      .map(parseWordResponse)
      .filter(
        (word) =>
          word.word && (word.translation || word.meaning || word.example),
      ),
    _numberOfWords,
  );
}

export async function getLatestWord(nextCursor?: string) {
  const response = await notionClient.databases.query({
    database_id: notionVocabularyDatabaseId,
    page_size: 1,
    start_cursor: nextCursor,
    sorts: [{ property: "Created date", direction: "descending" }],
  });

  const word = parseWordResponse(response.results[0] as PageObjectResponse);

  return { word, nextCursor: response.next_cursor };
}

export async function getWordById(id: string) {
  const response = await notionClient.pages.retrieve({ page_id: id });

  return parseWordResponse(response as PageObjectResponse);
}

export async function updateWord(
  id: string,
  data: Partial<Omit<EditWordData, "notionId">>,
) {
  console.log(data, "test");
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const fullUserData = await clerkClient.users.getUser(user.userId);
  if (!fullUserData.privateMetadata?.canEdit)
    throw new Error("No permissions to edit cards");

  const properties: UpdatePageParameters["properties"] = {};

  if (data.word !== undefined) {
    properties["Word"] = {
      title: [{ text: { content: data.word } }],
    };
  }
  if (data.translation !== undefined) {
    properties["Translation"] = {
      rich_text: [{ text: { content: data.translation } }],
    };
  }
  if (data.meaning !== undefined) {
    properties["Meaning"] = {
      rich_text: [{ text: { content: data.meaning } }],
    };
  }
  if (data.example !== undefined) {
    properties["Example"] = {
      rich_text: [{ text: { content: data.example } }],
    };
  }

  await notionClient.pages.update({
    page_id: id,
    properties,
  });

  revalidatePath("/");
  revalidatePath(`/edit-card/${id}`);

  return true;
}
