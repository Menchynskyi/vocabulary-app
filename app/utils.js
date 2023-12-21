export const uri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URI;

export const isTextToSpeechEnabled =
  process.env.TEXT_TO_SPEECH_ENABLED === "true";
