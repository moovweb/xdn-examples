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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var createEdgeConfig_1 = __importDefault(require("../edge/createEdgeConfig"));
var RouteGroup_1 = __importDefault(require("./RouteGroup"));
var RouteGroupList_1 = __importDefault(require("./RouteGroupList"));
var ResponseWriter_1 = __importStar(require("./ResponseWriter"));
var config_1 = __importDefault(require("../config"));
var readBody_1 = __importDefault(require("../utils/readBody"));
var addBuiltInRoutes_1 = __importDefault(require("./addBuiltInRoutes"));
/**
 * A router.
 */
var Router = /** @class */ (function () {
    function Router(options) {
        var _this = this;
        if (options === void 0) { options = { excludeBuiltInRoutes: false }; }
        this.routeGroups = new RouteGroupList_1.default();
        this.plugins = [];
        this.destinations = {};
        this.nextRouterIndex = 0;
        /**
         * Index is used to determine the precedence of a router when routing rules
         * have not resolved to a specific destination. The router with the lowest
         * number wins.
         * @private
         *
         */
        this._index = 0;
        /**
         * Handles a request, sending the response by running the handler for each matched route.
         * @param req The request
         * @param res The response
         */
        this.run = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var router, XDN_ROUTER_DESTINATION, destinationName, _a, _b, route, writer, e_1, e_2_1;
            var e_2, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        router = this;
                        req.url = decodeURI(req.url);
                        return [4 /*yield*/, readBody_1.default(req)];
                    case 1:
                        _d.sent();
                        if (lodash_1.size(this.destinations) > 1) {
                            XDN_ROUTER_DESTINATION = process.env.XDN_ROUTER_DESTINATION;
                            destinationName = (lodash_1.defaultTo(req.headers['x-xdn-destination'], XDN_ROUTER_DESTINATION));
                            if (lodash_1.isEmpty(destinationName)) {
                                // Connascence of algorithm between @xdn/core and @xdn/build-lambda:
                                // when destination cannot be determined by other means, then
                                // we choose the first router that was added to the list.
                                destinationName = lodash_1.minBy(lodash_1.keys(this.destinations), function (destinationName) {
                                    return _this.destinations[destinationName]._index;
                                });
                            }
                            router = this.destinations[destinationName];
                            if (!router) {
                                throw new Error("Routing destination \"" + destinationName + "\" not found.");
                            }
                        }
                        router.plugins.forEach(function (p) { return p.onRequest(req); }); // this gives the plugin an opportunity to update the routes before the request is handled
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 9, 10, 11]);
                        _a = __values(router.routeGroups.getRoutes()), _b = _a.next();
                        _d.label = 3;
                    case 3:
                        if (!!_b.done) return [3 /*break*/, 8];
                        route = _b.value;
                        if (!route.match(req))
                            return [3 /*break*/, 7];
                        writer = new ResponseWriter_1.default(req, res, route);
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, route.handler(writer)
                            // Stop running routes if the route has defined the send response,
                            // otherwise continue to the next route.
                        ];
                    case 5:
                        _d.sent();
                        // Stop running routes if the route has defined the send response,
                        // otherwise continue to the next route.
                        if (writer.sendResponse()) {
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _d.sent();
                        writer.onRouteError(e_1);
                        return [2 /*return*/];
                    case 7:
                        _b = _a.next();
                        return [3 /*break*/, 3];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        this.send404(res);
                        return [2 /*return*/];
                }
            });
        }); };
        if (!options.excludeBuiltInRoutes) {
            addBuiltInRoutes_1.default(this);
        }
    }
    /**
     * Allows the lambda handler to add the __js__ backend in the cloud
     * @private
     * @param {String} name
     * @param {BackendOptions} value
     */
    Router.prototype.setBackend = function (name, value) {
        config_1.default.get('backends')[name] = value;
    };
    /**
     * Constructs plugin and pushes it to registered plugins
     * @param {Class} pluginInstance A plugin to use.
     * @returns {Router} A self-reference, suitable for chaining.
     */
    Router.prototype.use = function (pluginInstance) {
        pluginInstance.onRegister(this);
        this.plugins.push(pluginInstance);
        return this;
    };
    /**
     * Adds a named destination to which you can map traffic using the traffic shaping settings in your environment
     * in the XDN developer console
     * @param {String} name The name of the destination
     * @param {Router} router A router to use when handling requests
     * @returns {Router} A self-reference, suitable for chaining.
     */
    Router.prototype.destination = function (name, router) {
        router.setIndex(this.nextRouterIndex++);
        this.destinations[name] = router;
        return this;
    };
    /**
     * Returns all plugins, including those registered on destination routers.
     */
    Router.prototype.getPlugins = function () {
        var e_3, _a;
        var plugins = this.plugins;
        try {
            for (var _b = __values(Object.values(this.destinations)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var router = _c.value;
                plugins = plugins.concat(router.getPlugins());
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return plugins;
    };
    /**
     * Sets the index at which the router has been added to its parent router
     * @private
     * @param {Number} index
     */
    Router.prototype.setIndex = function (index) {
        this._index = index;
    };
    Object.defineProperty(Router.prototype, "index", {
        /**
         * Returns the index at which the router has been added to its parent router
         * @private
         * @returns router's index
         */
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a RouteGroup to router and calls route register function for group.
     * @private
     * @param {String} name Group name
     * @param {Function} registerRoutesFn Group route register function
     * @returns {Router} A self-reference, suitable for chaining.
     */
    Router.prototype.group = function (name, registerRoutesFn) {
        var newGroup = new RouteGroup_1.default(name);
        registerRoutesFn(newGroup);
        this.routeGroups.add(newGroup);
        return this;
    };
    /**
     * Adds a route.
     *
     * Example:
     *
     * ```js
     *  new Router().match('/p/:productId', async ({ cache, proxy }) => {
     *    cache({
     *      edge: {
     *        maxAgeSeconds: 60 * 60 * 24
     *      }
     *    })
     *
     *    await proxy('origin')
     *  })
     * ```
     *
     * @param {String|Object} criteria Either the path as a string or an object with `path`, `method`, and `headers`.
     * @param {Function} handler A function that accepts a `WrappedResponse`, `Request`, and `params` object.
     * @returns {Router} A self-reference, suitable for chaining.
     */
    Router.prototype.match = function (criteria, handler) {
        this.routeGroups.add(new RouteGroup_1.default('root').match(criteria, handler));
        return this;
    };
    /**
     * Adds a route that matches all requests
     * @param {Function} handler A function that accepts a `WrappedResponse`, `Request`, and `params` object.
     * @returns {Router} A self-reference, suitable for chaining.
     */
    Router.prototype.fallback = function (handler) {
        this.routeGroups.add(new RouteGroup_1.default('fallback').match(null, handler));
        return this;
    };
    /**
     * Send a 404 response
     * @param response
     */
    Router.prototype.send404 = function (response) {
        response.writeHead(404);
        response.end();
    };
    /**
     * Returns edge config from current router
     * @private
     */
    Router.prototype.createEdgeConfig = function () {
        return createEdgeConfig_1.default(this);
    };
    /**
     * @private
     */
    Router.prototype.getDestinations = function () {
        return this.destinations;
    };
    /**
     * @private
     */
    Router.prototype.getRouteGroups = function () {
        return this.routeGroups;
    };
    /**
     * Returns an object containing all of the TTLs for routes cached in the service worker.
     * Keys are route patterns, values are serviceWorkerSeconds.
     * @private
     */
    Router.prototype.getCachedRoutes = function () {
        var e_4, _a;
        var results = [];
        var StubWriter = /** @class */ (function (_super) {
            __extends(StubWriter, _super);
            function StubWriter() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.cacheOptions = {};
                _this.cache = function (options) {
                    _this.cacheOptions = options;
                };
                return _this;
            }
            return StubWriter;
        }(ResponseWriter_1.BaseResponseWriter));
        try {
            for (var _b = __values(this.routeGroups.getRoutes()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var route = _c.value;
                var writer = new StubWriter();
                // @ts-ignore Typescript doesn't like that we're passing in the base class here - but we keep ResponseWriter on the handler method for documentation purposes
                route.handler(writer);
                results.push({ route: route.toRegexString(), cacheOptions: writer.cacheOptions });
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return results;
    };
    return Router;
}());
exports.default = Router;
