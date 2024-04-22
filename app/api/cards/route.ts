import {
  cardsListLengthCookie,
  cardsListWeekModeLengthCookie,
} from "@/constants/cards";
import { GetWordsParams, getWords } from "@/server/notion/queries";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const cardsLength = request.cookies.get(cardsListLengthCookie);
    const cardsLengthWeekMode = request.cookies.get(
      cardsListWeekModeLengthCookie,
    );
    const cardsListLength = Number(cardsLength?.value);
    const cardsListWeekModeLength = Number(cardsLengthWeekMode?.value);

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
