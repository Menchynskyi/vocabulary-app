import { synthesizeSpeech } from "@/utils/synthesizeSpeech";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const text = request.nextUrl.searchParams.get("text");
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
