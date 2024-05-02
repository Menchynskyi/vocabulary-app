"use client";

type PlayBufferAudioParams =
  | {
      audioData: Uint8Array;
      cacheFunc?: (blob: Blob) => void;
      cachedBlob?: Blob;
    }
  | {
      audioData?: Uint8Array;
      cacheFunc?: (blob: Blob) => void;
      cachedBlob: Blob;
    };

export const playBufferAudio = ({
  audioData,
  cacheFunc,
  cachedBlob,
}: PlayBufferAudioParams) => {
  let blob = cachedBlob;

  if (!blob && audioData) {
    const buffer = new ArrayBuffer(
      audioData.length * Uint8Array.BYTES_PER_ELEMENT,
    );
    const uint8Array = new Uint8Array(buffer);
    uint8Array.set(audioData);

    blob = new Blob([uint8Array], { type: "audio/mpeg" });
    cacheFunc?.(blob);
  }

  if (!blob) throw new Error("No audio data");

  const audio = new Audio(URL.createObjectURL(blob));

  setTimeout(() => {
    audio.play();
  }, 0);
};
