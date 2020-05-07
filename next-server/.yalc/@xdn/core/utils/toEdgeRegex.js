"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts a JavaScript Regexp instance to a string compatible with edge.
 * See https://docs.fastly.com/en/guides/vcl-regular-expression-cheat-sheet
 * @param regex
 */
function toEdgeRegex(regex) {
    return "" + (regex.ignoreCase ? '(?i)' : '') + regex.source;
}
exports.default = toEdgeRegex;
