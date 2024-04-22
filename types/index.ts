export enum VocabularyMode {
  week = "week",
  random = "random",
}

export type WordCard = {
  id: string;
  word: string;
  translation: string;
  meaning: string;
  example: string;
  url: string;
};

export type WordCardFields = keyof WordCard;

export type CardCommandsConfig = Array<
  Array<{
    label: string;
    shortcut?: string;
    onSelect?: () => void;
    disabled?: boolean;
  }>
>;
