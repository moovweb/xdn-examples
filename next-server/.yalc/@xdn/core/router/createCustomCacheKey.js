"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CustomCacheKey_1 = __importDefault(require("./CustomCacheKey"));
/**
 * Returns a DSL for creating custom server cache keys based on cookies, query parameters, and
 * request headers.
 *
 * example:
 *
 * ```js
 *  new Router()
 *    .get('/s/:id',
 *      cache({
 *        edge: {
 *          key: createCustomCacheKey()
 *            .addHeader('user-agent')
 *            .excludeQueryParameters(['uid'])
 *            .addCookie('location', cookie => {
 *              cookie.group('na').byPattern('us|ca')
 *              cookie.group('eur').byPattern('de|fr|ee')
 *            })
 *        }
 *      })
 *    )
 * ```
 * @deprecated Use `new CustomCacheKey()` instead.
 * @return {CustomCacheKey}
 */
function createCustomCacheKey() {
    return new CustomCacheKey_1.default();
}
exports.default = createCustomCacheKey;
