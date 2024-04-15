import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Word } from "@/types";

type CompletedListProps = {
  words: Word[];
  goBack: () => void;
  startOver: () => void;
};

export function CompletedList({
  words,
  goBack,
  startOver,
}: CompletedListProps) {
  return (
    <div className="flex flex-col">
      <ScrollArea className="max-h-[400px] min-w-[90vw] max-w-[90vw] rounded-md border sm:max-h-[450px] sm:min-w-[450px] sm:max-w-[800px] ">
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
      <div className="mt-10 flex justify-between sm:mt-4 sm:block">
        <Button
          variant="outline"
          className="mr-3 min-w-[9rem] max-sm:h-16 max-sm:text-xl sm:min-w-[6.125rem]"
          onClick={goBack}
        >
          <span>Back</span>
        </Button>
        <Button
          onClick={startOver}
          className="min-w-[9rem] max-sm:h-16 max-sm:text-xl sm:min-w-[6.125rem]"
        >
          <span>Start over</span>
        </Button>
      </div>
    </div>
  );
}
