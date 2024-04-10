export enum DateRangeMode {
  week = "week",
}

export type Word = {
  id: string;
  word: string;
  translation: string;
  meaning: string;
  example: string;
};

export type WordFields = keyof Word;
