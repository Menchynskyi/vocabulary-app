"use client";

import { Dispatch, createContext, useReducer } from "react";

type CardsState = {
  flipMode: boolean;
};

type CardsAction = { type: "toggle_flip_mode" };

const initialState: CardsState = {
  flipMode: false,
};

function reducer(state: CardsState, action: CardsAction): CardsState {
  switch (action.type) {
    case "toggle_flip_mode": {
      return {
        ...state,
        flipMode: !state.flipMode,
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
