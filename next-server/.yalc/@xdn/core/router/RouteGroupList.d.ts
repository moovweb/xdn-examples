import RouteGroup from './RouteGroup';
import Route from './Route';
/**
 * Holds a list of route groups
 * This class is needed for querying route groups that is needed
 * for keeping the routes hierarchy while changing the routes in a group.
 * For example, updating next.js routes in local dev env.
 */
export default class RouteGroupList {
    private routeGroups;
    /**
     * Pushes route group to list.
     * @param group The route group.
     * @returns A self-reference suitable for chaining.
     */
    add(group: RouteGroup): this;
    /**
     * Returns all route groups.
     * @returns A list of all the route groups.
     */
    getGroups(): RouteGroup[];
    /**
     * Returns route group by name.
     * @param name The name of the route group to find.
     * @returns The route group with the given name, or `null` if not found.
     */
    findByName(name: string): RouteGroup | undefined;
    /**
     * Returns all registered routes in all groups.
     * @returns List of registered routes.
     */
    getRoutes(): Route[];
    /**
     * Returns the length of route groups list.
     * @returns The number of route groups in the list.
     */
    get length(): number;
}
