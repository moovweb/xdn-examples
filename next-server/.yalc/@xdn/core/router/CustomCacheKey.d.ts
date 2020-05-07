import Groups from './Groups';
interface Config {
    action: string;
    names?: string[];
    groups?: any;
}
declare type GroupCreator = (groups: Groups) => void;
/**
 * Allows you to split or normalize the cache space for a given route. Common use cases include:
 *
 * - serving multiple variants of the same URL based on a currency and/or language cookie.
 * - caching different responses based on device type
 * - ignoring all but a specific set of query parameters when looking up a response from the cache.
 *
 * **Example**
 *
 * ```js
 *  import { Router, CustomCacheKey } from '@xdn/core/router'
 *
 *  new Router()
 *    .match('/some-path', ({ cache }) => {
 *      cache({
 *        edge: {
 *          maxAgeSeconds: 60 * 60,
 *          key: new CustomCacheKey()
 *            .excludeAllQueryParametersExcept('color', 'size')
 *            .addCookie('currency')
 *            .addCookie('location', cookie => {
 *              cookie.group('na').byPattern('us|ca')
 *              cookie.group('eur').byPattern('de|fr|ee')
 *            })
 *        }
 *      })
 *    })
 * ```
 */
export default class CustomCacheKey {
    private config;
    /**
     * Excludes the entire query string from the cache key.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    excludeAllQueryParameters(): this;
    /**
     * Excludes the provided query parameters from the cache key.  All other parameters
     * will still be part of the cache key. We also refer to this as "blacklisting" query parameters.
     * @param {...String} names The names of the query parameters to blacklist
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    excludeQueryParameters(...names: string[]): this;
    /**
     * Excludes all query parameters except those provided from the cache key.  We also refer to
     * this as "whitelisting" query parameters.  We recommend using this method over `excludeQueryParameters`
     * as it's difficult to know all of the query parameters your application might receive and unexpected
     * query parameters can lead to significantly lower cache hit rates.
     * @param {...String} names The names of the query parameters to whitelist
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    excludeAllQueryParametersExcept(...names: string[]): this;
    /**
     * Adds a request header to the cache key.
     * @param {String} name The name of the request header
     * @param {Function} createGroups An function that accepts a `Groups` instance and calls `groups.group(name)` to group multiple values into a single cache key component
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    addHeader(name: string, createGroups?: GroupCreator): this;
    /**
     * Adds the x-xdn-device header.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    addDevice(): this;
    /**
     * Adds the x-xdn-vendor header.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    addVendor(): this;
    /**
     * Adds the x-xdn-device-is-bot header.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    addIsBot(): this;
    /**
     * Adds the x-xdn-browser header.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    addBrowser(): this;
    /**
     * Adds a cookie to the cache key.
     * @param {String} name The name of the cookie
     * @param {Function} createGroups An function that accepts a `Groups` instance and calls `groups.group(name)` to group multiple values into a single cache key component
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    addCookie(name: string, createGroups: GroupCreator): this;
    /**
     * @private
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    addValue(value: string, createGroups?: GroupCreator): this;
    toJSON(): Config[];
}
export {};
