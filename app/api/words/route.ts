import { getWords } from "@/utils/words";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const mode = request.nextUrl.searchParams.get("mode");
    const randomWords = await getWords(mode === "week");

    return Response.json({ data: randomWords });
  } catch (error) {
    console.error(error);
  }
}
