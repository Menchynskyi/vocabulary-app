import { synthesizeSpeech } from "@/utils/synthesizeSpeech";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const text = request.nextUrl.searchParams.get("text");
    if (!text) {
      throw new Error("No text provided");
    }
    const audio = await synthesizeSpeech(text);

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error(error);
  }
}
