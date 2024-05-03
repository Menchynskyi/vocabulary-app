import { transformStringToSlotGroups } from "@/utils/slotGroups";
import { BlanksInput } from "../_components/BlanksInput";
import { getLatestWord } from "@/server/notion/queries";
import { cookies } from "next/headers";
import { blanksDifficultyCookie } from "@/constants/blanks";
import { BlanksDifficulty } from "@/types";

export default async function Blanks({
  params,
}: {
  params: { nextCursor: string[] };
}) {
  const cookieStore = cookies();
  const difficulty = cookieStore.get(blanksDifficultyCookie)
    ?.value as BlanksDifficulty;

  const { word, nextCursor } = await getLatestWord(params.nextCursor?.[0]);
  const { slotGroups, pureString } = transformStringToSlotGroups(
    word.word,
    difficulty,
  );

  return (
    <BlanksInput
      wordObject={word}
      difficulty={difficulty}
      nextCursor={nextCursor}
      slotGroups={slotGroups}
      pureString={pureString}
    />
  );
}
