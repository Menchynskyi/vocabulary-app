import { ScrollArea } from "@/components/ui/scroll-area";
import { Word } from "@/types";

export function CompletedList({ words }: { words: Word[] }) {
  return (
    <ScrollArea className="max-h-[500px] min-w-[100px] max-w-[800px] rounded-md border ">
      {words.map(({ id, word, translation, meaning, example }) => (
        <div
          key={id}
          className="mb-4 p-4 text-lg [&:not(:last-of-type)]:border-b"
        >
          <div>
            <span>{word}</span>
          </div>
          <div>
            <span>{translation || meaning || example}</span>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
