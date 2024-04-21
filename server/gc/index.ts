import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const textToSpeechClient = new TextToSpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
});

export default textToSpeechClient;
