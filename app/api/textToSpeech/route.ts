import { VoiceName, voiceNameCookie } from "@/constants/voice";
import { NextRequest } from "next/server";
import { synthesizeSpeech } from "@/utils/synthesizeSpeech";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const voiceCookie = request.cookies.get(voiceNameCookie);
    const voiceName = voiceCookie?.value as VoiceName;
    const text = request.nextUrl.searchParams.get("text");
    if (!text) {
      throw new Error("No text provided");
    }
    const audio = await synthesizeSpeech(text, voiceName);

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error(error);
  }
}
