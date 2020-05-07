"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var prefetch_1 = require("./prefetch");
var registerServiceWorker_1 = require("./registerServiceWorker");
var indicator_1 = __importDefault(require("./indicator"));
var watchLinks_1 = __importDefault(require("./watchLinks"));
/**
 * Installs the service worker, prefetches any URLs specified in `prefetchURLs` and watches
 * all links whose `href` attribute matches one of the specified `prefetchPatterns`.  When
 * a matching link is visible in the viewport, the destination URL will be prefetched and
 * added to the cache.
 * @param options
 */
function install(options) {
    var e_1, _a;
    if (options === void 0) { options = {}; }
    var _b, _c;
    var serviceWorker = navigator.serviceWorker;
    if (typeof serviceWorker === 'undefined') {
        return;
    }
    var prefetchURLs = options.prefetchURLs, _d = options.serviceWorkerPath, serviceWorkerPath = _d === void 0 ? '/service-worker.js' : _d;
    // @ts-ignore
    var cacheManifest = window.__XDN_CACHE_MANIFEST__ || [];
    var prefetchPatterns = __spread((options.prefetchPatterns || []));
    try {
        for (var cacheManifest_1 = __values(cacheManifest), cacheManifest_1_1 = cacheManifest_1.next(); !cacheManifest_1_1.done; cacheManifest_1_1 = cacheManifest_1.next()) {
            var _e = cacheManifest_1_1.value, route = _e.route, cacheOptions = _e.cacheOptions;
            if (((_b = cacheOptions.browser) === null || _b === void 0 ? void 0 : _b.serviceWorkerSeconds) > 0 && ((_c = cacheOptions.edge) === null || _c === void 0 ? void 0 : _c.maxAgeSeconds) > 0) {
                prefetchPatterns.push(new RegExp(route, 'i'));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (cacheManifest_1_1 && !cacheManifest_1_1.done && (_a = cacheManifest_1.return)) _a.call(cacheManifest_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (process.env.DEBUG_SW) {
        document.body.appendChild(indicator_1.default());
    }
    // install the service worker
    registerServiceWorker_1.registerServiceWorker(serviceWorkerPath);
    // prefetch requested URLs
    prefetchURLs === null || prefetchURLs === void 0 ? void 0 : prefetchURLs.forEach(function (url) { return prefetch_1.prefetch(url); });
    // watch links currently in the DOM as well as any links that are added in the future
    watchLinks_1.default(prefetchPatterns);
    serviceWorker.addEventListener('message', function (event) {
        if (event.data.action === 'prefetch') {
            prefetch_1.prefetch(event.data.url, event.data.as);
        }
    });
}
exports.default = install;
