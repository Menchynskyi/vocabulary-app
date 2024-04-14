export const voiceNameCookie = "voiceName";
export const voiceChangeCustomEventName = "voiceChange";

export type VoiceName =
  | "en-US-Journey-D"
  | "en-US-Journey-F"
  | "en-GB-Studio-B"
  | "en-GB-Studio-C"
  | "en-GB-News-G"
  | "en-GB-News-J"
  | "en-US-Studio-Q"
  | "en-US-Studio-O";

export type VoiceLanguageCode = "en-US" | "en-GB";

export type VoiceType = "male" | "female";

export type VoiceOption = {
  name: VoiceName;
  languageCode: VoiceLanguageCode;
  type: VoiceType;
  label: string;
};

export const voiceOptions: Array<VoiceOption> = [
  {
    name: "en-US-Journey-D",
    languageCode: "en-US",
    type: "male",
    label: "US | Male | Journey",
  },
  {
    name: "en-US-Journey-F",
    languageCode: "en-US",
    type: "female",
    label: "US | Female | Journey",
  },
  {
    name: "en-US-Studio-Q",
    languageCode: "en-US",
    type: "male",
    label: "US | Male | Studio",
  },
  {
    name: "en-US-Studio-O",
    languageCode: "en-US",
    type: "female",
    label: "US | Female | Studio",
  },
  {
    name: "en-GB-News-J",
    languageCode: "en-GB",
    type: "male",
    label: "GB | Male | News",
  },
  {
    name: "en-GB-News-G",
    languageCode: "en-GB",
    type: "female",
    label: "GB | Female | News",
  },
  {
    name: "en-GB-Studio-B",
    languageCode: "en-GB",
    type: "male",
    label: "GB | Male | Studio",
  },
  {
    name: "en-GB-Studio-C",
    languageCode: "en-GB",
    type: "female",
    label: "GB | Female | Studio",
  },
];
