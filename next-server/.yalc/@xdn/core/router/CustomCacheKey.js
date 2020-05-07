"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Groups_1 = __importDefault(require("./Groups"));
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
var CustomCacheKey = /** @class */ (function () {
    function CustomCacheKey() {
        this.config = [];
    }
    /**
     * Excludes the entire query string from the cache key.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.excludeAllQueryParameters = function () {
        this.config.push({ action: 'blacklist-all-query-parameters' });
        return this;
    };
    /**
     * Excludes the provided query parameters from the cache key.  All other parameters
     * will still be part of the cache key. We also refer to this as "blacklisting" query parameters.
     * @param {...String} names The names of the query parameters to blacklist
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.excludeQueryParameters = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        this.config.push({
            action: 'blacklist-some-query-parameters',
            names: names,
        });
        return this;
    };
    /**
     * Excludes all query parameters except those provided from the cache key.  We also refer to
     * this as "whitelisting" query parameters.  We recommend using this method over `excludeQueryParameters`
     * as it's difficult to know all of the query parameters your application might receive and unexpected
     * query parameters can lead to significantly lower cache hit rates.
     * @param {...String} names The names of the query parameters to whitelist
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.excludeAllQueryParametersExcept = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        this.config.push({
            action: 'whitelist-some-query-parameters',
            names: names,
        });
        return this;
    };
    /**
     * Adds a request header to the cache key.
     * @param {String} name The name of the request header
     * @param {Function} createGroups An function that accepts a `Groups` instance and calls `groups.group(name)` to group multiple values into a single cache key component
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.addHeader = function (name, createGroups) {
        return this.addValue("${req:" + name + "}", createGroups);
    };
    /**
     * Adds the x-xdn-device header.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.addDevice = function () {
        return this.addHeader('x-xdn-device');
    };
    /**
     * Adds the x-xdn-vendor header.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.addVendor = function () {
        return this.addHeader('x-xdn-vendor');
    };
    /**
     * Adds the x-xdn-device-is-bot header.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.addIsBot = function () {
        return this.addHeader('x-xdn-device-is-bot');
    };
    /**
     * Adds the x-xdn-browser header.
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.addBrowser = function () {
        return this.addHeader('x-xdn-browser');
    };
    /**
     * Adds a cookie to the cache key.
     * @param {String} name The name of the cookie
     * @param {Function} createGroups An function that accepts a `Groups` instance and calls `groups.group(name)` to group multiple values into a single cache key component
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.addCookie = function (name, createGroups) {
        return this.addValue("${req:cookie:" + name + "}", createGroups);
    };
    /**
     * @private
     * @return {CustomCacheKey} A self-reference, suitable for chaining.
     */
    CustomCacheKey.prototype.addValue = function (value, createGroups) {
        var action = {
            action: 'add-value',
            value: value,
        };
        if (createGroups != null) {
            var groups = new Groups_1.default();
            createGroups(groups);
            action.groups = groups.toJSON();
        }
        this.config.push(action);
        return this;
    };
    CustomCacheKey.prototype.toJSON = function () {
        return this.config;
    };
    return CustomCacheKey;
}());
exports.default = CustomCacheKey;
