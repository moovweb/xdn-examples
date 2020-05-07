"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var routeToRegex_1 = __importDefault(require("../utils/routeToRegex"));
var config_1 = __importDefault(require("../config"));
var toEdgeRegex_1 = __importDefault(require("../utils/toEdgeRegex"));
var EdgeResponseWriter_1 = __importDefault(require("./EdgeResponseWriter"));
/**
 * Returns cache object
 * @param {EdgeResponseWriter} edgeWrapper
 * @private
 */
function buildRouteCacheKeysFromEdgeWriter(_a) {
    var edgeConfig = _a.edgeConfig;
    return edgeConfig.cache;
}
/**
 * Returns route action
 * @param {EdgeResponseWriter} edgeWrapper
 * @private
 */
function buildRouteActionFromEdgeWriter(_a) {
    var edgeConfig = _a.edgeConfig;
    return edgeConfig.route;
}
/**
 * Returns transformation object
 * @param {EdgeResponseWriter} edgeWrapper
 * @private
 */
function buildTransformFromEdgeWriter(_a) {
    var edgeConfig = _a.edgeConfig;
    return edgeConfig.transform;
}
/**
 * Build Outer Edge match configuration
 *
 * Notes:
 * - When resulting array is empty, it means that all requests should match
 *
 * @param {Route} route
 * @returns {Object[]} An array of match criteria
 * @private
 */
function buildMatcherFromRoute(route) {
    var match = [];
    if (route.criteria.path) {
        match.push({
            value: '${path}',
            matchRegex: routeToRegex_1.default(route),
        });
    }
    if (route.criteria.method) {
        match.push({
            value: '${method}',
            matchRegex: toEdgeRegex_1.default(route.criteria.method),
        });
    }
    if (route.criteria.headers) {
        Object.entries(route.criteria.headers).forEach(function (_a) {
            var _b = __read(_a, 2), name = _b[0], value = _b[1];
            match.push({
                value: "${req:" + name + "}",
                matchRegex: toEdgeRegex_1.default(value),
            });
        });
    }
    if (route.criteria.cookies) {
        Object.entries(route.criteria.cookies).forEach(function (_a) {
            var _b = __read(_a, 2), name = _b[0], value = _b[1];
            match.push({
                value: "${req:cookie:" + name + "}",
                matchRegex: toEdgeRegex_1.default(value),
            });
        });
    }
    return match;
}
/**
 * Creates an outer edge manager config for the specified router by iterating through
 * each route and calling it with a mock request
 * and response.
 * @param {Router} router
 * @return {EdgeConfig} An object containing the Edge config
 */
function createEdgeConfig(router) {
    var destinations = {};
    if (!Object.keys(router.getDestinations()).length) {
        destinations = {
            default: createDestination(router),
        };
    }
    else {
        for (var d in router.getDestinations()) {
            destinations[d] = createDestination(router.getDestinations()[d]);
        }
    }
    return {
        version: getXdnVersion(),
        backends: __assign({}, config_1.default.get('backends')),
        destinations: destinations,
    };
}
exports.default = createEdgeConfig;
/**
 * Gets the version of @xdn/core.  For this to work in testing an entry needed
 * to be added to moduleNameMapper in the jest config specifically for package.json
 * @return {String}
 */
function getXdnVersion() {
    return require('../package.json').version;
}
function createDestination(router) {
    return {
        index: router.index,
        routes: router
            .getRouteGroups()
            .getRoutes()
            .map(function (route) {
            var writer = new EdgeResponseWriter_1.default({
                url: '',
            }, {}, route);
            // @ts-ignore
            route.handler(writer);
            return {
                path: route.criteria.path,
                match: buildMatcherFromRoute(route),
                cache: buildRouteCacheKeysFromEdgeWriter(writer),
                route: buildRouteActionFromEdgeWriter(writer),
                transform: buildTransformFromEdgeWriter(writer),
            };
        }),
    };
}
