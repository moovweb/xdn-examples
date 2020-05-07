"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var workbox_routing_1 = require("workbox-routing");
var workbox_strategies_1 = require("workbox-strategies");
var workbox_expiration_1 = require("workbox-expiration");
var workbox_cacheable_response_1 = require("workbox-cacheable-response");
var constants_1 = require("../constants");
var log_1 = __importDefault(require("./log"));
var PrefetchPlugin_1 = __importDefault(require("./PrefetchPlugin"));
var messageBrowser_1 = __importDefault(require("./messageBrowser"));
/**
 * Handles prefetching and caching in the the service worker.  Responses
 * are cached based on the `browser.serviceWorkerSeconds` cache setting in your routes.
 *
 * **Example routes.js**
 *
 * ```js
 *  import { Router } from '@xdn/core/router'
 *
 *  module.exports = new Router()
 *    .match('/some/path', ({ cache }) => {
 *      cache({
 *        edge: {
 *          maxAgeSeconds: 60 * 60 * 24 // one day
 *        },
 *        browser: {
 *          serviceWorkerSeconds: 60 * 60 // one hour
 *        }
 *      })
 *    })
 * ```
 *
 * **Example Service Worker**
 *
 * ```js
 *  import { skipWaiting, clientsClaim } from 'workbox-core'
 *  import { Prefetcher } from '@xdn/prefetch/sw'
 *  import { precacheAndRoute } from 'workbox-precaching'
 *
 *  skipWaiting()
 *  clientsClaim()
 *  precacheAndRoute(self.__WB_MANIFEST || [])
 *
 *  new Prefetcher().route()
 * ```
 */
var Prefetcher = /** @class */ (function () {
    function Prefetcher(config) {
        if (config === void 0) { config = { plugins: [] }; }
        this.config = config;
        importScripts('/__xdn__/cache-manifest.js');
        this.cacheableResponsePlugin = new workbox_cacheable_response_1.CacheableResponsePlugin({
            statuses: [200],
        });
        this.prefetchPlugin = this.initStats();
    }
    /**
     * Adds a fetch event listener that serves content from the cache when available.  When
     * a request is not in the cache, it will be fetched from the network and added to the
     * cache if the route has `browser.serviceWorkerSeconds` defined in its `cache` setting.
     */
    Prefetcher.prototype.route = function () {
        var e_1, _a;
        var _b;
        // @ts-ignore
        var manifest = self.__XDN_CACHE_MANIFEST__;
        try {
            for (var manifest_1 = __values(manifest), manifest_1_1 = manifest_1.next(); !manifest_1_1.done; manifest_1_1 = manifest_1.next()) {
                var _c = manifest_1_1.value, route = _c.route, cacheOptions = _c.cacheOptions;
                var maxAgeSeconds = (_b = cacheOptions.browser) === null || _b === void 0 ? void 0 : _b.serviceWorkerSeconds;
                if (maxAgeSeconds > 0) {
                    log_1.default("adding route " + route + ", maxAgeSeconds: " + maxAgeSeconds);
                    this.createRoute(new RegExp(this.addOrigin(route), 'i'), maxAgeSeconds);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (manifest_1_1 && !manifest_1_1.done && (_a = manifest_1.return)) _a.call(manifest_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    Prefetcher.prototype.cache = function (pattern, maxAgeSeconds) {
        if (maxAgeSeconds === void 0) { maxAgeSeconds = 60 * 60 * 24; }
        this.createRoute(pattern, maxAgeSeconds);
        return this;
    };
    /**
     * Starts listening for messages from the browser
     */
    Prefetcher.prototype.initStats = function () {
        var _this = this;
        self.addEventListener('message', function (e) {
            if (e.data.action === 'get-stats') {
                messageBrowser_1.default({
                    type: 'stats',
                    stats: _this.prefetchPlugin.stats,
                });
            }
        });
        return new PrefetchPlugin_1.default();
    };
    /**
     * Creates a workbox route.
     * @param route The route pattern
     * @param maxAgeSeconds The max age
     */
    Prefetcher.prototype.createRoute = function (pattern, maxAgeSeconds) {
        workbox_routing_1.registerRoute(pattern, new workbox_strategies_1.CacheFirst({
            cacheName: constants_1.CACHE_NAME,
            matchOptions: {
                ignoreVary: true,
            },
            plugins: __spread([
                this.cacheableResponsePlugin,
                new workbox_expiration_1.ExpirationPlugin({
                    maxAgeSeconds: maxAgeSeconds,
                }),
                this.prefetchPlugin
            ], (this.config.plugins || [])),
        }));
    };
    /**
     * Adds self.origin, which contains the protocol, hostname, and port to the route so that
     * workbox's routers will properly match requests
     * @param route A route pattern
     */
    Prefetcher.prototype.addOrigin = function (route) {
        return route.replace(/^\^/, "^" + self.origin);
    };
    return Prefetcher;
}());
exports.default = Prefetcher;
