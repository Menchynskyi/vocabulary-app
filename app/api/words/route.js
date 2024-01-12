import { getWords } from "@/utils/words";

export async function GET(request) {
  try {
    const mode = request.nextUrl.searchParams.get("mode");
    const randomWords = await getWords(mode === "week");

    return Response.json({ data: randomWords });
  } catch (error) {
    console.error(error);
  }
}
