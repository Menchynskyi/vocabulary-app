export const uri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_VERCEL_URI;

export const isTextToSpeechEnabled =
  process.env.NEXT_PUBLIC_TEXT_TO_SPEECH_ENABLED === "true";

export const settingsButtonId = "settings-button";
