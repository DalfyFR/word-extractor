/**
 *  The main package function : extract main words from a text using the current settings
 *
 * @param text - The text to analyse
 * @returns Important words extracted from the input text with or without their scores
 */
export function extractImportantWords(text: string, options: { withScore: true }): ScoredWords;
export function extractImportantWords(text: string, options?: { withScore?: false }): string[];
export function extractImportantWords(text: string, options: { withScore?: boolean } = {}): string[] | ScoredWords {
  const withScore = options.withScore ?? false;
  const textSplitted = text
    .split(" ")
    .filter((e) => e.length > 3)
    .sort((a, b) => a.localeCompare(b));
  const textSplittedWithScores: ScoredWords = textSplitted.map((word) => ({ word, score: word.length }));

  return withScore ? textSplittedWithScores : textSplitted;
}
