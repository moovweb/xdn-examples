"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var url_1 = require("url");
var fs_1 = __importDefault(require("fs"));
var mime_types_1 = __importDefault(require("mime-types"));
var bindParamsToPath_1 = __importDefault(require("../utils/bindParamsToPath"));
var config_1 = __importDefault(require("../config"));
var Backend_1 = __importDefault(require("./Backend"));
var isString_1 = __importDefault(require("lodash/isString"));
var stream_1 = __importDefault(require("./stream"));
var constants_1 = require("../constants");
var environment_1 = require("../environment");
var validateWriter_1 = require("./validateWriter");
var unzip_1 = __importDefault(require("../utils/unzip"));
/**
 * @private
 * Having a no-op BaseResponseWriter makes it easy for us to stub out the writer
 * when introspecing the router.  This is needed to implement Router.getPrefetchableRoutes
 */
var BaseResponseWriter = /** @class */ (function () {
    function BaseResponseWriter(req, res, route) {
    }
    BaseResponseWriter.prototype.cache = function (options) { };
    BaseResponseWriter.prototype.redirect = function (to, statusCode) { };
    BaseResponseWriter.prototype.proxy = function (backend, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    BaseResponseWriter.prototype.render = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    BaseResponseWriter.prototype.stream = function (backend) { };
    BaseResponseWriter.prototype.serveStatic = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    BaseResponseWriter.prototype.setResponseHeader = function (name, value) { };
    BaseResponseWriter.prototype.updateResponseHeader = function (name, match, replace) { };
    BaseResponseWriter.prototype.removeResponseHeader = function (name) { };
    BaseResponseWriter.prototype.setRequestHeader = function (name, value) { };
    BaseResponseWriter.prototype.updateRequestHeader = function (name, match, replace) { };
    BaseResponseWriter.prototype.removeRequestHeader = function (name) { };
    BaseResponseWriter.prototype.send = function (content, statusCode, statusMessage) { };
    return BaseResponseWriter;
}());
exports.BaseResponseWriter = BaseResponseWriter;
/**
 * The API that is provided to route callbacks.
 */
var ResponseWriter = /** @class */ (function (_super) {
    __extends(ResponseWriter, _super);
    /**
     * @param req The request
     * @param res The response
     * @param route The route
     * @param defaultBackend The default backend for proxy when none is provided
     */
    function ResponseWriter(req, res, route) {
        var _this = _super.call(this, req, res, route) || this;
        _this.params = {}; // Merged/All params
        /**
         * Redirects the browser to a new location.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/p/:productId', ({ redirect }) => {
         *      return redirect('/products/{productId}', 301)
         *    })
         * ```
         *
         * @param to The URL to which the browser will be redirected.
         * @param statusCode The HTTP status to return.  Defaults to 301
         */
        _this.redirect = function (to, statusCode) {
            if (statusCode === void 0) { statusCode = 302; }
            _this._sendResponse = function () {
                _this.response.writeHead(statusCode, {
                    location: bindParamsToPath_1.default(to, _this.params),
                });
                _this.response.end();
            };
        };
        /**
         * Relays the request to the specified backend.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/some/path/with/:variable', ({ proxy }) => {
         *      return proxy('legacy', { path: '/some/other/path/with/{variable}' })
         *    })
         * ```
         *
         * In this example, we relay the request to the "legacy" backend. In this case, `xdn.config.js` must
         * contain a definition for the `legacy` backend.  For example:
         *
         * ```
         *  // xdn.config.js
         *
         *  module.exports = {
         *    backends: {
         *      legacy: {
         *        domainOrIp: 'legacy.domain.com',
         *        hostHeader: 'domain.com'
         *      }
         *    }
         *  }
         * ```
         *
         * @param backend The name of one of the backends in your `xdn.config.js` file.
         * @param options
         * @returns A promise the resolves once the response has been fetched from the upstream site.
         */
        _this.proxy = function (backend, options) { return __awaiter(_this, void 0, void 0, function () {
            var backendConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        backendConfig = config_1.default.get("backends." + backend);
                        return [4 /*yield*/, this.proxyHost(backendConfig, options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Call render callback
         * @param cb Render callback function
         */
        _this.render = function (cb) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cb(this.request, this.proxy, this.params)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Streams the result from a backend.  Can only be used in development for things
         * like hot-module reloading.
         * @param backend The name of the backend to connect to
         * @private
         */
        _this.stream = function (backend) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('stream can only be used in development');
            }
            var backendConfig = normalizeBackendConfig(config_1.default.get("backends." + backend));
            stream_1.default(_this.request, _this.response, backendConfig, Function.prototype);
            _this._sendResponse = Function.prototype; // to prevent the router from continuing on to the next route
        };
        /**
         * Proxies the response from a given host
         * @private
         * @param backendConfig The backend config
         * @param options
         */
        _this.proxyHost = function (backendConfig, _a) {
            var _b = _a === void 0 ? {} : _a, path = _b.path, transformResponse = _b.transformResponse;
            return __awaiter(_this, void 0, void 0, function () {
                var backend, e_1;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            backendConfig = normalizeBackendConfig(backendConfig);
                            console.log('backendConfig', backendConfig);
                            backend = new Backend_1.default(backendConfig);
                            path = path ? bindParamsToPath_1.default(path, this.params) : this.request.url;
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 5, 6, 7]);
                            return [4 /*yield*/, backend.fetch(this.request, this.response, {
                                    path: path,
                                    disableCheckCert: backendConfig.disableCheckCert,
                                })];
                        case 2:
                            _c.sent();
                            if (!transformResponse) return [3 /*break*/, 4];
                            unzip_1.default(this.response);
                            return [4 /*yield*/, transformResponse(this.response)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            e_1 = _c.sent();
                            if (e_1.type === 'BackendFetchError') {
                                // will get here when there is a connection error with the backend
                                console.error("Could not connect to backend " + backendConfig.domainOrIp + ":", e_1.message);
                                this.response.statusCode = 503;
                            }
                            else {
                                console.error('Error in ResponseWriter:', e_1.message);
                                this.response.statusCode = 500;
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            this._sendResponse = function () {
                                _this.response.writeHead(_this.response.statusCode || 200);
                                _this.response.end(_this.response.body);
                            };
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Responds with a static asset from the specified path.
         *
         * **Example**
         *
         * ```js
         * serveStatic('path/to/asset/from/app/root')
         * ```
         *
         * You can also use variables in the asset path.  For example, to return files under the `assets` directory
         * when the url starts with `/static`:
         *
         * ```
         *  new Router()
         *    .match('/static/*path', ({ serveStatic }) => {
         *      return serveStatic('assets/{path}')
         *    })
         * ```
         *
         * @param path The relative path to the asset from the app's root directory. You can reference path variables using `{variable}`.
         * @returns A promise the resolves once the asset has been fetched from storage.
         */
        _this.serveStatic = function (path) { return __awaiter(_this, void 0, void 0, function () {
            var filePath, stat, contentType;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path && bindParamsToPath_1.default(path, this.params);
                        if (!environment_1.isCloud()) return [3 /*break*/, 2];
                        // AWS
                        // Static assets are stored in s3 in production, so we just need to proxy
                        // s3 for all of the correct headers to be sent and the correct file to be served.
                        return [4 /*yield*/, this.proxyHost(config_1.default.get("backends." + constants_1.BACKENDS.static), {
                                path: filePath,
                            })];
                    case 1:
                        // AWS
                        // Static assets are stored in s3 in production, so we just need to proxy
                        // s3 for all of the correct headers to be sent and the correct file to be served.
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        stat = fs_1.default.statSync(filePath);
                        contentType = mime_types_1.default.lookup(filePath);
                        if (contentType) {
                            this.setResponseHeader('Content-Type', contentType);
                        }
                        this.setResponseHeader('Content-Length', stat.size.toString());
                        // @ts-ignore
                        this._sendResponse = function () { return fs_1.default.createReadStream(filePath).pipe(_this.response); };
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Sets the caching behavior for both browser and edge.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/p/:productId', ({ cache, proxy }) => {
         *      cache({
         *        browser: {
         *          maxAgeSeconds: 0,
         *          serviceWorkerSeconds: 60 * 60, // 1 hour
         *        },
         *        edge: {
         *          maxAgeSeconds: 60 * 60 * 24 // 24 hours
         *          staleWhileRevalidateSeconds: 60 * 60 // 1 hour
         *        }
         *      })
         *      return proxy('origin')
         *    })
         * ```
         *
         * The `cache()` method can be called in the same route where the response is sent, or any prior route.  For example,
         * with Next.js, it is common to use the next plugin to automatically inherit page routes based on Next.js conventions,
         * and use the XDN router simply to add caching:
         *
         * ```
         *  import { Router } = from '@xdn/core/router'
         *  import { createNextPlugin } from '@xdn/next'
         *
         *  const { nextMiddleware, renderNext } = createNextPlugin()
         *
         *  new Router()
         *    .match('/p/:productId', ({ cache, proxy }) => {
         *      cache({
         *        browser: {
         *          maxAgeSeconds: 0,
         *          serviceWorkerSeconds: 60 * 60, // 1 hour
         *        },
         *        edge: {
         *          maxAgeSeconds: 60 * 60 * 24 // 24 hours
         *          staleWhileRevalidateSeconds: 60 * 60 // 1 hour
         *        }
         *      })
         *      return proxy('origin')
         *    })
         *    .use(nextMiddleware)
         * ```
         */
        _this.cache = function (options) {
            var browser = options.browser, edge = options.edge;
            if (edge) {
                var maxAgeSeconds = edge.maxAgeSeconds, staleWhileRevalidateSeconds = edge.staleWhileRevalidateSeconds;
                var value = [];
                if (maxAgeSeconds) {
                    value.push('max-age=' + maxAgeSeconds);
                    if (staleWhileRevalidateSeconds) {
                        value.push('stale-while-revalidate=' + staleWhileRevalidateSeconds);
                    }
                }
                if (value.length) {
                    _this.unsafeSetResponseHeader('x-xdn-cache-control', value.join(', '), false);
                }
            }
            if (browser) {
                var maxAgeSeconds = browser.maxAgeSeconds, serviceWorkerSeconds = browser.serviceWorkerSeconds;
                if (maxAgeSeconds === 0) {
                    _this.setResponseHeader('cache-control', 'private, no-store, no-cache');
                }
                else if (maxAgeSeconds) {
                    // Here we use "private" instead of "public" to prevent downstream CDNs from caching the asset
                    // Since we already have an explicit way to cache at edge, we choose to keep browser and edge
                    // caching totally separate.
                    _this.setResponseHeader('cache-control', "private, max-age=" + maxAgeSeconds);
                }
                if (serviceWorkerSeconds) {
                    _this.setResponseHeader('x-sw-cache-control', "max-age=" + serviceWorkerSeconds);
                }
            }
        };
        /**
         * Adds or replaces a response header.
         * This method should be called after `proxy`.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/some/path', async ({ setResponseHeader, proxy }) => {
         *      await proxy('origin')
         *      setResponseHeader('some-header', 'some-value')
         *    })
         * ```
         *
         * @param name The case-insensitive name of the response header
         * @param value The value to set
         */
        _this.setResponseHeader = function (name, value) {
            _this.unsafeSetResponseHeader(name, value);
        };
        /**
         * @private
         */
        _this.unsafeSetResponseHeader = function (name, value, validate) {
            if (validate === void 0) { validate = true; }
            if (validate) {
                validateWriter_1.validateSetResponseHeader(name);
            }
            _this.response.setHeader(name, bindParamsToPath_1.default(value.toString(), _this.params));
        };
        /**
         * Alters a response header. Use this method to derive the new header value from the existing one.
         * This method should be called after `proxy`.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/some/path', async ({ updateResponseHeader, proxy }) => {
         *      await proxy('origin')
         *      updateResponseHeader('some-header', /some-.*-part/gi, 'some-replacement')
         *    })
         * ```
         *
         * @param name The case-insensitive name of the response header
         * @param match Regex to find the part that should be replaced.
         * @param replace Value that will replace the matched part.
         */
        _this.updateResponseHeader = function (name, match, replace) {
            validateWriter_1.validateUpdateResponseHeader(name);
            var currentValue = _this.response.getHeader(name);
            if (currentValue) {
                _this.response.setHeader(name, currentValue.replace(match, replace));
            }
        };
        /**
         * Removes a response header. This method should be called after `proxy`.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/some/path', async ({ removeResponseHeader, proxy }) => {
         *      await proxy('origin')
         *      removeResponseHeader('some-header')
         *    })
         * ```
         * @param name The case-insensitive name of the response header
         */
        _this.removeResponseHeader = function (name) {
            validateWriter_1.validateRemoveResponseHeader(name);
            _this.response.removeHeader(name);
        };
        /**
         * Adds or replaces a request header.
         * This method should be called before `proxy`.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/some/path', async ({ setRequestHeader, proxy }) => {
         *      setRequestHeader('some-header', 'some-value')
         *      await proxy('origin')
         *    })
         * ```
         *
         * @param name The case-insensitive name of the request header
         * @param value The value to set
         */
        _this.setRequestHeader = function (name, value) {
            validateWriter_1.validateSetRequestHeader(name);
            _this.request.headers[name.toLowerCase()] = value;
        };
        /**
         * Alters a request header. Use this method to derive the new header value from the existing one.
         * This method should be called before `proxy`.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/some/path', async ({ updateRequestHeader, proxy }) => {
         *      updateRequestHeader('some-header', /some-.*-part/gi, 'some-replacement')
         *      await proxy('origin')
         *    })
         * ```
         *
         * @param name The case-insensitive name of the request header
         * @param match Regex to find the part that should be replaced.
         * @param replace Value that will replace the matched part.
         */
        _this.updateRequestHeader = function (name, match, replace) {
            validateWriter_1.validateUpdateRequestHeader(name);
            var key = name.toLowerCase();
            var currentValue = _this.request.headers[key];
            if (Array.isArray(currentValue)) {
                _this.request.headers[key] = currentValue.map(function (v) { return v.replace(match, replace); });
            }
            else if (currentValue) {
                _this.request.headers[key] = currentValue.replace(match, replace);
            }
        };
        /**
         * Removes a request header.
         * This method should be called before `proxy`.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/some/path', async ({ removeRequestHeader, proxy }) => {
         *      removeRequestHeader('some-header')
         *      await proxy('origin')
         *    })
         * ```
         * @param name The case-insensitive name of the request header
         */
        _this.removeRequestHeader = function (name) {
            validateWriter_1.validateRemoveRequestHeader(name);
            delete _this.request.headers[name.toLowerCase()];
        };
        /**
         * Sends content back to client. If content is a string, the respons will be sent
         * directly from the edge. If it is a function, the request will be computed by a JavaScript worker.
         *
         * **Example**
         *
         * ```
         *  new Router()
         *    .match('/some/path', ({ send }) => {
         *      return send('<html><body>Hello World!</body></html>', 200, 'OK')
         *    })
         * ```
         * @param content The response body as a string
         * @param statusCode The status to send
         * @param statusMessage The status message to send
         */
        _this.send = function (content, statusCode, statusMessage) {
            if (statusCode === void 0) { statusCode = 200; }
            _this._sendResponse = function () {
                _this.response.writeHead(statusCode, statusMessage);
                if (typeof content === 'function') {
                    content = content();
                }
                _this.response.end(content);
            };
        };
        /**
         * Send json error response to client
         * @private
         * @param err
         */
        _this.onRouteError = function (err) {
            var errorResponse = {
                status: 'error',
                message: err.message,
            };
            if (process.env.NODE_ENV !== 'production') {
                errorResponse = {
                    message: "An error occured while running route " + _this.route.toString() + ": " + err.message,
                    stack: err.stack,
                    url: _this.request.url,
                    route: {
                        handler: _this.route.handler.toString(),
                        criteria: _this.route.criteria,
                    },
                };
            }
            try {
                _this.response.writeHead(500);
                _this.response.end(JSON.stringify(errorResponse));
            }
            catch (e) {
                console.log("Could not write error response because headers have already been sent.", errorResponse);
            }
        };
        _this.request = req;
        _this.response = res;
        _this.route = route;
        _this.routeParams = _this.route.match(_this.request);
        _this.queryParams = url_1.parse(_this.request.url, true).query;
        // Merge query and route params to params
        _this.params = __assign(__assign({}, _this.queryParams), _this.routeParams);
        return _this;
    }
    /**
     * Called at the end of the request to send the response back to the browser. Methods like proxy,
     * serveStatic, and render will replace this method with one that actually sends a response.
     * @private
     * @returns True if there send response was defined and invoked, otherwise false.
     */
    ResponseWriter.prototype.sendResponse = function () {
        if (!this._sendResponse) {
            return false;
        }
        this._sendResponse();
        return true;
    };
    return ResponseWriter;
}(BaseResponseWriter));
exports.default = ResponseWriter;
/**
 * @private
 * @param backendConfig
 */
function normalizeBackendConfig(backendConfig) {
    if (isString_1.default(backendConfig))
        backendConfig = { domainOrIp: backendConfig };
    return backendConfig;
}
