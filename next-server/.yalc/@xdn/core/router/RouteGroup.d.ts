import Route from './Route';
import { RouteCriteria, RouteHandler } from './Router';
/**
 * This class is needed for creating a route group that holds a routes that can
 * be dynamically updated on a local env.
 * @private
 */
export default class RouteGroup {
    readonly name: string;
    private _routes;
    /**
     * @param name Name of the route group - **required**
     */
    constructor(name: string);
    /**
     * Adds route to group.
     * @param criteria The criteria to match.
     * @param handler The handler to use for the route.
     */
    match(criteria: RouteCriteria | string | null, handler: RouteHandler): this;
    /**
     * Clears all routes in group.
     * Used for updating routes dynamically for development purpose.
     */
    clear(): this;
    /**
     * Returns the routes in group.
     * @returns Routes in group
     */
    get routes(): Route[];
    /**
     * Returns number of routes in group.
     * @returns Number of routes in the group.
     */
    get length(): number;
}
