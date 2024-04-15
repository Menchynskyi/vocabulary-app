"use client";

import { Dispatch, createContext, useReducer } from "react";

type CardsState = {
  flippedMode: boolean;
};

type CardsAction = { type: "toggle_flipped_mode" };

const initialState: CardsState = {
  flippedMode: false,
};

function reducer(state: CardsState, action: CardsAction): CardsState {
  switch (action.type) {
    case "toggle_flipped_mode": {
      return {
        ...state,
        flippedMode: !state.flippedMode,
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
