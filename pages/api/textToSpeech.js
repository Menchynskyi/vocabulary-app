const { TextToSpeechClient } = require("@google-cloud/text-to-speech");

const client = new TextToSpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
});

export async function synthesizeSpeech(text) {
  try {
    const request = {
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
    };

    const [response] = await client.synthesizeSpeech(request);
    return response.audioContent;
  } catch (error) {
    console.error(error);
  }
}

export default async function handler(req, res) {
  try {
    const { text } = req.query;
    const audio = await synthesizeSpeech(text);
    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(audio);
  } catch (error) {
    console.error(error);
  }
}
