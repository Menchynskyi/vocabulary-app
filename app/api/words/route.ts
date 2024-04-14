import {
  cardsListLengthCookie,
  cardsListWeekModeLengthCookie,
} from "@/constants/cards";
import { GetWordsParams, getWords } from "@/utils/words";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const test = request.cookies.get(cardsListLengthCookie);
    const test2 = request.cookies.get(cardsListWeekModeLengthCookie);
    const cardsListLength = Number(test?.value);
    const cardsListWeekModeLength = Number(test2?.value);

    const mode = request.nextUrl.searchParams.get("mode");
    const isWeekMode = mode === "week";

    const params: GetWordsParams = { isWeekMode };

    if (isWeekMode && cardsListWeekModeLength) {
      params.wordsLength = cardsListWeekModeLength;
    }

    if (!isWeekMode && cardsListLength) {
      params.wordsLength = cardsListLength;
    }

    const randomWords = await getWords(params);

    return Response.json({ data: randomWords });
  } catch (error) {
    console.error(error);
  }
}
