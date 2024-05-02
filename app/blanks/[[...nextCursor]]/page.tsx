import { transformStringToSlotGroups } from "@/utils/slotGroups";
import { BlanksInput } from "../_components/BlanksInput";
import { getLatestWord } from "@/server/notion/queries";

export default async function Blanks({
  params,
}: {
  params: { nextCursor: string[] };
}) {
  const { word, nextCursor } = await getLatestWord(params.nextCursor?.[0]);
  const { slotGroups, pureString } = transformStringToSlotGroups(word.word);

  return (
    <BlanksInput
      wordObject={word}
      nextCursor={nextCursor}
      slotGroups={slotGroups}
      pureString={pureString}
    />
  );
}
