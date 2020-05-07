"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addBuiltInRoutes(router) {
    addCacheManifest(router);
}
exports.default = addBuiltInRoutes;
/**
 * Adds /__xdn__/cache-manifest.js, which contains:
 *
 * ```
 *  self.__XDN_CACHE_MANIFEST__ = {
 *    "/some/route": {
 *      browser: {
 *        serviceWorkerSeconds: (number)
 *      },
 *      edge: {
 *        maxAgeSeconds: (number)
 *      }
 *    }
 *  }
 * ```
 *
 * @private
 * @param router
 */
function addCacheManifest(router) {
    router.match('/__xdn__/cache-manifest.js', function (_a) {
        var cache = _a.cache, setResponseHeader = _a.setResponseHeader, send = _a.send;
        cache({
            edge: {
                maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            browser: {
                maxAgeSeconds: 60 * 60,
            },
        });
        setResponseHeader('content-type', 'text/javascript');
        send(function () { return "self.__XDN_CACHE_MANIFEST__=" + JSON.stringify(router.getCachedRoutes()); });
    });
}
