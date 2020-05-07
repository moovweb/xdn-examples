/**
 * Converts a JavaScript Regexp instance to a string compatible with edge.
 * See https://docs.fastly.com/en/guides/vcl-regular-expression-cheat-sheet
 * @param regex
 */
export default function toEdgeRegex(regex: RegExp): string;
