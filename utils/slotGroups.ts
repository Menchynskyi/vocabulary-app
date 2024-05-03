import { BlanksDifficulty, SlotGrops } from "@/types";
import { v4 as uuidv4 } from "uuid";

const regexp = new RegExp("^[a-zA-Z]+$");

export const transformStringToSlotGroups = (
  str: string,
  difficulty = BlanksDifficulty.Easy,
) => {
  let numberOfPrefilledChars = 0;

  switch (difficulty) {
    case BlanksDifficulty.Easy:
      numberOfPrefilledChars = Math.min(6, Math.floor(str.length * 0.5));
      break;
    case BlanksDifficulty.Medium:
      numberOfPrefilledChars = Math.min(4, Math.floor(str.length * 0.25));
      break;
    case BlanksDifficulty.Hard:
      numberOfPrefilledChars = Math.min(2, Math.floor(str.length * 0.1));
      break;
    case BlanksDifficulty.Extreme:
      numberOfPrefilledChars = 0;
      break;
  }

  const charStrArr = str
    .split("")
    .map((char, index) => {
      return { char, originalIndex: index, isPrefilled: false };
    })
    .filter(({ char }) => regexp.test(char));

  // pick n random elements from pureStringArr
  [...charStrArr]
    .sort(() => Math.random() - Math.random())
    .slice(0, numberOfPrefilledChars)
    .forEach(({ originalIndex }) => {
      charStrArr[
        charStrArr.findIndex((c) => c.originalIndex === originalIndex)
      ].isPrefilled = true;
    });

  const pureStrArr = charStrArr.filter(({ isPrefilled }) => !isPrefilled);

  const pureString = pureStrArr.map(({ char }) => char).join("");

  return {
    pureString,
    slotGroups: str.split("").reduce((acc, char, index) => {
      const lastGroupType = acc[acc.length - 1]?.type;
      const pureStringIndex = pureStrArr.findIndex(
        (c) => c.originalIndex === index,
      );
      const isPrefilled =
        charStrArr?.[charStrArr.findIndex((c) => c.originalIndex === index)]
          ?.isPrefilled;

      // First symbol
      if (lastGroupType === undefined) {
        const type = regexp.test(char) ? "char" : "separator";
        acc.push({
          type: isPrefilled ? "prefilled" : type,
          groupId: uuidv4(),
          slots: [
            {
              char,
              slotId: uuidv4(),
              index: type === "char" ? pureStringIndex : -1,
            },
          ],
        });
        return acc;
      }

      // not a character
      if (!regexp.test(char)) {
        // replace space with 3 spaces
        const modifiedChar = char === " " ? "   " : char;
        if (lastGroupType !== "separator") {
          acc.push({
            type: "separator",
            groupId: uuidv4(),
            slots: [{ slotId: uuidv4(), char: modifiedChar, index: -1 }],
          });
        } else {
          acc[acc.length - 1].slots.push({
            slotId: uuidv4(),
            char: modifiedChar,
            index: -1,
          });
        }
        return acc;
      }

      // a prefilled character
      if (isPrefilled) {
        if (lastGroupType !== "prefilled") {
          acc.push({
            type: "prefilled",
            groupId: uuidv4(),
            slots: [
              {
                slotId: uuidv4(),
                char,
                index: -1,
              },
            ],
          });
        } else {
          acc[acc.length - 1].slots.push({
            char,
            slotId: uuidv4(),
            index: -1,
          });
        }
        return acc;
      }

      // a character
      if (lastGroupType !== "char") {
        acc.push({
          type: "char",
          groupId: uuidv4(),
          slots: [
            {
              char,
              slotId: uuidv4(),
              index: pureStringIndex,
            },
          ],
        });
      } else {
        acc[acc.length - 1].slots.push({
          char,
          slotId: uuidv4(),
          index: pureStringIndex,
        });
      }

      return acc;
    }, [] as SlotGrops),
  };
};
