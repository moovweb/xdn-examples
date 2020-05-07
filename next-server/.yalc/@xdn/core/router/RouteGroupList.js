"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Holds a list of route groups
 * This class is needed for querying route groups that is needed
 * for keeping the routes hierarchy while changing the routes in a group.
 * For example, updating next.js routes in local dev env.
 */
var RouteGroupList = /** @class */ (function () {
    function RouteGroupList() {
        this.routeGroups = [];
    }
    /**
     * Pushes route group to list.
     * @param group The route group.
     * @returns A self-reference suitable for chaining.
     */
    RouteGroupList.prototype.add = function (group) {
        this.routeGroups.push(group);
        return this;
    };
    /**
     * Returns all route groups.
     * @returns A list of all the route groups.
     */
    RouteGroupList.prototype.getGroups = function () {
        return this.routeGroups;
    };
    /**
     * Returns route group by name.
     * @param name The name of the route group to find.
     * @returns The route group with the given name, or `null` if not found.
     */
    RouteGroupList.prototype.findByName = function (name) {
        return this.routeGroups.find(function (g) { return g.name === name; });
    };
    /**
     * Returns all registered routes in all groups.
     * @returns List of registered routes.
     */
    RouteGroupList.prototype.getRoutes = function () {
        var routes = [];
        this.getGroups().forEach(function (group) {
            routes = routes.concat(group.routes);
        });
        return routes;
    };
    Object.defineProperty(RouteGroupList.prototype, "length", {
        /**
         * Returns the length of route groups list.
         * @returns The number of route groups in the list.
         */
        get: function () {
            return this.routeGroups.length;
        },
        enumerable: true,
        configurable: true
    });
    return RouteGroupList;
}());
exports.default = RouteGroupList;
