import { transformStringToSlotGroups } from "@/utils/slotGroups";
import { BlanksInput } from "../_components/BlanksInput";
import { getLatestWord } from "@/server/notion/queries";
import { cookies } from "next/headers";
import {
  getDefaultCookieLikeSettings,
  getEffectiveUserSettings,
} from "@/server/db/queries";

export default async function Blanks({
  params,
}: {
  params: { nextCursor: string[] };
}) {
  const cookieStore = await cookies();
  const fallbackSettings = await getDefaultCookieLikeSettings(cookieStore);
  const settings = await getEffectiveUserSettings(fallbackSettings);
  const difficulty = settings.blanks.blanksDifficulty;

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
