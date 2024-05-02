"use server";

import {
  VoiceName,
  defaultVoiceOption,
  voiceNameCookie,
  voiceOptions,
} from "@/constants/voice";
import textToSpeechClient from ".";
import { cookies } from "next/headers";

export async function getSynthesizedSpeech(text: string) {
  const cookieStore = cookies();
  const voiceName = cookieStore.get(voiceNameCookie)?.value as VoiceName;

  const { languageCode, name } =
    voiceOptions.find((item) => item.name === voiceName) || defaultVoiceOption;
  try {
    const [response] = await textToSpeechClient.synthesizeSpeech({
      audioConfig: {
        audioEncoding: "LINEAR16",
        pitch: 0,
        speakingRate: 1,
      },
      voice: {
        languageCode,
        name,
      },
      input: {
        text,
      },
    });
    return response.audioContent as Uint8Array;
  } catch (error) {
    console.error(error);
  }
}
