"use client";

import { EditWordData } from "@/types";
import { Dispatch, createContext, useReducer } from "react";

type CardsState = {
  flipMode: boolean;
  editWordData: EditWordData | null;
};

type CardsAction =
  | { type: "toggle_flip_mode" }
  | { type: "set_edit_word_data"; payload: EditWordData };

const initialState: CardsState = {
  flipMode: false,
  editWordData: null,
};

function reducer(state: CardsState, action: CardsAction): CardsState {
  switch (action.type) {
    case "toggle_flip_mode": {
      return {
        ...state,
        flipMode: !state.flipMode,
      };
    }
    case "set_edit_word_data": {
      return {
        ...state,
        editWordData: action.payload,
      };
    }
    default:
      throw new Error();
  }
}

export const CardsContext = createContext(initialState);
export const CardsDispatchContext = createContext(
  (() => undefined) as Dispatch<CardsAction>,
);

export function CardsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CardsContext.Provider value={state}>
      <CardsDispatchContext.Provider value={dispatch}>
        {children}
      </CardsDispatchContext.Provider>
    </CardsContext.Provider>
  );
}
