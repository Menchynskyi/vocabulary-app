"use client";

import { Button } from "@/components/ui/Button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
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
import { useKeyboardShortcuts } from "@/utils/keyboardShortcuts";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { areStringsEqualCaseInsensitive } from "@/utils/strings";
import { REGEXP_ONLY_CHARS } from "input-otp";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { cn } from "@/utils/tailwind";
import { createUserBlanksStats } from "@/server/db/queries";
import { useUser } from "@clerk/nextjs";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { numberToDoublePrecision } from "@/utils/numbers";
import Link from "next/link";

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
  const { isSignedIn } = useUser();

  const [value, setValue] = useState("");
  const [accuracy, setAccuracy] = useState(100);
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
    const isCorrect = areStringsEqualCaseInsensitive(
      newValue[newValue.length - 1],
      pureString[newValue.length - 1],
    );
    if (!isCorrect) {
      setAccuracy((prev) => {
        const newAccuracy = prev - prev / (100 / pureString.length);
        return numberToDoublePrecision(newAccuracy);
      });
    }

    setValue(newValue);

    if (!areStringsEqualCaseInsensitive(newValue, pureString)) return;

    ref.current?.blur();
    if (isSignedIn) {
      createUserBlanksStats(accuracy);
    }
  };

  const isCompleted = areStringsEqualCaseInsensitive(value, pureString);

  useEffect(() => {
    setValue("");
  }, [difficulty]);

  useKeyboardShortcuts({
    shortcuts: [
      {
        scope: "blanks",
        shortcut: "nextWord",
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
      <ScrollArea className="max-h-[200px] overflow-y-auto p-1">
        <InputOTP
          ref={ref}
          autoFocus={isDesktop}
          disabled={isCompleted}
          maxLength={pureString.length}
          value={value}
          onChange={handleInputChange}
          pattern={REGEXP_ONLY_CHARS}
        >
          {slotGroups.map((group) =>
            group.type === "char" ? (
              <InputOTPGroup key={group.type + group.groupId}>
                {group.slots.map(({ char, index, slotId }) => {
                  const isCorrect = areStringsEqualCaseInsensitive(
                    value[index],
                    pureString[index],
                  );
                  return (
                    <InputOTPSlot
                      key={char + slotId}
                      index={index}
                      isCorrect={value[index] ? isCorrect : undefined}
                    />
                  );
                })}
              </InputOTPGroup>
            ) : (
              <Fragment key={group.type + group.groupId}>
                {group.slots.map(({ char, slotId }) => (
                  <InputOTPSeparator key={char + slotId} char={char} />
                ))}
              </Fragment>
            ),
          )}
        </InputOTP>
      </ScrollArea>

      {!isCompleted && (
        <>
          {!!translation && (
            <div className="mt-4 max-sm:text-center">
              <span>{translation}</span>
            </div>
          )}
          <HintButtons
            value={value}
            word={wordObject.word}
            difficulty={difficulty}
            revealLetter={revealLetter}
          />
        </>
      )}

      {isCompleted && (
        <>
          {wordObject.translation && (
            <div className="mt-4 max-sm:text-center">
              <span>Translation: {wordObject.translation}</span>
            </div>
          )}
          {wordObject.meaning && (
            <div
              className={cn(
                "mt-2 max-sm:text-center",
                !wordObject.translation && "mt-4",
              )}
            >
              <span>Meaning: {wordObject.meaning}</span>
            </div>
          )}
          {wordObject.example && (
            <div className="mt-2 max-sm:text-center">
              <span>Example: {wordObject.example}</span>
            </div>
          )}
          <div className="mt-2 max-sm:text-center">
            {isSignedIn ? (
              <Link
                className="hover:text-primary hover:underline"
                href="/stats"
              >
                <span>Accuracy: {accuracy}%</span>
              </Link>
            ) : (
              <span>Accuracy: {accuracy}%</span>
            )}
          </div>
          <Button
            onClick={handleClickNext}
            className="mt-10 w-full"
            aria-label="Next word"
            variant="outline"
          >
            Next word
            <KeyboardShortcut
              scope="blanks"
              shortcut="nextWord"
              className="ml-2 h-auto px-2 text-[14px]"
            />
          </Button>
        </>
      )}
    </div>
  );
}
