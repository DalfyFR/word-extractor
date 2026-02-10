import { Options, ScoredWords, WordCollections } from "./types";
import { lowerSentenceInitialCaps, sanitiseString } from "./utils/string";

/**
 *  The main package function : extract main words from a text using the current settings
 *
 * @param text - The text to analyse
 * @returns Important words extracted from the input text with or without their scores
 */
export function extractImportantWords(text: string, options: WordCollections & { withScore: true } & { maxWords?: number }): ScoredWords;
export function extractImportantWords(text: string, options: WordCollections & { withScore?: false } & { maxWords?: number }): string[];
export function extractImportantWords(
  text: string,
  options: WordCollections & { withScore?: boolean } & { maxWords?: number },
): string[] | ScoredWords {
  // Sanitaze and cut the input text + lowerCase the first letter (if second isn't upper) to avoid capital letter missinterpretation + remove stop words & invalids
  const withOutCapsText = lowerSentenceInitialCaps(text);
  const sanitizedText = sanitiseString(withOutCapsText);
  const inputWords = sanitizedText
    .split(" ")
    .map((w) => w.trim())
    .filter(Boolean)
    .filter((w) => /[\p{L}\p{N}]/u.test(w))
    .filter((w) => !options.stopWords?.includes(w.toLowerCase()));

  // Scoring words & removing the scores <= 0
  const scoredInputWords: ScoredWords = inputWords.map((word) => ({ word, score: scoreWord(word, options) })).filter((word) => word.score > 0);
  // Aggregate the identique words and add 1 score point per occurences
  const aggregatedScoredWords: ScoredWords = aggregateByWord(scoredInputWords).sort((a, b) => b.score - a.score);
  // Limiting the results with input option
  const returnList = options.maxWords ? aggregatedScoredWords.slice(0, options.maxWords) : aggregatedScoredWords;

  // Returning the result with or without score depending of the input options
  return options.withScore ? returnList : returnList.map((sw) => sw.word);
}

const scoreWord = (word: string, options: WordCollections) => {
  let score = 0;
  const lowerCaseWord = word.toLowerCase();
  // is a strong word
  if (options.strongWords?.includes(lowerCaseWord)) score += 3;
  // is a weak word
  if (options.weakWords?.includes(lowerCaseWord)) score -= 2;
  // has a capital first letter
  if (word[0]?.toUpperCase() === word[0]) score += 2;
  // is fully uppercase + boost numbers
  if (word.toUpperCase() === word) score += 2;
  // length ponderation (1 point every 4 letters, 3 pts max)
  score += Math.min(3, Math.floor(word.length / 5));
  console.log(word, score);

  return score;
};

function aggregateByWord(items: { word: string; score: number }[]) {
  const map = new Map<string, { maxScore: number; count: number }>();

  for (const { word, score } of items) {
    const lcWord = word.toLowerCase();
    const current = map.get(lcWord) ?? { maxScore: 0, count: 0 };

    map.set(lcWord, {
      maxScore: Math.max(current.maxScore, score),
      count: current.count + 1,
    });
  }

  return Array.from(map, ([word, { maxScore, count }]) => ({
    word,
    score: maxScore + (count - 1), // +1 par occurrence supplémentaire
  }));
}
