import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { WordObject } from "@/types";
import { useContext } from "react";
import { CardsDispatchContext } from "./CardsContext";

type CompletedListProps = {
  cards: WordObject[];
  startOver: () => void;
};

export function CompletedList({ cards, startOver }: CompletedListProps) {
  const dispatch = useContext(CardsDispatchContext);
  return (
    <div className="flex flex-col">
      <ScrollArea className="h-[400px] min-w-[90vw] max-w-[90vw] rounded-md border sm:h-[450px] sm:min-w-[450px] sm:max-w-[500px] ">
        {cards.map(({ id, word, translation, meaning, example }) => (
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
      <div className="mt-10 flex justify-between max-sm:flex-col sm:mt-4">
        <Button
          aria-label="Start over"
          variant="outline"
          className="max-sm:h-14 max-sm:text-lg sm:mr-3 sm:min-w-[6.125rem] sm:px-8"
          onClick={startOver}
        >
          <span>Start over</span>
        </Button>
        <Button
          aria-label="Flip and start over"
          onClick={() => {
            dispatch({ type: "toggle_flip_mode" });
            startOver();
          }}
          className="max-sm:mt-4 max-sm:h-14 max-sm:text-lg sm:min-w-[6.125rem] sm:px-8"
        >
          <span>Flip and start over</span>
        </Button>
      </div>
    </div>
  );
}
