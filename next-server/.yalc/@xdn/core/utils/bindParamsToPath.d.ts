declare const _default: (path: string, params: any) => string;
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
export default _default;
