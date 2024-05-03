"use client";

import { Button } from "@/components/ui/Button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/InputOtp";
import { BlanksDifficulty, SlotGrops, WordObject } from "@/types";
import { useRouter } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HintButtons } from "./HintButtons";
import { useIsMounted } from "@/utils/useIsMounted";
import { useKeyboardShortcuts } from "@/utils/useKeyboardShortcuts";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { areStringsEqualCaseInsensitive } from "@/utils/strings";
import { REGEXP_ONLY_CHARS } from "input-otp";
import { useMediaQuery } from "@/utils/useMediaQuery";

type BlanksInputProps = {
  wordObject: Omit<WordObject, "id">;
  nextCursor: string | null;
  pureString: string;
  slotGroups: SlotGrops;
  difficulty: BlanksDifficulty;
};

export function BlanksInput({
  wordObject,
  nextCursor,
  pureString,
  slotGroups,
  difficulty,
}: BlanksInputProps) {
  const { push } = useRouter();
  const isMounted = useIsMounted();
  const { isDesktop } = useMediaQuery();

  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement | null>(null);

  const revealLetter = () => {
    const letterToReveal = pureString.slice(value.length)?.[0];
    if (!letterToReveal) return;

    setValue((prev) => prev + letterToReveal);

    setTimeout(() => {
      ref.current?.focus();
    }, 200);
  };

  const handleClickNext = useCallback(() => {
    if (!areStringsEqualCaseInsensitive(value, pureString)) return;

    push(`/blanks/${nextCursor}`);
  }, [nextCursor, push, value, pureString]);

  const handleInputChange = (newValue: string) => {
    setValue(newValue);
    if (areStringsEqualCaseInsensitive(newValue, pureString)) {
      ref.current?.blur();
    }
  };

  const isCompleted = areStringsEqualCaseInsensitive(value, pureString);

  useEffect(() => {
    setValue("");
  }, [difficulty]);

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: "Enter",
        action: (e) => {
          e.preventDefault();
          handleClickNext();
        },
      },
    ],
    deps: [handleClickNext],
  });

  const translation = useMemo(() => {
    if (wordObject.translation) {
      return `Translation: ${wordObject.translation}`;
    }
    if (wordObject.meaning) {
      return `Meaning: ${wordObject.meaning}`;
    }

    return "";
  }, [wordObject]);

  if (!isMounted) return null;

  return (
    <div className="mt-6 min-w-[90vw] max-w-[90vw] flex-col overflow-hidden rounded-md border bg-background p-4 sm:mt-8 sm:min-w-[500px] sm:max-w-[500px] sm:px-10">
      <InputOTP
        ref={ref}
        autoFocus={isDesktop}
        disabled={isCompleted}
        maxLength={pureString.length}
        value={value}
        onChange={handleInputChange}
        pattern={REGEXP_ONLY_CHARS}
      >
        {slotGroups.map((group, groupIndex) =>
          group.type === "char" ? (
            <InputOTPGroup key={groupIndex + group.type}>
              {group.slots.map(({ char, index }) => {
                const isCorrect = areStringsEqualCaseInsensitive(
                  value[index],
                  pureString[index],
                );
                return (
                  <InputOTPSlot
                    key={char + index}
                    index={index}
                    isCorrect={value[index] ? isCorrect : undefined}
                  />
                );
              })}
            </InputOTPGroup>
          ) : (
            <Fragment key={groupIndex + group.type}>
              {group.slots.map(({ char, index }) => (
                <InputOTPSeparator key={char + index} char={char} />
              ))}
            </Fragment>
          ),
        )}
      </InputOTP>
      {!!translation && (
        <div className="mt-4 max-sm:text-center">
          <span>{translation}</span>
        </div>
      )}

      {!isCompleted && (
        <HintButtons
          value={value}
          word={wordObject.word}
          difficulty={difficulty}
          revealLetter={revealLetter}
        />
      )}

      {isCompleted && (
        <Button
          onClick={handleClickNext}
          className="mt-10 w-full"
          aria-label="Next word"
          variant="outline"
        >
          Next word
          <KeyboardShortcut
            shortcut="↵"
            className="ml-2 h-auto px-2 text-[14px]"
          />
        </Button>
      )}
    </div>
  );
}
