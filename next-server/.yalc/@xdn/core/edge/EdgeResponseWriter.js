"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var convertParamsToBackReferences_1 = __importDefault(require("../utils/convertParamsToBackReferences"));
var constants_1 = require("../constants");
var routeToRegex_1 = __importDefault(require("../utils/routeToRegex"));
var validateWriter_1 = require("../router/validateWriter");
/**
 * A substitute implementation of `ResponseWriter` that creates the contents of `xdn.json`, which
 * is used to generate edge code.
 */
var EdgeResponseWriter = /** @class */ (function () {
    /**
     * @param req The `HttpRequest` object
     * @param res The `HttpResponse` object
     * @param route The route being hit
     * @param defaultBackend The default backend for proxy when none is provided
     */
    function EdgeResponseWriter(_req, _res, route) {
        var _this = this;
        // Many of the methods such as updateRequestHeader assume transform.request
        // and transform.response are initialized to empty arrays by the constructor.
        this.stream = function () { };
        this.setRequestHeader = function (name, value) {
            validateWriter_1.validateSetRequestHeader(name);
            _this.edgeConfig.transform.request.push({
                action: constants_1.ACTIONS.setHeader,
                name: name,
                value: value,
            });
        };
        this.updateRequestHeader = function (name, match, replace) {
            validateWriter_1.validateUpdateRequestHeader(name);
            _this.edgeConfig.transform.request.push({
                action: constants_1.ACTIONS.updateHeader,
                name: name,
                valueRegex: match.source,
                replaceValue: replace,
            });
        };
        this.removeRequestHeader = function (name) {
            validateWriter_1.validateRemoveRequestHeader(name);
            _this.edgeConfig.transform.request.push({
                action: constants_1.ACTIONS.removeHeader,
                name: name,
            });
        };
        this.setResponseHeader = function (name, value) {
            validateWriter_1.validateSetResponseHeader(name);
            _this.edgeConfig.transform.response.push({
                action: constants_1.ACTIONS.setHeader,
                name: name,
                value: value,
            });
        };
        this.updateResponseHeader = function (name, match, replace) {
            validateWriter_1.validateUpdateResponseHeader(name);
            _this.edgeConfig.transform.response.push({
                action: constants_1.ACTIONS.updateHeader,
                name: name,
                valueRegex: match.source,
                replaceValue: replace,
            });
        };
        this.removeResponseHeader = function (name) {
            validateWriter_1.validateRemoveResponseHeader(name);
            _this.edgeConfig.transform.response.push({
                action: constants_1.ACTIONS.removeHeader,
                name: name,
            });
        };
        /**
         * Sends a redirect from the edge
         * @param to The destination URL
         * @param statusCode The http response status.
         */
        this.redirect = function (to, statusCode) {
            if (statusCode === void 0) { statusCode = 302; }
            _this.edgeConfig.route = { action: constants_1.ACTIONS.syntheticRes, statusCode: statusCode };
            _this.edgeConfig.transform.response.push({
                action: constants_1.ACTIONS.setHeader,
                name: 'location',
                value: '{path}',
            }, {
                action: constants_1.ACTIONS.updateHeader,
                name: 'location',
                valueRegex: routeToRegex_1.default(_this.route),
                replaceValue: convertParamsToBackReferences_1.default(_this.route.matcher, to),
            });
        };
        /**
         * Serves static assets.
         * @param path The request path
         */
        this.serveStatic = function (path) {
            if (path && !path.startsWith('/'))
                path = "/" + path;
            _this.proxy(constants_1.BACKENDS.static, { path: path });
        };
        /**
         * Proxies from the edge
         * @param backend
         * @param config
         * @param config.path
         */
        this.proxy = function (backend, _a) {
            var _b = _a === void 0 ? {} : _a, path = _b.path, transformResponse = _b.transformResponse;
            if (transformResponse != null)
                backend = constants_1.BACKENDS.js;
            _this.edgeConfig.route = { action: constants_1.ACTIONS.proxy, backend: backend, fsPath: path };
            if (path) {
                _this.edgeConfig.transform.request.push({
                    action: constants_1.ACTIONS.updatePath,
                    valueRegex: routeToRegex_1.default(_this.route),
                    replaceValue: convertParamsToBackReferences_1.default(_this.route.matcher, path),
                });
            }
        };
        /**
         * Creates the edge cache config
         * @param config
         */
        this.cache = function (config) {
            var edge = config.edge, browser = config.browser;
            if (edge) {
                var key = edge.key, maxAgeSeconds = edge.maxAgeSeconds, staleWhileRevalidateSeconds = edge.staleWhileRevalidateSeconds;
                _this.edgeConfig.cache = { maxAgeSeconds: maxAgeSeconds, staleWhileRevalidateSeconds: staleWhileRevalidateSeconds };
                if (key) {
                    _this.edgeConfig.cache.customKey = key.toJSON();
                }
            }
            if (browser === null || browser === void 0 ? void 0 : browser.maxAgeSeconds) {
                _this.edgeConfig.transform.response.push({
                    action: constants_1.ACTIONS.setHeader,
                    name: 'Cache-Control',
                    // Here we use "private" instead of "public" to prevent downstream CDNs from caching the asset
                    // Since we already have an explicit way to cache at edge, we choose to keep browser and edge
                    // caching totally separate.
                    value: "private, max-age=" + browser.maxAgeSeconds,
                });
            }
        };
        /**
         * Sends string content back to client. If content is a string, the response will be sent
         * directly from the edge. If it is a function, the request will be computed by a JavaScript worker.
         * @param content The content to send to the browser
         * @param statusCode The HTTP status code
         * @param statusMessage The HTTP status message
         */
        this.send = function (content, statusCode, statusMessage) {
            if (statusCode === void 0) { statusCode = 200; }
            if (typeof content === 'function') {
                _this.render();
            }
            else {
                _this.edgeConfig.route = {
                    action: constants_1.ACTIONS.syntheticRes,
                    statusCode: statusCode,
                    statusMessage: statusMessage,
                    content: content,
                };
            }
        };
        /**
         * Passes request and response to the specified callback, which should
         * handle rendering the response as a string
         */
        this.render = function () {
            _this.edgeConfig.route = {
                action: constants_1.ACTIONS.proxy,
                backend: constants_1.BACKENDS.js,
            };
        };
        this.route = route;
        this.edgeConfig = {
            transform: {
                response: [],
                request: [],
            },
        };
    }
    return EdgeResponseWriter;
}());
exports.default = EdgeResponseWriter;
