import { VoiceName, voiceOptions } from "@/constants/voice";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const client = new TextToSpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
});

export async function synthesizeSpeech(text: string, voiceName?: VoiceName) {
  const { languageCode, name } =
    voiceOptions.find((item) => item.name === voiceName) || voiceOptions[0];
  try {
    const [response] = await client.synthesizeSpeech({
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
