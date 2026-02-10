/** Normalizes any iterable/string/null into a string[]. */
export const toArray = (value?: Iterable<string> | string | null): string[] => (typeof value == "string" ? [value] : Array.from(value ?? []));

/** Returns a defensive copy of a Set. */
export const cloneArray = (array: string[]) => [...array];
