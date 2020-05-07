import { WorkboxPlugin } from 'workbox-core/types';
export interface PrefetcherConfig {
    /**
     * Workbox plugins to use when handling a cacheable route.
     */
    plugins: WorkboxPlugin[];
}
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
export default class Prefetcher {
    private readonly cacheableResponsePlugin;
    private prefetchPlugin;
    private readonly config;
    constructor(config?: PrefetcherConfig);
    /**
     * Adds a fetch event listener that serves content from the cache when available.  When
     * a request is not in the cache, it will be fetched from the network and added to the
     * cache if the route has `browser.serviceWorkerSeconds` defined in its `cache` setting.
     */
    route(): this;
    cache(pattern: RegExp, maxAgeSeconds?: number): this;
    /**
     * Starts listening for messages from the browser
     */
    private initStats;
    /**
     * Creates a workbox route.
     * @param route The route pattern
     * @param maxAgeSeconds The max age
     */
    private createRoute;
    /**
     * Adds self.origin, which contains the protocol, hostname, and port to the route so that
     * workbox's routers will properly match requests
     * @param route A route pattern
     */
    private addOrigin;
}
