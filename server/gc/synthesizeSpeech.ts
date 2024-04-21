import { VoiceName, defaultVoiceOption, voiceOptions } from "@/constants/voice";
import textToSpeechClient from ".";

export async function synthesizeSpeech(text: string, voiceName?: VoiceName) {
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
    return response.audioContent;
  } catch (error) {
    console.error(error);
  }
}
