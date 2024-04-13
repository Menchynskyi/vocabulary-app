export const voiceNameCookie = "voiceName";
export const voiceChangeCustomEventName = "voiceChange";

export type VoiceName =
  | "en-US-Journey-D"
  | "en-US-Journey-F"
  | "en-GB-Studio-B"
  | "en-GB-Studio-C";

export type VoiceLanguageCode = "en-US" | "en-GB";

export type VoiceType = "male" | "female";

export type VoiceOption = {
  name: VoiceName;
  languageCode: VoiceLanguageCode;
  type: VoiceType;
};

export const voiceOptions: Array<VoiceOption> = [
  {
    name: "en-US-Journey-D",
    languageCode: "en-US",
    type: "male",
  },
  {
    name: "en-US-Journey-F",
    languageCode: "en-US",
    type: "female",
  },
  {
    name: "en-GB-Studio-B",
    languageCode: "en-GB",
    type: "male",
  },
  {
    name: "en-GB-Studio-C",
    languageCode: "en-GB",
    type: "female",
  },
];
