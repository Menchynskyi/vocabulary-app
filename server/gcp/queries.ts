"use server";

import {
  VoiceName,
  defaultVoiceOption,
  voiceOptions,
} from "@/constants/voice";
import textToSpeechClient from ".";
import { cookies } from "next/headers";
import {
  getDefaultCookieLikeSettings,
  getEffectiveUserSettings,
} from "@/server/db/queries";

export async function getSynthesizedSpeech(text: string) {
  const cookieStore = await cookies();
  const fallbackSettings = await getDefaultCookieLikeSettings(cookieStore);
  const settings = await getEffectiveUserSettings(fallbackSettings);
  const voiceName = settings.global.voiceName as VoiceName;

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
