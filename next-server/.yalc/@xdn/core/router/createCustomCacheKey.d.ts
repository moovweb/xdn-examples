import CustomCacheKey from './CustomCacheKey';
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
export default function createCustomCacheKey(): CustomCacheKey;
