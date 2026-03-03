import { toast } from "sonner";
import { getCookie, setCookie } from "cookies-next";
import {
  VoiceLanguageCode,
  VoiceName,
  voiceChangeCustomEventName,
  voiceNameCookie,
  voiceOptions,
} from "@/constants/voice";

export function useRandomVoice() {
  const setRandomVoice = (langCode: VoiceLanguageCode) => () => {
    const currentVoiceName = getCookie(voiceNameCookie) as VoiceName;
    const voices = voiceOptions.filter(
      (item) =>
        item.languageCode === langCode && item.name !== currentVoiceName,
    );
    const randomIndex = Math.floor(Math.random() * voices.length);
    const voiceName = voices[randomIndex].name;

    const customVoiceChangeEvent = new CustomEvent(voiceChangeCustomEventName);
    document.dispatchEvent(customVoiceChangeEvent);

    setCookie(voiceNameCookie, voiceName);
    toast("Voice changed", {
      description: `Changed to ${voices[randomIndex].label} voice`,
      action: {
        label: "Undo",
        onClick: () => {
          setCookie(voiceNameCookie, currentVoiceName);
          document.dispatchEvent(customVoiceChangeEvent);
        },
      },
    });
  };

  return { setRandomVoice };
}
