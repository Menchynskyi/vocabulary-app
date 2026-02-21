export enum VocabularyMode {
  week = "week",
  random = "random",
  latest = "latest",
}


export type WordObject = {
  id: number;
  word: string;
  translation: string;
  meaning: string;
  example: string;
  url: string;
  notionId: string;
};

export type WordObjectFields = keyof WordObject;

export type EditWordData = Omit<WordObject, "url" | "id">;

export type CardCommandsConfig = Array<
  Array<{
    label: string;
    shortcut?: string;
    onSelect?: () => void;
    disabled?: boolean;
  }>
>;

export enum BlanksDifficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Extreme = "extreme",
}

export type SlotGrops = Array<{
  type: "char" | "separator" | "prefilled";
  groupId: string;
  slots: Array<{ slotId: string; char: string; index: number }>;
}>;
