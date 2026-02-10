/**
 * Remove all emojis/picto, accents, punctuations & spaces
 */
export const sanitiseString = (text: string): string => {
  return (
    text
      // 0) remove emojis and pictograms
      .replace(/[\uFE0F\u200D]/g, "") // variantes + ZWJ
      .replace(/\p{Extended_Pictographic}+/gu, " ") // emojis

      // 1) remove accents without changing case
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

      // 2) replace any punctuation with a space
      .replace(/[.,;:!?()[\]{}'"`«»<>\\/|@#$%^&*_+=~–—-]+/g, " ")

      // 3) normalize all types of whitespace into a single space
      .replace(/\s+/g, " ")

      // 4) trim leading and trailing spaces
      .trim()
  );
};

/**
 *
 * @param text
 * @returns Same text with capitals from sentences start lowered
 */
export function lowerSentenceInitialCaps(text: string): string {
  // Unicode letters (supports accents), ignores spaces/quotes after punctuation
  // Capture:
  // 1) prefix: start of string OR end-of-sentence punctuation + spaces/quotes
  // 2) first letter
  // 3) second letter (if present)
  const re = /(^|[.!?…]\s*["'«»()\[\]{}]*\s*)(\p{L})(\p{L})?/gu;

  return text.replace(re, (match, prefix: string, a: string, b?: string) => {
    // if the first letter is not uppercase, leave it unchanged
    if (a !== a.toUpperCase()) return match;

    // if the second letter is also uppercase => acronym / intentional style => leave unchanged
    if (b && b === b.toUpperCase()) return match;

    // otherwise, lowercase the first letter
    return prefix + a.toLowerCase() + (b ?? "");
  });
}
