import { extractImportantWords } from "./wordExtraction";
import type { Lang, Options, ScoredWord, ScoredWords, WordCollections } from "./types";
import { cloneArray, toArray } from "./utils/array";
import { sanitiseString } from "./utils/string";
import { wordCollection } from "./utils/wordCollections";

export * as TYPES from "./types";

/** Traitement à appliquer avant de stocker un mot dans les Arrays de comparaison */
const processWord = (word: string) => sanitiseString(word).toLowerCase();

/**
 * Word extractor client.
 * Keeps stop/weak/strong word sets private and exposes safe getters (copies).
 */
export class wordExctractorClient {
  private options: Options = { lang: "en", stopWords: [], weakWords: [], strongWords: [] };

  constructor(options: Partial<Options> = {}) {
    this.options.lang = options.lang ?? "fr";

    this.options.stopWords = toArray(options.stopWords ?? wordCollection.STOPWORDS[this.options.lang]).map((word) => processWord(word));
    this.options.weakWords = toArray(options.weakWords ?? wordCollection.WEAK_WORDS[this.options.lang]).map((word) => processWord(word));
    this.options.strongWords = toArray(options.strongWords ?? wordCollection.STRONG_WORDS[this.options.lang]).map((word) => processWord(word));
  }

  // -----------------------
  // Safe getters (copies)
  // -----------------------

  /** Returns a copy of the current stop words array. */
  public getStopWords(): string[] {
    return cloneArray(this.options.stopWords ?? []);
  }

  /** Returns a copy of the current weak words array. */
  public getWeakWords(): string[] {
    return cloneArray(this.options.weakWords ?? []);
  }

  /** Returns a copy of the current strong words array. */
  public getStrongWords(): string[] {
    return cloneArray(this.options.strongWords ?? []);
  }

  // -----------------------
  // Stop words: add / replace
  // -----------------------

  /**
   * Adds stop words to the existing array (merge behavior).
   * @param words Words to add.
   */
  public addStopWords(words: Iterable<string> | string) {
    const array = this.options.stopWords ?? [];
    for (const w of toArray(words).map((word) => processWord(word))) array.push(w);
    return this;
  }

  /**
   * Replaces the whole stop words array (overwrite behavior).
   * @param words New stop words.
   */
  public replaceStopWords(words: Iterable<string> | string) {
    this.options.stopWords = toArray(words).map((word) => processWord(word));
    return this;
  }

  // -----------------------
  // weak words: add / replace
  // -----------------------

  /**
   * Adds weak words to the existing array (merge behavior).
   * @param words Words to add.
   */
  public addWeakWords(words: Iterable<string> | string) {
    const array = this.options.weakWords ?? [];
    for (const w of toArray(words).map((word) => processWord(word))) array.push(w);
    return this;
  }

  /**
   * Replaces the whole weak words array (overwrite behavior).
   * @param words New weak words.
   */
  public replaceWeakWords(words: Iterable<string> | string) {
    this.options.stopWords = toArray(words).map((word) => processWord(word));
    return this;
  }

  // -----------------------
  // strong words: add / replace
  // -----------------------

  /**
   * Adds strong words to the existing array (merge behavior).
   * @param words Words to add.
   */
  public addStrongWords(words: Iterable<string> | string) {
    const array = this.options.strongWords ?? [];
    for (const w of toArray(words).map((word) => processWord(word))) array.push(w);
    return this;
  }

  /**
   * Replaces the whole strong words array (overwrite behavior).
   * @param words New strong words.
   */
  public replaceStrongWords(words: Iterable<string> | string) {
    this.options.stopWords = toArray(words).map((word) => processWord(word));
    return this;
  }

  // -----------------------
  // Lang setter
  // -----------------------
  /** Set the lang of the word extractor. /!\ Reset the words collections ! */
  public setLang(lang: Lang): this {
    this.options.lang = lang;
    this.options.stopWords = toArray(wordCollection.STOPWORDS[this.options.lang]).map((word) => processWord(word));
    this.options.weakWords = toArray(wordCollection.WEAK_WORDS[this.options.lang]).map((word) => processWord(word));
    this.options.strongWords = toArray(wordCollection.STRONG_WORDS[this.options.lang]).map((word) => processWord(word));
    return this;
  }

  // -----------------------
  // Main API
  // -----------------------

  /**
   * Extracts important words from a text using the client's configured options.
   * @param text Input text.
   * @param options Extraction options (forwarded to extractImportantWords).
   */
  public extractImportantWords(text: string, options: { withScore: true; maxWords?: number }): ScoredWords;
  public extractImportantWords(text: string, options?: { withScore?: false; maxWords?: number }): string[];
  public extractImportantWords(text: string, options?: { withScore?: boolean; maxWords?: number }): string[] | ScoredWords {
    const wordCollections: WordCollections = {
      stopWords: this.options.stopWords ?? [],
      weakWords: this.options.weakWords ?? [],
      strongWords: this.options.strongWords ?? [],
    };

    if (options?.withScore === true) {
      return extractImportantWords(text, {
        ...wordCollections,
        ...options,
        withScore: true, // <- force le littéral true pour typer le retour correctement
      });
    }

    return extractImportantWords(text, {
      ...wordCollections,
      ...options,
      withScore: false, // <- force le littéral false pour typer le retour correctement
    });
  }
}

export default wordExctractorClient;
