"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Binds params to path.
 *
 * Example:
 * ```js
 * bindParamsToPath('/{param1}/{param2}', { param1: 'p1', param2: 'p2' })
 * ```
 * Output: `/p1/p2`
 *
 * @param path The path, with param substitutions in braces `{}`.
 * @param params An object with keys matching the params in braces.
 * @returns A string with the params substituted with their values.
 */
exports.default = (function (path, params) {
    var p = path;
    var _loop_1 = function (paramName) {
        p = p.replace(new RegExp("(^|[^\\\\]){" + paramName + "}", 'g'), function (match, capture) { return "" + capture + params[paramName]; });
    };
    for (var paramName in params) {
        _loop_1(paramName);
    }
    return p;
});
