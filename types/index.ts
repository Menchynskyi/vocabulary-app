export enum DateRangeMode {
  week = "week",
}

export type Word = {
  id: string;
  word: string;
  translation: string;
  meaning: string;
  example: string;
  url: string;
};

export type WordFields = keyof Word;

export type CardCommandsConfig = Array<
  Array<{
    label: string;
    shortcut?: string;
    onSelect?: () => void;
    disabled?: boolean;
  }>
>;
