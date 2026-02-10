import { wordCollection } from "./utils/wordCollections";

export type ScoredWord = {
  word: string;
  score: number;
};

export type ScoredWords = ScoredWord[];

export type WordCollections = {
  stopWords: string[];
  weakWords: string[];
  strongWords: string[];
};

export type Options = WordCollections & {
  lang: Lang;
};

export type Lang = keyof typeof wordCollection.STOPWORDS;
