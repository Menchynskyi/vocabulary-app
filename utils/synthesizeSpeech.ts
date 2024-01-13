import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const client = new TextToSpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
});

export async function synthesizeSpeech(text: string) {
  try {
    const [response] = await client.synthesizeSpeech({
      audioConfig: {
        audioEncoding: "LINEAR16",
        pitch: 0,
        speakingRate: 1,
      },
      voice: {
        languageCode: "en-US",
        name: "en-US-Journey-D",
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
