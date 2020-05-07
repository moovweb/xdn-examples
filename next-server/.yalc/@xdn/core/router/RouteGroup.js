"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Route_1 = __importDefault(require("./Route"));
/**
 * This class is needed for creating a route group that holds a routes that can
 * be dynamically updated on a local env.
 * @private
 */
var RouteGroup = /** @class */ (function () {
    /**
     * @param name Name of the route group - **required**
     */
    function RouteGroup(name) {
        this._routes = [];
        if (!name) {
            throw new Error('Route group name is required!');
        }
        this.name = name;
    }
    /**
     * Adds route to group.
     * @param criteria The criteria to match.
     * @param handler The handler to use for the route.
     */
    RouteGroup.prototype.match = function (criteria, handler) {
        this._routes.push(new Route_1.default(criteria, handler));
        return this;
    };
    /**
     * Clears all routes in group.
     * Used for updating routes dynamically for development purpose.
     */
    RouteGroup.prototype.clear = function () {
        this._routes = [];
        return this;
    };
    Object.defineProperty(RouteGroup.prototype, "routes", {
        /**
         * Returns the routes in group.
         * @returns Routes in group
         */
        get: function () {
            return this._routes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteGroup.prototype, "length", {
        /**
         * Returns number of routes in group.
         * @returns Number of routes in the group.
         */
        get: function () {
            return this._routes.length;
        },
        enumerable: true,
        configurable: true
    });
    return RouteGroup;
}());
exports.default = RouteGroup;
