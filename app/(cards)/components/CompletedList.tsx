import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Word } from "@/types";

export function CompletedList({
  words,
  goBack,
  startOver,
}: {
  words: Word[];
  goBack: () => void;
  startOver: () => void;
}) {
  return (
    <div className="flex flex-col">
      <ScrollArea className="max-h-[450px] min-w-[450px] max-w-[800px] rounded-md border ">
        {words.map(({ id, word, translation, meaning, example }) => (
          <div key={id} className="p-4 text-lg [&:not(:last-of-type)]:border-b">
            <div>
              <span>{word}</span>
            </div>
            <div>
              <span>{translation || meaning || example}</span>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="mt-4">
        <Button
          variant="outline"
          className="mr-3 min-w-[6.125rem]"
          onClick={goBack}
        >
          <span>Back</span>
        </Button>
        <Button onClick={startOver} className="min-w-[6.125rem]">
          <span>Start over</span>
        </Button>
      </div>
    </div>
  );
}
