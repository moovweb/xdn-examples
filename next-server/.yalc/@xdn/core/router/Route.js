"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cookie_1 = require("cookie");
var route_parser_1 = __importDefault(require("route-parser"));
// @ts-ignore
var regexp_1 = __importDefault(require("route-parser/lib/route/visitors/regexp"));
/**
 * @private
 */
var Route = /** @class */ (function () {
    /**
     * Creates a new Route
     * @param criteria A string or an object with `path`, `headers`, and `method`.
     * @param handler A route handler
     */
    function Route(criteria, handler) {
        // allow providing criteria as string path
        if (!criteria || typeof criteria === 'string') {
            criteria = {
                path: criteria,
            };
        }
        this.criteria = criteria;
        this.handler = handler;
        if (this.criteria.path) {
            this.matcher = new route_parser_1.default(this.criteria.path);
        }
    }
    /**
     * Returns params if route matches the request's method, headers, cookies and path.
     * @param req
     * @return true if the route matches the current request, otherwise false
     */
    Route.prototype.match = function (req) {
        return (this.matchMethod(req) &&
            this.matchHeaders(req) &&
            this.matchCookies(req) &&
            this.matchPath(req) // this must be last so that we return the matcher
        );
    };
    // Match criteria path to request url
    Route.prototype.matchPath = function (req) {
        if (this.matcher) {
            return this.matcher.match(req.url);
        }
        else {
            return {}; // return a match with no params
        }
    };
    // Match criteria method to request method
    Route.prototype.matchMethod = function (req) {
        if (!this.criteria.method || !req.method) {
            return true;
        }
        return new RegExp(this.criteria.method, 'i').test(req.method);
    };
    // Run thru criteria headers and match with request headers
    Route.prototype.matchHeaders = function (req) {
        if (this.criteria.headers) {
            var _loop_1 = function (headerName) {
                var headerRegex = this_1.criteria.headers[headerName];
                var headerValue = req.headers[headerName.toLowerCase()];
                if (Array.isArray(headerValue)) {
                    return { value: headerValue.some(function (v) { return headerRegex.test(v); }) };
                }
                else if (headerValue) {
                    return { value: headerRegex.test(headerValue) };
                }
                else {
                    return { value: false };
                }
            };
            var this_1 = this;
            for (var headerName in this.criteria.headers) {
                var state_1 = _loop_1(headerName);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        return true;
    };
    // Run thru criteria cookies and match with request cookies
    Route.prototype.matchCookies = function (req) {
        if (this.criteria.cookies) {
            var cookieHeader = req.headers['cookie'];
            if (cookieHeader == null) {
                return false;
            }
            var cookieValue = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : cookieHeader;
            var reqCookies = cookie_1.parse(cookieValue);
            for (var cookieKey in this.criteria.cookies) {
                var cookieRegex = this.criteria.cookies[cookieKey];
                if (!cookieRegex.test(reqCookies[cookieKey])) {
                    return false; // fail if one of the cookies doesn't match the expected pattern
                }
            }
        }
        return true;
    };
    Route.prototype.toString = function () {
        var _a = this.criteria, path = _a.path, criteria = __rest(_a, ["path"]);
        if (Object.keys(criteria).length) {
            return JSON.stringify(this.criteria);
        }
        else {
            return path;
        }
    };
    /**
     * Returns a string with the regex representation of the route.
     * @returns Regexp string representation of the route
     */
    Route.prototype.toRegexString = function () {
        if (this.matcher) {
            // @ts-ignore
            return regexp_1.default.visit(this.matcher.ast).re.source.replace(/\\\//g, '/');
        }
        else {
            return '.';
        }
    };
    return Route;
}());
exports.default = Route;
