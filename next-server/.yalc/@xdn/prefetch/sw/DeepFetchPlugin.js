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
var cheerio_1 = __importDefault(require("cheerio"));
var prefetch_1 = require("./prefetch");
var log_1 = __importDefault(require("./log"));
/**
 * This plugin deep fetches resources during prefetching based on CSS selectors.
 *
 * ** Example **
 *
 * ```js
 *  import DeepFetchPlugin from '@xdn/prefetch/sw/DeepFetchPlugin'
 *  import { Prefetcher } from '@xdn/prefetch/sw'
 *
 *  new Prefetcher({
 *    plugins: [
 *      new DeepFetchPlugin([
 *        {
 *          selector: 'img.product-main-image,
 *          maxMatches: 1,
 *          as: 'image',
 *          attribute: 'src'
 *        }
 *      ])
 *    ]
 *  })
 * ```
 */
var DeepFetchPlugin = /** @class */ (function () {
    function DeepFetchPlugin(config) {
        this.config = config;
    }
    /**
     * WorkboxPlugin method called every time a fetch succeeds.
     */
    DeepFetchPlugin.prototype.fetchDidSucceed = function (_a) {
        var request = _a.request, response = _a.response;
        return __awaiter(this, void 0, void 0, function () {
            var contentType;
            var _this = this;
            return __generator(this, function (_b) {
                try {
                    contentType = response.headers.get('content-type');
                    if (prefetch_1.isPrefetch(request) && contentType && contentType.toLowerCase().includes('text/html')) {
                        response
                            .clone()
                            .text()
                            .then(function (html) { return _this.deepFetch(html, request.url); });
                    }
                }
                finally {
                    // need to always return the response here, even if there is an error, or the browser will never get a response from the network
                    return [2 /*return*/, response];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Deep fetches elements that match the selectors provided by the user.
     * @param html The document to search
     */
    DeepFetchPlugin.prototype.deepFetch = function (html, srcURL) {
        return __awaiter(this, void 0, void 0, function () {
            var $, matchCount, _loop_1, _a, _b, _c, selector, maxMatches, callback, as, _d, attribute;
            var e_1, _e;
            return __generator(this, function (_f) {
                $ = cheerio_1.default.load(html);
                matchCount = 0;
                _loop_1 = function (selector, maxMatches, callback, as, attribute) {
                    $(selector).each(function (i) {
                        if (maxMatches != null && matchCount >= maxMatches)
                            return;
                        if (this.tagName.toLowerCase() === 'a') {
                            log_1.default('warning', 'Deep fetching of html links is not supported.');
                            return;
                        }
                        var $el = $(this);
                        if (callback) {
                            matchCount++;
                            callback({ $el: $el, el: this, $: $, srcURL: srcURL });
                        }
                        else {
                            var url = $el.attr(attribute);
                            if (url) {
                                matchCount++;
                                prefetch_1.prefetch(url, as);
                            }
                            else {
                                log_1.default("warning: DeepFetchPlugin found an element matching selector " + selector + " which did not have a " + attribute + " attribute.");
                            }
                        }
                    });
                };
                try {
                    for (_a = __values(this.config), _b = _a.next(); !_b.done; _b = _a.next()) {
                        _c = _b.value, selector = _c.selector, maxMatches = _c.maxMatches, callback = _c.callback, as = _c.as, _d = _c.attribute, attribute = _d === void 0 ? 'src' : _d;
                        _loop_1(selector, maxMatches, callback, as, attribute);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return [2 /*return*/];
            });
        });
    };
    return DeepFetchPlugin;
}());
exports.default = DeepFetchPlugin;
