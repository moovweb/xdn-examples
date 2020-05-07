"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var log_1 = __importDefault(require("./log"));
var Stats = /** @class */ (function () {
    function Stats() {
        this.hits = 0;
        this.misses = 0;
    }
    return Stats;
}());
exports.Stats = Stats;
var originHostname = new URL(self.origin).hostname;
var PrefetchPlugin = /** @class */ (function () {
    function PrefetchPlugin() {
        this.stats = new Stats();
    }
    /**
     * Called when an object is read from or written to the cache.  Here we
     * compute cache stats and ensure that ?__prefetch__ is removed from the cache key so
     * that future requests for prefetched resources will match.
     */
    PrefetchPlugin.prototype.cacheKeyWillBeUsed = function (_a) {
        var request = _a.request, mode = _a.mode;
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_b) {
                url = new URL(request.url);
                if (!url.searchParams.has(constants_1.PREFETCH_QUERY_PARAM)) {
                    if (mode === 'read') {
                        this.stats.hits++;
                    }
                    else {
                        this.stats.misses++;
                    }
                }
                if (mode === 'read') {
                    // read
                    return [2 /*return*/, request];
                }
                else {
                    // write
                    return [2 /*return*/, this.convertPrefetchQueryParamToHeader(request, url)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Called when the service worker fetches a response from the network. Here we
     * remove ?__prefetch__=1 and add the x-xdn-prefetch header.
     */
    PrefetchPlugin.prototype.requestWillFetch = function (_a) {
        var request = _a.request;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.convertPrefetchQueryParamToHeader(request, new URL(request.url))];
            });
        });
    };
    /**
     * Called when a response is about to be written to the cache.
     */
    PrefetchPlugin.prototype.cacheWillUpdate = function (_a) {
        var response = _a.response;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                // Service workers do not handle redirects well. If a redirected response is put in the cache,
                // you'll see this error: "a ServiceWorker passed a redirected Response to FetchEvent.respondWith()
                // while RedirectMode is not ‘follow"
                // Returning null here prevents the response from being cached
                if (response.redirected) {
                    log_1.default(response.url + " was not added to the cache because it was a redirect.");
                    return [2 /*return*/, null];
                }
                else {
                    log_1.default(response.url + " was added to the cache.");
                    return [2 /*return*/, response];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * If the __prefetch__ query param is present, clones the request, removing the __prefetch__ query param if present and adding
     * an x-xdn-prefetch request header. We do this so that:
     * 1.) The resulting cached response will match future requests
     * 2.) The XDN can choose not to respond to prefetch events if the result is not in the cache.
     *
     * If the __prefetch__ query param is not present, the original request is returned.
     *
     * @param srcRequest The request to clone
     * @returns A clone of the srcRequest
     */
    PrefetchPlugin.prototype.convertPrefetchQueryParamToHeader = function (srcRequest, url) {
        var headers = new Headers(srcRequest.headers);
        // convert `?__prefetch__` to `x-xdn-prefetch: 1` header
        if (url.searchParams.has(constants_1.PREFETCH_QUERY_PARAM)) {
            log_1.default("prefetching " + url.toString());
            url.searchParams.delete(constants_1.PREFETCH_QUERY_PARAM);
            if (originHostname === url.hostname) {
                headers.set(constants_1.PREFETCH_HEADER_NAME, constants_1.PREFETCH_HEADER_VALUE);
            }
            return new Request(url.toString(), {
                headers: headers,
                body: srcRequest.body,
                redirect: srcRequest.redirect,
            });
        }
        else {
            return srcRequest;
        }
    };
    return PrefetchPlugin;
}());
exports.default = PrefetchPlugin;
